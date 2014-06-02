
var asWidget = require('widget')

asWidget('top-bar', function(hub) {
  var widget = this

  this.template('/widgets/top-bar/index.html')
  this.on('installed', function() {
    widget.start()
  })

  widget.click = function() {
    alert('I CLICKED')
  }
})
