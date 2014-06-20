
var asWidget = require('widget')
var rivets = require('rivets')
var _ = require('lodash')
var $ = require('jquery')
require('../../assets/rivets_config')

// require all widgets

rivets.binders.autoscroll = function(el, val) {

  var winHeight = document.body.clientHeight
  var placeholder = document.querySelector('#placeholder')
  if (placeholder) placeholder.style.height = (winHeight - 290) + 'px'

  var section = document.getElementById(val)
  if (section) {
    var bodyRect = document.body.getBoundingClientRect()
    var elemRect = section.getBoundingClientRect()
    var offset   = elemRect.top - bodyRect.top
    el.scrollTop = offset
  }
}

function isElementInViewport(elem) {

  var docViewTop = $(window).scrollTop();
  var docViewBottom = docViewTop + $(window).height();

  var elemTop = $(elem).offset().top;
  var elemBottom = elemTop + $(elem).height();

  return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
}

asWidget('awareness', function(hub) {
  var widget = this

  // TODO hacky
  window.addEventListener('scroll', _.throttle(function() {
    var bodyBounds = document.body.getBoundingClientRect()
    var bodyTop = bodyBounds.top * -1
    var docRange = [ bodyTop, bodyTop + bodyBounds.height ]
    var sections = document.querySelectorAll('section')
    var sectionRanges = _.each(sections, function(section) {
      if (isElementInViewport(section)) {
        hub.trigger(section.getAttribute('id') + 'ScrolledTo')
        hub.trigger('sectionInView', section.getAttribute('id'))
      }
    })
  }, 500))

  widget.set('logo', '/widgets/awareness/img/logo.png')

  widget.template('/widgets/awareness/index.html')
  widget.on('installed', function() {

    widget.start()
    widget.toHomePage()

    widget.set('partners', [
      { name: 'john', company: '...he doesnt have one' },
      { name: 'kendra', company: 'loves the cats' }
    ])
  })

  hub.on("pageSelected", function(name) {
    widget.set("page", name);
  })

  widget.toHomePage = function() {
    hub.trigger('pageSelected', 'home')
  }

  widget.toAboutPage = function() {
    hub.trigger('pageSelected', 'about')
  }

  widget.toUpdatePage = function() {
    hub.trigger('pageSelected', 'update')
  }

  widget.showDonation = function() {
    hub.trigger('showDonation')
  }

  widget.set('subscribeStep', 1)
  widget.nextSubscribeStep = function() {
    var step = widget.get('subscribeStep')
    var next = step + 1
    widget.set('subscribeStep', next)
    if (next == 3) {
      console.log('sending subscribe data', widget.get('subscribeEmail'), widget.get('subscribeName'))
    }
  }

  var photos = [
    '/widgets/awareness/img/6a00d8341c730253ef0133f5948308970b-800wi.jpg',
    '/widgets/awareness/img/6a00d8341c730253ef01538f60a0d5970b.jpg',
    '/widgets/awareness/img/6a00d8341c730253ef015435cd8835970c-800wi.png',
    '/widgets/awareness/img/6a00d8341c730253ef019102c3ed31970c.jpg',
    '/widgets/awareness/img/6a00d8341c730253ef016304818ad8970d-800wi.jpg',
    '/widgets/awareness/img/628x471.jpg',
    '/widgets/awareness/img/169951478_640.jpg',
    '/widgets/awareness/img/Barack-Obama-Makes-a-Stand-with-It-Gets-Better-Video-2.jpg',
    '/widgets/awareness/img/colbert.png',
    '/widgets/awareness/img/donte-whiter-it-gets-better.jpg',
    '/widgets/awareness/img/Eric-James-Borges-620x465.jpg',
    '/widgets/awareness/img/ht_adam_white_BYU_youtube2_120408_wmain.jpg',
    '/widgets/awareness/img/it-gets-better-book-video.jpg',
    '/widgets/awareness/img/itgetsbetter1.png',
    '/widgets/awareness/img/molly-tarlov-awkward-it-gets-better-project.png'
  ]

  widget.set('photoLists', _.times(6, function() {
    return _.sample(photos, 10)
  }))

  hub.on('sectionInView', function(name) {
    widget.set('activeSection', name)
  })
})

module.exports = {}
