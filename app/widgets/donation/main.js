
var asWidget = require('widget')

asWidget('donation', function(hub) {
  var widget = this

  widget.template('/widgets/donation/index.html')
  widget.on('installed', function() {
    widget.start().show()
  })

  widget.set('step', 1)

  hub.on('showDonation', function() {
    widget.show()
  })

})
