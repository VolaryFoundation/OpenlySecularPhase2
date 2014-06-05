
var asWidget = require('widget')

asWidget('nav-bar', function(hub) {
  var widget = this

  this.template('/widgets/nav-bar/index.html')
  this.on('installed', function() {
    widget.start()
  })

  widget.click = function() {
    alert('I CLICKED')
  }
})
