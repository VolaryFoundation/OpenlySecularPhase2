
var asWidget = require('widget')

asWidget('footer-bar', function(hub) {
  var widget = this

  this.template('/widgets/footer-bar/index.html')
  this.on('installed', function() {
    widget.start()
  })

  widget.click = function() {
    alert('I CLICKED')
  }
})
