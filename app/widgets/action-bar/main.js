
var asWidget = require('widget')

asWidget('action-bar', function(hub) {
  var widget = this

  this.template('/widgets/action-bar/index.html')
  this.on('installed', function() {
    widget.start()
  })

  widget.click = function() {
    alert('I CLICKED')
  }
})
