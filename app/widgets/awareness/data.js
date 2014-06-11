
var hub = require('widget').hub
var $ = require('jquery')

var cache = {}

function loadAbout() {
  $.ajax({
    url: 'http://secularstates.wpengine.com/wp-json',
    type: 'GET',
    success: function(body) {
      cache.about = body
      hub.trigger('aboutTextLoaded', body.group_data.about)
      hub.trigger('missionLoaded', body.group_data.mission)
    }
  })
}

hub.on('aboutTextNeeded', function() {
  if (cache.about) hub.trigger('aboutTextLoaded', cache.about.group_data.about)
  else loadAbout()
})

hub.on('missionNeeded', function() {
  if (cache.about) hub.trigger('missionLoaded', cache.about.group_data.mission)
  else loadAbout()
})

