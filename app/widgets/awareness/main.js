
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

function isElementInViewport(el) {

  var docTop = $(window).scrollTop()
  var docHeight = $(window).height()
  var docBottom = docTop + docHeight

  var elTop = $(el).offset().top;
  var elBottom = elTop + $(el).height();

  // eltop is in top half of page, or elbottom is in bottom half of page
  return ((elTop >= docTop && elTop <= docTop + (docHeight / 2)) || (elBottom <= docBottom && elBottom >= docBottom - (docHeight / 2)))
}

asWidget('awareness', function(hub) {
  var widget = this

  // TODO hacky
  window.addEventListener('scroll', _.throttle(function() {
    var bodyBounds = document.body.getBoundingClientRect()
    var bodyTop = bodyBounds.top * -1
    var docRange = [ bodyTop, bodyTop + bodyBounds.height ]
    var sections = document.querySelectorAll('section')
    var possibleSections = _.filter(sections, function(section) {
      return isElementInViewport(section)
    })
    if (possibleSections[0]) {
      var section = _.last(possibleSections)
      if (section.getAttribute('id') == widget.get('activeSection')) return
      hub.trigger(section.getAttribute('id') + 'ScrolledTo')
      hub.trigger('sectionInView', section.getAttribute('id'))
    }
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
    widget.set("page", name)
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

//==========================================================================//
// This file is part of Widget Server.                                      //
//                                                                          //
// Widget Server is Copyright 2014 Volary Foundation and Contributors       //
//                                                                          //
// Widget Server is free software: you can redistribute it and/or modify it //
// under the terms of the GNU Affero General Public License as published    //
// by the Free Software Foundation, either version 3 of the License, or     //
// at your option) any later version.                                       //
//                                                                          //
// Widget Server is distributed in the hope that it will be useful, but     //
// WITHOUT ANY WARRANTY; without even the implied warranty of               //
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU        //
// Affero General Public License for more details.                          //
//                                                                          //
// You should have received a copy of the GNU Affero General Public         //
// License along with Widget Server.  If not, see                           //
// <http://www.gnu.org/licenses/>.                                          //
//==========================================================================//
