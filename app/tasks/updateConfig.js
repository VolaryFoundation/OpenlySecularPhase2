
var rsvp = require('rsvp')
var fs = require('fs')
var db = require('mongo-promise')
db.shortcut('configurations')

module.exports = function(config) {
  return new rsvp.Promise(function(res, rej) {
    var result = db.configurations.update({"domain": config.domain}, config ,{upsert:true})
    result.then(function(c, e) {
      e ? rej(e) : res(c)
    })
  })
}

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
