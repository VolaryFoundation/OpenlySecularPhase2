
var asWidget = require('widget')
var $ = require('jquery')
var rivets = require('rivets')
var moment = require('moment')

rivets.formatters.postDate = function(raw) {
  return moment(raw).format('MMMM d, YYYY')
}

asWidget('media', function(hub) {
  var widget = this

  this.template('/widgets/media/index.html')
  this.on('installed', function() {
    widget.start()
    hub.once('mediaScrolledTo', function() {
      hub.trigger('blogNeeded')
      hub.trigger('newsNeeded')
      hub.trigger('releasesNeeded')
    })
  })

  hub.on('blogLoaded', function(posts) {
    widget.set('posts', posts)
  })

  hub.on('newsLoaded', function(articles) {
    widget.set('news', articles)
  })

  hub.on('releasesLoaded', function(releases) {
    widget.set('releases', releases)
  })

})
