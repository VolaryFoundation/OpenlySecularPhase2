
var hub = require('widget').hub
var $ = require('jquery')

var cache = {}

function loadAboutText() {
  $.ajax({
    url: 'http://secularstates.wpengine.com/wp-json',
    type: 'GET',
    success: function(body) {
      cache.aboutText = body
      hub.trigger('aboutTextLoaded', body)
    }
  })
}

hub.on('aboutTextNeeded', function() {
  if (cache.aboutText) hub.trigger('aboutTextLoaded', cache.aboutText)
  else loadAboutText()
})

