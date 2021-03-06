
var asWidget = require('widget')
var Backbone = require('backbone')
var $ = require('jquery')

asWidget('contact', function(hub) {
  var widget = this

  widget.template('/widgets/contact/index.html')
  widget.on('installed', function() {
    widget.start().hide()
  })

  hub.on('showContact', function() {
    widget.show()
    hub.trigger('urlHash', 'contact')
  })

  widget.on('change:visible', function() {
    if (!widget.get('visible')) hub.trigger('urlHash', '')
  })

  widget.contact = new Backbone.Model

  widget.submit = function() {

    var errors = []

    if (!widget.contact.get('name')) errors.push('Please include a name.')
    if (!widget.contact.get('email')) errors.push('Please include an email.')
    else if (!/\w+@\w+\.\w+/.test(widget.contact.get('email'))) errors.push('Email is invalid')
    if (!widget.contact.get('message')) errors.push('Please include a message.')

    widget.set('errors', [])
    if (errors.length) {
      return widget.set('errors', errors)
    }

    $.post('http://submit.jotformpro.com/submit/41775081989975/', {
      formID: '41775081989975',
      q3_whatsYour: widget.contact.get('name'),
      q5_yourEmail: widget.contact.get('email'),
      q4_whatsOn: widget.contact.get('message')
    })
    widget.contact.attributes = {}
    widget.hide()
  }
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
