
var asWidget = require('widget')
var Backbone = require('backbone')
var _ = require('lodash')

var Donation = Backbone.Model.extend({
})

asWidget('donation', function(hub) {
  var widget = this

  widget.template('/widgets/donation/index.html')
  widget.on('installed', function() {
    widget.start().hide()
  })

  widget.showFaq = function() {
    hub.trigger('showFaq')
  }

  widget.set('donation', new Donation({
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

  widget.on('change:visible', function() {
    if (!widget.get('visible')) hub.trigger('urlHash', '')
  })

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
    hub.trigger('urlHash', 'donation')
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
    var step = widget.get('step')

    var donation = widget.get('donation')
    widget.set('errors', [])
    var errors = []

    if (step == 1) {
      if (!donation.get('amount') && !widget.get('customAmount')) {
        errors.push('Please select the amount you would like to donate.')
      } else if (widget.get('customAmount') && parseInt(widget.get('customAmount')) < 0) {
        errors.push('Please only include positive numbers for custom amount.')
      } else if (widget.get('customAmount') && !/^\d+$/.test(widget.get('customAmount'))) {
        errors.push('Please only use numbers for custom amount.')
      }
    } else if (step == 2) {
      if (!donation.get('firstName')) errors.push('Please enter your first name.')
      if (!donation.get('lastName')) errors.push('Please enter your last name.')
      if (!donation.get('address1')) errors.push('Please enter your street address.')
      if (!donation.get('city')) errors.push('Please enter your city.')
      if (!donation.get('state')) errors.push('Please enter your state.')
      if (!donation.get('zip')) errors.push('Please enter your zip code.')
      if (!donation.get('email')) errors.push('Please enter your email.')
      if (!donation.get('cardNumber')) errors.push('Please enter your card number.')
      if (!donation.get('cardExpiration').month) errors.push('Please enter the month of your card expiration.')
      if (!donation.get('cardExpiration').year) errors.push('Please enter the year of your card expiration.')
    }

    if (errors.length) return widget.set('errors', errors)
    else widget.set('errors', null)

    if (step == 2) {
      console.log('submitting payment!', widget.get('donation').toJSON())
      hub.trigger('donationCompleted')
    }

    widget.set('step', widget.get('step') + 1)
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
