
var hub = require('widget').hub
var $ = require('jquery')

var BASE_URL = 'http://tinytower.info/wp-json'

var cache = {}

function loadAbout() {
  $.ajax({
    url: BASE_URL,
    type: 'GET',
    success: function(body) {
      cache.about = body
      hub.trigger('aboutLoaded', body.group_data)
    }
  })
}

function loadPosts() {
  $.ajax({
    url: BASE_URL + '/posts',
    type: 'GET',
    success: function(body) {
      debugger
    }
  })
}

hub.on('aboutNeeded', function() {
  if (cache.about) hub.trigger('aboutLoaded', cache.about)
  else loadAbout()
})

hub.on('teamNeeded', function() {
  $.ajax(BASE_URL + '/posts?type=team', {
    type: 'GET',
    success: function(team) {
      hub.trigger('teamLoaded', team)
    }
  })
})

hub.on('partnersNeeded', function() {
  $.ajax(BASE_URL + '/posts?type=partners', {
    type: 'GET',
    success: function(partners) {
      hub.trigger('partnersLoaded', partners)
    }
  })
})

hub.on('blogNeeded', function() {
  $.ajax(BASE_URL + '/posts?filter[category_name]=blog', {
    success: function(blog) {
      hub.trigger('blogLoaded', blog)
    }
  })
})

hub.on('newsNeeded', function() {
  $.ajax(BASE_URL + '/posts?filter[category_name]=media-mention', {
    success: function(news) {
      hub.trigger('newsLoaded', news)
    }
  })
})

hub.on('releasesNeeded', function() {
  $.ajax(BASE_URL + '/posts?filter[category_name]=press-release', {
    success: function(releases) {
      hub.trigger('releasesLoaded', releases)
    }
  })
})
