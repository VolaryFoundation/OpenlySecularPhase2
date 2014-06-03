
var asWidget = require('widget')

asWidget('footer-contact', function(hub) {
  var widget = this

  widget.template('/widgets/footer-contact/index.html')
  widget.on('installed', function() {
    widget.start()
  })
})
