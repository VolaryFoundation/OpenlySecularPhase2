
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
    widget.set('mainError', '')
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

      ensureUser(donation)
        .then(function(user) {
          return donate({
            donation: donation,
            contact_id: user.id
          })
        })
        .then(function() {
          if (donation.get('recurring')) {

          } else return new rsvp.Promise(function(res) { res() })
        })
        .then(function() {
          console.log('submitting payment!', widget.get('donation').toJSON())
          hub.trigger('donationCompleted')
          widget.set('step', widget.get('step') + 1)
        })
        .catch(function(e) {
          widget.set('mainError', 'Sorry, something went wrong. Please check your information and then try again!')
        })
    }

    if (widget.get('step') < 2) {
      widget.set('step', widget.get('step') + 1)
    }
  }

  function ensureUser(donation) {
    return new rsvp.Promise(function(res, rej) {

      var query = $.param(civiQuery({
        first_name: donation.get('firstName'),
        last_name: donation.get('lastName'),
        email: donation.get('email'),
        entity: 'Contact',
        action: 'create',
        contact_type: 'Individual',
      }))

      $.ajax({
        type: 'POST',
        url: 'http://tinytower.info/wp-content/plugins/civicrm/civicrm/extern/rest.php?' + query,
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        success: function(data) {
          res(data)
        },
        error: function() {
          debugger
          rej()
        }
      })
    })
  }

  function donate(data) {
    return new rsvp.Promise(function(res, rej) {

      Stripe.card.createToken({
        name: data.donation.get('firstName') + ' ' + data.donation.get('lastName'),
        address_zip: data.donation.get('zip'),
        number: data.donation.get('cardNumber'),
        cvc: data.donation.get('cvc') || '012',
        exp_month: data.donation.get('cardExpiration').month,
        exp_year: data.donation.get('cardExpiration').year
      }, function(status, response) {

        if (response.error) {
          debugger
          return rej()
        }

        var query = $.param(civiQuery({
          contact_id: data.contact_id,
          entity: 'Address',
          action: 'create',
          street_address: data.donation.get('address1'),
          street_unit: data.donation.get('address2'),
          city: data.donation.get('city'),
          state: data.donation.get('state'),
          postal_code_suffix: data.donation.get('zip'),
          location_type_id: 'Home'
        }))

        $.ajax({
          type: 'POST',
          contentType: "application/json; charset=utf-8",
          dataType: 'json',
          url: 'http://tinytower.info/wp-content/plugins/civicrm/civicrm/extern/rest.php?' + query,
          success: function(address) {
            var query = $.param(civiQuery({
              stripe_token: response.id,
              contact_id: data.contact_id,
              total_amount: data.donation.get('amount'),
              entity: 'Contribution',
              action: 'create',
              contact_type: 'Individual',
              contribution_page_id: 4,
              financial_type_id: 'Donation'
            }))

            $.ajax({
              type: 'POST',
              contentType: "application/json; charset=utf-8",
              dataType: 'json',
              url: 'http://tinytower.info/wp-content/plugins/civicrm/civicrm/extern/rest.php?' + query,
              success: function(data) {
                res(data)
              },
              error: function() {
                debugger
                rej()
              }
            })

            $.ajax({
              type: 'POST',
              contentType: "application/json; charset=utf-8",
              dataType: 'json',
              url: 'http://tinytower.info/wp-json/stripe',
              data: JSON.stringify({
                data: {
                  token: response.id,
                  amount: parseInt(data.donation.get('amount')) * 100
                }
              }),
              success: function(data) {
                res(data)
              },
              error: function() {
                debugger
                rej()
              }
            })
          }
        })
      });
    })
  }

  function civiQuery(others) {
    return _.extend(others, {
      debug: 1,
      sequential: 1,
      json: 1,
      key: '102d680b1f9463becb3fd73e18386312',
      api_key: 'UAMA7e4LpBXxeEwTTK9FzqL2'
    })
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
