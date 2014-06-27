
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
    $(document.body).animate({ scrollTop: offset - 100 }, '500')
  }
}

function isElementInViewport(el) {

  var docTop = $(window).scrollTop()
  var docHeight = $(window).height()
  var docBottom = docTop + docHeight

  var elTop = $(el).offset().top;
  var elBottom = elTop + $(el).height();

  // eltop is in top half of page//, or elbottom is in bottom half of page
  return ((elTop >= docTop && elTop <= docTop + (docHeight / 2)))// || (elBottom <= docBottom && elBottom >= docBottom - (docHeight / 2)))
}

function shouldSectionBeLoaded(el) {

  var docTop = $(window).scrollTop()
  var docHeight = $(window).height()
  var docBottom = docTop + docHeight

  var elTop = $(el).offset().top;
  var elBottom = elTop + $(el).height();

  return elTop <= docTop + docHeight
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
    var possibleLoading = _.filter(sections, function(section) {
      return shouldSectionBeLoaded(section)
    })

    if (possibleSections[0]) {
      var section = _.last(possibleSections)
      if (section.getAttribute('id') == widget.get('activeSection')) return
      hub.trigger('sectionInView', section.getAttribute('id'))
    }

    if (possibleLoading[0]) {
      _.each(possibleLoading, function(section) {
        hub.trigger(section.getAttribute('id') + 'ScrolledTo')
      })
    }

  }, 500))

  widget.set('logo', '/widgets/awareness/img/logo.png')

  widget.template('/widgets/awareness/index.html')
  widget.on('installed', function() {

    widget.start()

    widget.set('partners', [
      { name: 'john', company: '...he doesnt have one' },
      { name: 'kendra', company: 'loves the cats' }
    ])
  })

  hub.on("pageSelected", function(name) {
    widget.set("page", name)
  })

  widget.play = function() {
    hub.trigger('play')
  }

  widget.toggleStoryForm = function() {
    widget.set('showingStoryForm', !widget.get('showingStoryForm'))
  }

  widget.toWhoWeAre = function() {
    hub.trigger('pageSelected', 'whoWeAre')
  }

  widget.toMission = function() {
    hub.trigger('pageSelected', 'mission')
  }

  widget.toPartners = function() {
    hub.trigger('pageSelected', 'partners')
  }

  widget.toFAQ = function() {
    hub.trigger('pageSelected', 'faq')
  }

  widget.toMedia = function() {
    hub.trigger('pageSelected', 'media')
  }

  widget.showDonation = function() {
    hub.trigger('showDonation')
  }

  widget.showContact = function() {
    hub.trigger('showContact')
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
    '/widgets/awareness/img/01.png',
    '/widgets/awareness/img/02.png',
    '/widgets/awareness/img/03.png',
    '/widgets/awareness/img/04.png',
    '/widgets/awareness/img/05.png',
    '/widgets/awareness/img/06.png',
    '/widgets/awareness/img/07.png',
    '/widgets/awareness/img/08.png',
    '/widgets/awareness/img/09.png',
    '/widgets/awareness/img/10.png',
    '/widgets/awareness/img/11.png',
    '/widgets/awareness/img/12.png',
    '/widgets/awareness/img/13.png',
    '/widgets/awareness/img/14.png',
    '/widgets/awareness/img/15.png',
    '/widgets/awareness/img/16.png',
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
