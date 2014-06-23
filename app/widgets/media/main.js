
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
