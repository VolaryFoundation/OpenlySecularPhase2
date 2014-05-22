
var rsvp = require('rsvp')

module.exports = function(config) {
  return new rsvp.Promise(function(res, rej) {
    config.domain ? res(config) : rej()
  })
}
