
var asWidget = require('widget')
var rivets = require('rivets')
var _ = require('lodash')
var $ = require('jquery')
var Backbone = require('backbone')
Backbone.$ = $
require('../../assets/rivets_config')

// require all widgets

asWidget('awareness', function(hub) {
  var widget = this
  window.hub = hub

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
    hub.trigger('urlHash', name)
    widget.set("page", name)
  })
  widget.navToWhoWeAre = function() { hub.trigger('pageSelected', 'whoWeAre') }
  widget.navToMission = function() { hub.trigger('pageSelected', 'mission') }
  widget.navToPartners = function() { hub.trigger('pageSelected', 'partners') }
  widget.navToFaq = function() { hub.trigger('pageSelected', 'faq') }
  widget.navToMedia = function() { hub.trigger('pageSelected', 'media') }

  widget.navToVideo = function() {
    hub.trigger('play')
  }

  widget.navToStory = function() {
    hub.trigger('urlHash', 'story')
    widget.set('showingStory', !widget.get('showingStory'))
    if (!widget.get('showingStory')) hub.trigger('urlHash', '')
  }

  widget.navToDonation = function() {
    hub.trigger('showDonation')
  }

  widget.navToFaq = function() {
    hub.trigger('showFaq')
  }

  widget.navToContact = function() {
    hub.trigger('showContact')
  }

  hub.on('donationCompleted', function() {
    widget.set('alreadyDonated', true)
  })

  function cap(str) { return str.charAt(0).toUpperCase() + str.slice(1) }
  hub.on('navTo', function(place) {
    var fn = widget['navTo' + cap(place)]
    if (fn) fn()
  })

  function subscribeEmail(email, name) {

    if (name) {
      var parts = name.split(' ')
      var first = parts[0]
      var last = parts.slice(1).join(' ')
    }

    $.ajax({
      async: false,
      url: 'http://openlysecular.us8.list-manage1.com/subscribe/post-json',
      type: 'GET',
      dataType    : 'jsonp',
      jsonp: 'c',
      contentType: "application/json; charset=utf-8",
      data: {
        u: 'cf4a6ca2c3378383a4f3a714f',
        id: 'd4555ed76d',
        MERGE0: email,
        MERGE1: first,
        MERGE2: last,
        b_cf4a6ca2c3378383a4f3a714f_d4555ed76d: ''
      }
    })
  }

  widget.set('subscribeStep', 1)
  widget.nextSubscribeStep = function() {

    var step = widget.get('subscribeStep')
    var next = step + 1

    if (next == 2) {
      if (!/\w+@\w+\.\w+/.test(widget.get('subscribeEmail'))) {
        return widget.set('subscribeEmailError', 'Email must be valid.')
      }
      hub.on('appAboutToExit', widget.nextSubscribeStep)
    } else if (next == 3) {
      hub.off('appAboutToExit', widget.nextSubscribeStep)
      subscribeEmail(widget.get('subscribeEmail'), widget.get('subscribeName'))
    }

    widget.set('subscribeStep', next)
  }

  var photos = _.shuffle([
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
    '/widgets/awareness/img/17.png',
    '/widgets/awareness/img/18.png',
    '/widgets/awareness/img/19.png',
    '/widgets/awareness/img/20.png',
    '/widgets/awareness/img/21.png',
    '/widgets/awareness/img/22.png',
    '/widgets/awareness/img/23.png'
  ])

  widget.set('photoLists', _.times(4, function(i) {
    return photos.slice(i * 4, (i * 4) + 4)
  }))

  hub.on('sectionInView', function(name) {
    widget.set('activeSection', name)
  })

  // this should be dynamic but it isnt in groupData yet
  hub.on('aboutLoaded', function(groupData) {
    var title = 'Openly Secular'
    document.title = title
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
