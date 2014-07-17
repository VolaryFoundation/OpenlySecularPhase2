
var asWidget = require('widget')
var Backbone = require('backbone')

asWidget('video', function(hub) {
  var widget = this

  widget.template('/widgets/video/index.html')

  widget.on('change:visible', function() {
    if (!widget.get('visible')) {
      hub.trigger('urlHash', '')
      widget.stop()     
    }
  })

  hub.on('play', function() {
    widget.start()
  })
})
