
var asWidget = require('widget')
var $ = require('jquery')
var rivets = require('rivets')

rivets.formatters.featuredImage = function(val) {
  if (!val.featured_image) return false
  return val.featured_image.source
}

asWidget('about', function(hub) {
  var widget = this

  this.template('/widgets/about/index.html')
  this.on('installed', function() {
    widget.start()
    hub.once('aboutScrolledTo', function() {
      hub.trigger('aboutNeeded')
      hub.trigger('teamNeeded')
      hub.trigger('partnersNeeded')
    })
  })

  hub.on('aboutLoaded', function(about) {
    widget.set('about', about)
  })

  hub.on('teamLoaded', function(team) {
    widget.set('team', team)
  })

  hub.on('partnersLoaded', function(partners) {
    widget.set('partners', partners)
  })

})
