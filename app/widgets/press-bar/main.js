
var asWidget = require('widget')

asWidget('press-bar', function(hub) {
  var widget = this

  this.template('/widgets/press-bar/index.html')
  this.on('installed', function() {
    widget.start()
  })

  widget.click = function() {
    alert('I CLICKED')
  }
})
