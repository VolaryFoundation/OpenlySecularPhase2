
var asWidget = require('widget')
var Backbone = require('backbone')

asWidget('video', function(hub) {
  var widget = this

  widget.template('/widgets/video/index.html')
  widget.on('installed', function() {
    widget.start().hide()
  })

  hub.on('play', function() {
    widget.show()
  })
})
