
var asWidget = require('widget')

asWidget('newsletter-subscribe', function(hub) {
  var widget = this

  widget.template('/widgets/newsletter-subscribe/index.html')
  widget.on('installed', function() {
    widget.start()
  })
})
