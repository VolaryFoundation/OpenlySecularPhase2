
var asWidget = require('widget')

asWidget('action-donate', function(hub) {
  var widget = this

  widget.template('/widgets/action-donate/index.html')
  widget.on('installed', function() {
    widget.start()
  })
})
