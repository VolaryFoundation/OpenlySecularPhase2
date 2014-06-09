
var asWidget = require('widget')
var $ = require('jquery')

asWidget('blog', function(hub) {
  var widget = this

  this.template('/widgets/blog/index.html')
  this.on('installed', function() {
    widget.start()
    $.ajax ({
      url : "http://secularstates.wpengine.com/wp-json/posts",
      type: "GET",
      success: function(body) {
        widget.set("posts", body);
      }
    })


  })

  widget.click = function() {
    alert('I CLICKED')
  }

})
