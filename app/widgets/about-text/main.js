
var asWidget = require('widget')
var $ = require('jquery')

asWidget('about-text', function(hub) {
  var widget = this

  this.template('/widgets/about-text/index.html')
  this.on('installed', function() {
    widget.start()
    hub.trigger('aboutTextNeeded')
    hub.trigger('missionNeeded')
  })

  hub.on('missionLoaded', function(text) {
    widget.set('mission', text)
  })

  hub.on('aboutTextLoaded', function(text) {
    widget.set('about', text)
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
