
var Backbone = require('backbone')
var hub = require('widget').hub
var _ = require('lodash')

//routing
var router = new (Backbone.Router.extend({}))

router.route('', 'home', function() {
})

router.route('_/who-we-are', 'whoWeAre', function() {
  hub.trigger('navTo', 'whoWeAre')
})

router.route('_/mission', 'mission', function() {
  hub.trigger('navTo', 'mission')
})

router.route('_/partners', 'partners', function() {
  hub.trigger('navTo', 'partners')
})

router.route('_/media', 'media', function() {
  hub.trigger('navTo', 'media')
})

router.route('_/donation', 'donation', function() {
  hub.trigger('navTo', 'donation')
})

router.route('_/contact', 'contact', function() {
  hub.trigger('navTo', 'contact')
})

router.route('_/faq', 'faq', function() {
  hub.trigger('navTo', 'faq')
})

router.route('_/story', 'story', function() {
  hub.trigger('navTo', 'story')
})

router.route('_/partnersApplication', 'partnersApplication', function() {
  hub.trigger('navTo', 'partnersApplication')
})

router.route('_/articles/:slug', 'article', function(slug) {
  //hub.trigger('navTo', 'media')
  hub.trigger('navTo', 'article', slug)
})

router.route('_/releases/:slug', 'release', function(slug) {
  //hub.trigger('navTo', 'media')
  hub.trigger('navTo', 'release', slug)
})

hub.on('urlHash', function(hash) {
  router.navigate('_/' + hash)
})

hub.on('appReady', _.after(2, function() {
  Backbone.history.start()
}))
