
var asWidget = require('widget')
var $ = require('jquery')
var rivets = require('rivets')

rivets.formatters.featuredImage = function(val) {
  if (!val.featured_image) return false
  return val.featured_image.attachment_meta.sizes.medium.url
}

asWidget('about', function(hub) {
  var widget = this

  this.template('/widgets/about/index.html')
  this.on('installed', function() {
    widget.start()
    hub.trigger('aboutNeeded')
    hub.trigger('teamNeeded')
    hub.trigger('partnersNeeded')
  })

  hub.on('aboutLoaded', function(about) {
    //hack
    about.about = about.about.replace(/Please donate/, 'Please <a href="#_/donation">donate</a>')
    widget.set('about', about)
  })

  hub.on('teamLoaded', function(team) {
    widget.set('team', team)
    hub.trigger('appReady')
  })

  hub.on('partnersLoaded', function(partners) {
    widget.set('accelerationPartners', partners.filter(function(p) { return p.terms.involvement[0].slug == 'acceleration-partner' }))
    widget.set('movementPartners', partners.filter(function(p) { return p.terms.involvement[0].slug == 'movement-partner' }))
    widget.set('organizationalAllies', partners.filter(function(p) { return p.terms.involvement[0].slug == 'organizational-ally' }))
  })

  widget.toggleShowingPartnersApplication = function() {
    var current = widget.get('showingPartnersApplication')
    widget.set('showingPartnersApplication', !current)
    if (current) hub.trigger('urlHash', '')
    else hub.trigger('urlHash', 'partnersApplication')
  }

  hub.on('navTo', function(place) {
    if (place == 'partnersApplication') {
      hub.trigger('urlHash', place)
      widget.toggleShowingPartnersApplication()
    }
  })

})

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
