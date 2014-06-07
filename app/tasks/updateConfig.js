
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
