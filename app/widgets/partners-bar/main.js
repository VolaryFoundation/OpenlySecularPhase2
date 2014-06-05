
var asWidget = require('widget')

asWidget('partners-bar', function(hub) {
  var widget = this

  this.template('/widgets/partners-bar/index.html')
  this.on('installed', function() {
    widget.start()
  })

  widget.click = function() {
    alert('I CLICKED')
  }
})
