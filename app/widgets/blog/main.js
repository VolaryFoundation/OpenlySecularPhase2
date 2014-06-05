
var asWidget = require('widget')

asWidget('blog', function(hub) {
  var widget = this

  this.template('/widgets/blog/index.html')
  this.on('installed', function() {
    widget.start()
  })

  widget.click = function() {
    alert('I CLICKED')
  }
})
