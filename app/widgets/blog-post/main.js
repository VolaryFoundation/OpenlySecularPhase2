
var asWidget = require('widget')

asWidget('blog-post', function(hub) {
  var widget = this

  this.template('/widgets/blog-post/index.html')
  this.on('installed', function() {
    widget.start()
  })

  widget.click = function() {
    alert('I CLICKED')
  }
})
