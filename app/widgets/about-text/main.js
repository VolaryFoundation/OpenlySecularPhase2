
var asWidget = require('widget')
var $ = require('jquery')

asWidget('about-text', function(hub) {
  var widget = this

  this.template('/widgets/about-text/index.html')
  this.on('installed', function() {
    widget.start()
    hub.trigger('aboutTextNeeded')
    hub.trigger('missionNeeded')
  })

  hub.on('missionLoaded', function(text) {
    widget.set('mission', text)
  })

  hub.on('aboutTextLoaded', function(text) {
    widget.set('about', text)
  })

})
