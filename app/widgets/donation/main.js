
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
