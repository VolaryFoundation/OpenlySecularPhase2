
var rsvp = require('rsvp')
var fs = require('fs')
var _ = require('lodash')
var sass = require('node-sass')
var browserify = require('browserify')
var debowerify = require('debowerify')
var widgetPath = function(name) { return __dirname + '/../widgets/' + name }

function promise(fn) { return new rsvp.Promise(fn) }

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

function writeFile(path, name, contents) {
  return promise(function(res, rej) {
    fs.writeFile(path + '/' + name, contents, function(e) {
      e ? rej(e) : res()
    })
  })
}

function join(delim) {
  return function(arr) { return arr.join(delim) }
}

function buildWidgetList(widgetName) {

  function buildWidget(name) {
    return promise(function(res, rej) {
      var path = widgetPath(name)
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
          var compiled
          try { 
            compiled = _.template(contents, config) 
          } catch(e) {
            rej(e)
          }

          sass.render({
            data: compiled,
            success: function(css) { res(css) },
            error: function(e) { rej(e) }
          })
        })
    })
  }

  function buildJS() {
    return promise(function(res, rej) { 
      var paths = _.flatten(_.pluck(widgets, 'js'))
      browserify([ __dirname + '/../tasks/updateConfig' ])
        .transform(debowerify)
        .bundle({}, function(e, js) {
          e ? rej(e) : res(js)
        })
    })
  }

  function buildHTML() {
    var paths = _.flatten(_.pluck(widgets, 'html'))
    var reading = paths.map(readFile)
    return rsvp.all(reading).then(function(htmls) {
      return htmls.map(function(html, i) {
        return "<script type='text/html' id='" + paths[i] + "'>" + html + "</script>"
      })
    })
  }

  return rsvp.hash({
    css: buildCSS(),
    js: buildJS(),
    html: buildHTML()
  })
}

function storeFiles(config, files) {
  var path = __dirname + '/../domains/' + config.domain + '/build' 
  return rsvp.all([
    writeFile(path, 'build.css', files.css),
    writeFile(path, 'build.js', files.js),
    writeFile(path, 'build.html', "<!DOCTYPE html><head><link rel='stylesheet' href='build.css' /></head><body>" + files.html + "<script src='build.js'></script></body></html>")
  ])
}

module.exports = function(config) {
  return buildWidgetList(config.widget)
    .then(_.partial(buildFiles, config))
    .then(_.partial(storeFiles, config))
}
