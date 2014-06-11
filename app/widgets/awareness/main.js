
var asWidget = require('widget')
var rivets = require('rivets')

// require all widgets

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


rivets.formatters.eql = function(name, input) {
  return name == input;
}

asWidget('awareness', function(hub) {
  var widget = this
  var win = window

  widget.template('/widgets/awareness/index.html')
  widget.on('installed', function() {
    widget.start()
    widget.homepage()

    widget.set('partners', [
      { name: 'john', company: '...he doesnt have one' },
      { name: 'kendra', company: 'loves the cats' }
    ])
  })

  hub.on("pageSelected", function(name) {
    widget.set("page", name);
  })

  widget.homepage = function() {
    hub.trigger('pageSelected', 'home')
  }

  widget.aboutpage = function() {
    hub.trigger('pageSelected', 'about')
  }

  widget.updatepage = function() {
    hub.trigger('pageSelected', 'update')
  }

  var arr = [ 'GO.', 'AWAY.', 'JOHN.' ]
  widget.set('zapMessage', '')

  var interval = setInterval(function() {
    if (!arr[0]) clearInterval(interval)
    else {
      var text = arr.shift()
      widget.set('zapMessage', widget.get('zapMessage') + ' ' + text)
    }
  }, 2000)
})

module.exports = {}
