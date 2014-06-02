
var asWidget = require('widget')

asWidget('action-share', function(hub) {
  var widget = this

  widget.template('/widgets/action-share/index.html')
  widget.on('installed', function() {
    widget.start()
  })
})
