console.log('from newsletter-subscribe widget')

var asWidget = require('widget')

asWidget('newsletter-subscribe', function(req, res) {
  var widget = this

  widget.template('/widgets/newsletter-subscribe/index.html')
  widget.start()
})
