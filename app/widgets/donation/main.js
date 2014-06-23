
var asWidget = require('widget')
var Backbone = require('backbone')
var _ = require('lodash')

asWidget('donation', function(hub) {
  var widget = this

  widget.template('/widgets/donation/index.html')
  widget.on('installed', function() {
    widget.start().show()
  })

  widget.set('donation', new Backbone.Model({
    amount: '',
    reason: '',
    recurring: false,
    recurringFrequency: 'weekly',
    firstName: '',
    lastName: '',
    cardNumber: '',
    cardExpiration: { month: '', year: '' }
  }))

  widget.set('step', 1)
  widget.set('presetAmounts', [ 10, 25, 50, 100, 250, 500 ].map(function(num) {
    return new Backbone.Model({ amount: num, active: false })
  }))

  widget.on('change:customAmount', function() {
    widget.get('donation').set('amount', widget.get('customAmount'))
  })

  widget.get('donation').on('change:amount', function() {
    var presets = widget.get('presetAmounts')
    var amount = widget.get('donation').get('amount')
    _.each(presets, function(preset) {
      preset.set('active', amount == preset.get('amount'))
    })
  })

  hub.on('showDonation', function() {
    widget.show()
  })

  widget.setAmount = function(_, _, binding) {
    var preset = binding.view.models.preset
    widget.get('donation').set('amount', preset.get('amount'))
  }

  widget.back = function() {
    var step = widget.get('step')
    if (step == 1) {
      widget.hide()
    } else {
      widget.set('step', step - 1)
    }
  }

  widget.next = function() {
    widget.set('step', widget.get('step') + 1)
    if (widget.get('step') == 3) {
      console.log('submitting payment!', widget.get('donation').toJSON())
    }
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
