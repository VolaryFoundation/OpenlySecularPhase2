
var asWidget = require('widget')

asWidget('bar', function(hub) {
  var widget = this

  this.template('/widgets/bar/index.html')
  this.on('installed', function() {
    widget.start()
  })

  widget.click = function() {
    alert('I CLICKED')
  }
})
