
var asWidget = require('widget')

asWidget('action-newsletter', function(hub) {
  var widget = this

  widget.template('/widgets/action-newsletter/index.html')
  widget.on('installed', function() {
    widget.start()
  })
})
