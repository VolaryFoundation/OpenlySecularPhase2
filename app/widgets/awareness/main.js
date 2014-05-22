
var asWidget = require('widget')
var rivets = require('rivets')

rivets.adapters['.'] = {
  subscribe: function(obj, keypath, callback) { },
  unsubscribe: function(obj, keypath, callback) { },
  read: function(obj, keypath) {
    return obj[keypath]
  },
  publish: function(obj, keypath, value) {
    obj[keypath] = value
    return obj
  }
}

rivets.adapters[':'] = {
  subscribe: function(obj, keypath, callback) {
    obj.on('change:' + keypath, callback)
  },
  unsubscribe: function(obj, keypath, callback) {
    obj.off('change:' + keypath, callback)
  },
  read: function(obj, keypath) {
    return obj.get(keypath)
  },
  publish: function(obj, keypath, value) {
    obj.set(keypath, value)
  }
}

asWidget('awareness', function(hub) {
  var widget = this

  widget.set('html', '<h1>Demo for widget server</h1><div rv-widget data-widget-name="newsletter-subscribe"></div>')
  widget.start()
})

setTimeout(function() {
  rivets.bind(document.getElementById('app'), {})
}, 100)
