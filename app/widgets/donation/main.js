
var asWidget = require('widget')
var Backbone = require('backbone')
var _ = require('lodash')
var rsvp = require('rsvp')
var $ = require('jquery')

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
    recurringFrequency: 'week',
    firstName: '',
    lastName: '',
    cardNumber: '',
    cvc: '',
    cardExpiration: { month: '', year: '' }
  }))

  widget.set('confirmText', 'Confirm')

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
    widget.set('errors', null)
    if (step == 1) {
      widget.hide()
    } else {
      widget.set('step', step - 1)
    }
  }

  function validateBasics(errors, donation, widget) {
    if (!donation.get('amount') && !widget.get('customAmount')) {
      errors.push('Please select the amount you would like to donate.')
    } else if (widget.get('customAmount') && parseInt(widget.get('customAmount')) < 0) {
      errors.push('Please only include positive numbers for custom amount.')
    } else if (widget.get('customAmount') && !/^\d+$/.test(widget.get('customAmount'))) {
      errors.push('Please only use numbers for custom amount.')
    }
    return errors
  }

  function validatePayment(errors, donation, widget) {
    if (!donation.get('firstName')) errors.push('Please enter your first name.')
    if (!donation.get('lastName')) errors.push('Please enter your last name.')
    if (!donation.get('address1')) errors.push('Please enter your street address.')
    if (!donation.get('city')) errors.push('Please enter your city.')
    if (!donation.get('state')) errors.push('Please enter your state.')
    if (!donation.get('zip')) errors.push('Please enter your zip code.')
    if (!donation.get('email')) errors.push('Please enter your email.')
    if (!donation.get('cardNumber')) errors.push('Please enter your card number.')
    if (!donation.get('cvc')) errors.push('Please enter your CVC.')
    if (!donation.get('cardExpiration').month) errors.push('Please enter the month of your card expiration.')
    if (!donation.get('cardExpiration').year) errors.push('Please enter the year of your card expiration.')
    return errors
  }

  widget.on('change:loading', function() {
    widget.set('confirmText', widget.get('loading') ? 'Loading...' : 'Confirm')
  })

  widget.next = function() {

    if (widget.get('loading')) return

    var step = widget.get('step')
    var donation = widget.get('donation')

    var errors = []
    widget.set('errors', null)
    widget.set('cardError', null)
    if (step == 1) {
      validateBasics(errors, donation, widget)
      if (errors.length) return widget.set('errors', errors)
      widget.set('step', 2)
    } else if (step == 2) {
      validatePayment(errors, donation, widget)
      if (errors.length) return widget.set('errors', errors)
      makePayment()
    }

    function makePayment() {

      widget.set('loading', true)

      createToken(donation)
        .then(function(token) {
          return createCiviUser(donation).then(function(civiUser) {
            return createStripeUser(donation, token, civiUser).then(function(stripeUser) {
              if (donation.get('recurring')) return true
              return charge(donation, stripeUser)
            }).then(function(stripeCharge) {
              return recordChargeInCivi(donation, civiUser, token)
            })
          })
        }).then(function() {
          console.log('submitting payment!', widget.get('donation').toJSON())
          hub.trigger('donationCompleted')
          widget.set('loading', false)
          widget.set('step', widget.get('step') + 1)
        })
        .catch(function() {
          widget.set('cardError', 'Sorry, we couldn\'t process your transaction. Please double check your card information and try again.')
          widget.set('loading', false)
        })
    }
  }

  function createStripeUser(donation, token, civiUser) {
    return ajax({
      type: 'POST',
      url: 'http://tinytower.info/wp-json/stripe/customer',
      data: JSON.stringify({
        civicrm_id: civiUser.id,
        token: token.id,
        email: donation.get('email'),
        frequency: donation.get('recurring') ? donation.get('recurringFrequency') : null,
        amount: donation.get('recurring') ? (parseInt(donation.get('amount')) * 100) : null
      })
    }).then(function(stripeUser) {
      return stripeUser
    })
  }

  function createCiviUser(donation) {

    var url = civiUrl({
      first_name: donation.get('firstName'),
      last_name: donation.get('lastName'),
      email: donation.get('email'),
      entity: 'Contact',
      action: 'create',
      contact_type: 'Individual'
    })

    return ajax({
      type: 'POST',
      url: url,
      contentType: "application/json; charset=utf-8",
      dataType: 'json'
    }).then(function(user) {
      return createAddress(donation, user)
    })
  }

  function createToken(donation) {
    return new rsvp.Promise(function(res, rej) {
      Stripe.card.createToken({
        name: donation.get('firstName') + ' ' + donation.get('lastName'),
        address_zip: donation.get('zip'),
        number: donation.get('cardNumber'),
        cvc: donation.get('cvc'),
        exp_month: donation.get('cardExpiration').month,
        exp_year: donation.get('cardExpiration').year
      }, function(status, response) {
        response.error ? rej() : res(response)
      })
    })
  }

  function createAddress(donation, user) {

    var url = civiUrl({
      contact_id: user.id,
      entity: 'Address',
      action: 'create',
      street_address: donation.get('address1'),
      street_unit: donation.get('address2'),
      city: donation.get('city'),
      state: donation.get('state'),
      postal_code_suffix: donation.get('zip'),
      location_type_id: 'Home'
    })

    return ajax({
      type: 'POST',
      url: url
    })
  }

  function recordChargeInCivi(donation, civiUser, token) {

    var url = civiUrl({
      stripe_token: token.id,
      contact_id: civiUser.id,
      total_amount: donation.get('amount'),
      entity: 'Contribution',
      action: 'create',
      contact_type: 'Individual',
      contribution_page_id: 4,
      financial_type_id: 'Donation'
    })

    return ajax({
      type: 'POST',
      url: url
    })
  }

  function charge(donation, stripeUser) {
    return ajax({
      type: 'POST',
      url: 'http://tinytower.info/wp-json/stripe/charge',
      data: JSON.stringify({
        customer_id: stripeUser.id,
        amount: parseInt(donation.get('amount')) * 100
      })
    })
  }

  function ajax(data) {
    return new rsvp.Promise(function(res, rej) {
      $.ajax(_.extend(data, {
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        success: res,
        error: rej
      }))
    })
  }

  function civiUrl(data) {
    var query = $.param(_.extend(data, {
      debug: 1,
      sequential: 1,
      json: 1,
      key: '102d680b1f9463becb3fd73e18386312',
      api_key: 'UAMA7e4LpBXxeEwTTK9FzqL2'
    }))
    return 'http://tinytower.info/wp-content/plugins/civicrm/civicrm/extern/rest.php?' + query
  }

  window.donation = widget

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
