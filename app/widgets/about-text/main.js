
var asWidget = require('widget')
var $ = require('jquery')

asWidget('about-text', function(hub) {
  var widget = this

  this.template('/widgets/about-text/index.html')
  this.on('installed', function() {
    widget.start()
    $.ajax ({
      url : "http://secularstates.wpengine.com/wp-json",
      type: "GET",
      success: function(body) {
        widget.set("body", body);
      }
    })


  })

  widget.click = function() {
    alert('I CLICKED')
  }

})
