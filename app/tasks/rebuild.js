
var rsvp = require('rsvp')
var fs = require('fs')
var _ = require('lodash')
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

function buildFiles(widgets) {

  function buildCSS() {
    return promise(function(res, rej) { res('') })
  }

  function buildJS() {
    return promise(function(res, rej) { res('') })
  }

  function buildHTML() {
    return promise(function(res, rej) { res('') })
  }

  return rsvp.hash({
    css: buildCSS(),
    js: buildJS(),
    html: buildHTML()
  })
}

function storeFiles(files) {
  console.log('storing files', files)
}

module.exports = function(config) {
  return buildWidgetList(config.widget)
    .then(buildFiles)
    .then(storeFiles)
}
