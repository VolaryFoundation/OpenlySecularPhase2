
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

rivets.configure({
  handler: function(target, event, binding) {
    if (!this.allowDefault) event.preventDefault()
    this.call(binding.model, event, target, binding)
  }
})

rivets.formatters.eql = function(name, input) {
  return name == input;
}

rivets.formatters.gt = function(a, b) {
  return a > b
}
