
var asWidget = require('widget')
var Backbone = require('backbone')

asWidget('faq', function(hub) {
  var widget = this

  widget.template('/widgets/faq/index.html')
  widget.on('installed', function() {
    widget.start()
    hub.once('faqScrolledTo', function() {
      hub.trigger('faqNeeded')
    })
  })

  var FAQ = Backbone.Model.extend({
    toggle: function() {
      this.set('open', !this.get('open'))
    }
  })
  hub.on('faqLoaded', function(faqs) {
    widget.set('faqs', faqs.map(function(faq) { return new FAQ(faq) }))
  })
})
