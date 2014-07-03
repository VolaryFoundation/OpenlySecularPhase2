
var asWidget = require('widget')
var $ = require('jquery')
var rivets = require('rivets')
var moment = require('moment')
var _ = require('lodash')

rivets.formatters.postDate = function(raw) {
  return moment(raw).format('MMMM d, YYYY')
}

asWidget('media', function(hub) {
  var widget = this

  this.template('/widgets/media/index.html')
  this.on('installed', function() {
    widget.start()
    hub.trigger('newsNeeded')
    hub.trigger('releasesNeeded')
  })

  hub.on('newsLoaded', function(articles) {
    widget.set('news', articles)
  })

  hub.on('releasesLoaded', function(releases) {
    widget.set('releases', releases)
    hub.trigger('appReady')
  })

  widget.showDetails = function(_, _, binding) {
    var post = binding.view.models.article
    showDetails(post)
  }

  widget.hideDetails = function() {
    widget.set('details', null)
  }

  function showDetails(post) {
    widget.set('details', {
      title: post.title,
      content: post.content
    })
  }

  function findAndShowDetails(list, id) {
    var post = _.find(list, { slug: id })
    if (post) {
      showDetails(post) 
    }
  }

  hub.on('navTo', function(place, id) {
    if (place == 'article') {
      findAndShowDetails(widget.get('news'),id)
    } else if (place == 'release') {
      findAndShowDetails(widget.get('releases'),id)
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
