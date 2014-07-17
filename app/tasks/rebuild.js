
var AWS = require('aws-sdk');
AWS.config.region = 'us-west-2';
var rsvp = require('rsvp')
var fs = require('fs')
var _ = require('lodash')
var sass = require('node-sass')
var through = require('through')
var browserify = require('browserify')
var envConfig = require('config')
var widgetPath = function(name) { return __dirname + '/../widgets/' + name }

function promise(fn) { return new rsvp.Promise(fn) }
function handlePromise(res, rej) {
  return function(e, data) { e ? rej(e) : res(data) }
}

function contains(str) {
  return function(testee) {
    return _.contains(testee, str)
  }
}

function prepend(a) {
  return function(b) { return a + b }
}

function readFile(path) {
  return promise(function(res, rej) {
    fs.readFile(path, 'utf-8', function(e, data) {
      e ? rej(e) : res(data)
    })
  })
}

var writeFile = {

  s3: function(name, contents, domain, contentType, locationConfig) {
    var bucket = locationConfig.bucket ||process.env.S3_BUCKET || envConfig.aws.bucket
    var s3 = new AWS.S3({params: {Bucket: bucket, Key: domain + '/' + name, ACL: "public-read", ContentType: contentType}});
    return promise(function(res, rej) {
      s3.createBucket(function() {
        s3.putObject({Body: contents}, function(e) {
          e ? rej(e) : res()
        })
      })
    })
  },


  local: function(name, contents, domain, notUsed) {
    var path = __dirname + '/../domains/' + domain + '/build'
    return promise(function(res, rej) {
      fs.writeFile(path + '/' + name, contents, function(e) {
        e ? rej(e) : res()
      })
    })
  }
};

function join(delim) {
  return function(arr) { return arr.join(delim) }
}

function buildWidgetList(widgetName) {

  function buildWidget(name) {
    return promise(function(res, rej) {
      var path = widgetPath(name)
      console.log('path', path)
      fs.readdir(path, function(e, files) {
        var fullPaths = files.map(prepend(path + '/'))
        if (e) rej(e)
        else res({
          name: name,
          css: fullPaths.filter(contains('.scss')),
          js: fullPaths.filter(contains('.js')),
          html: fullPaths.filter(contains('.html'))
        })
      })
    })
  }

  function extractWidgetName(attr) {
    return attr.split('rv-widget-')[1]
  }

  function findSubWidgetNames(paths) {
    return rsvp.all(paths.map(readFile)).then(function(docs) {
      return docs.reduce(function(widgetNames, doc) {
        var match = doc.match(/rv-widget-(([\w-]+))/g)
        if (match) {
          return widgetNames.concat(match.map(extractWidgetName))
        } else return widgetNames
      }, [])
    })
  }

  function subWidgets(list, name) {
    return buildWidget(name).then(function(widget) {
      return findSubWidgetNames(widget.html).then(function(subNames) {
        return rsvp.all(subNames.map(_.partial(subWidgets, list))).then(function(subs) {
          list.unshift(widget)
          return list
        })
      })
    })
  }

  return subWidgets([], widgetName)
}

function buildFiles(config, widgets) {

  function buildCSS() {
    return promise(function(res, rej) {
      var reading = _.flatten(_.pluck(widgets, 'css')).map(readFile)
      rsvp.all(reading)
        .then(join('\n\n'))
        .then(function(contents) {

          // lets deal with this later TODO
          var compiled = _.template(contents, config)

          sass.render({
            data: compiled,
            success: function(css) { res(css) },
            error: function(e) { rej(e) }
          })
        }).catch(console.log.bind(console, 'ERROR: '))
    })
  }

  function buildJS() {
    return promise(function(res, rej) {
      var paths = _.flatten(_.pluck(widgets, 'js')).map(function(path) { return path.replace('.js', '') })

      var afterHook = promise(function(res, rej) {
        browserify('./app/hooks/after').bundle({ debug: true }, handlePromise(res, rej))
      })

      var main = promise(function(res, rej) {
        browserify(paths)
          .transform(function() {
            var data = ''
            return through(function(b) { data += b }, function() {
              var replaced = data
                .replace(/underscore/g, 'lodash')
              this.queue(replaced)
              this.queue(null)
            })
          })
          .add('./app/hooks/after')
          .bundle({ debug: true }, handlePromise(res, rej))
      })

      rsvp.all([ main, afterHook ]).then(function(scripts) {
        res(scripts[0])
      }, function(e) {
        rej(e)
      })
    })
  }

  function buildHTML() {
    var paths = _.flatten(_.pluck(widgets, 'html'))
    var reading = paths.map(readFile)
    return rsvp.all(reading).then(function(htmls) {
      return htmls.map(function(html, i) {
        return "<script type='text/html' id='" + paths[i].replace(/.*\/widgets/, '/widgets') + "'>" + html + "</script>"
      }).join('')
    })
  }

  var hash = rsvp.hash({
    css: buildCSS(),
    js: buildJS(),
    html: buildHTML()
  })

  return hash
}

// clean up TODO
function storeFiles(config, files) {
  var location = (config.storageLocation && config.storageLocation.service) ? config.storageLocation.service : 'local'
  if (['local', 's3'].indexOf(location) <= -1) {rej()}
  return rsvp.all([
    writeFile[location]('build.css', files.css, config.domain, 'text/css', config.storageLocation),
    writeFile[location]('build.js', files.js, config.domain, 'application/javascript', config.storageLocation),
    writeFile[location]('index.html', "<!DOCTYPE html><head><meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'><link rel='stylesheet' href='build.css' /></head><body><div id='app' rv-widget-" + config.widget + "></div>" + files.html + "<script src='build.js'></script></body></html>", config.domain, 'text/html', config.storageLocation )
  ])
}

module.exports = function(config) {
  return buildWidgetList(config.widget)
    .then(_.partial(buildFiles, config))
    .then(_.partial(storeFiles, config))
}

//==========================================================================//
// This file is part of Widget Server.                                      //
//                                                                          //
// Widget Server is Copyright 2014 Volary Foundation and Contributors       //
//                                                                          //
// Widget Server is free software: you can redistribute it and/or modify it //
// under the terms of the GNU Affero General Public License as published    //
// by the Free Software Foundation, either version 3 of the License, or     //
// at your option) any later version.                                       //
//                                                                          //
// Widget Server is distributed in the hope that it will be useful, but     //
// WITHOUT ANY WARRANTY; without even the implied warranty of               //
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU        //
// Affero General Public License for more details.                          //
//                                                                          //
// You should have received a copy of the GNU Affero General Public         //
// License along with Widget Server.  If not, see                           //
// <http://www.gnu.org/licenses/>.                                          //
//==========================================================================//
