
var fs = require('fs')
var rsvp = require('rsvp')
var domainPath = function(domain) { return __dirname + '/../domains/' + domain }
var buildPath = function(domain) { return domainPath(domain) + '/build' }

function footprintExists(domain, cb) {
  fs.readdir(domainPath(domain), function(e) { cb(!e) })
}

function buildFootprint(domain) {
  return new rsvp.Promise(function(res, rej) {
    fs.mkdir(domainPath(domain), function(e) {
      if (e) return rej()
      fs.mkdir(buildPath(domain), function(e) {
        e ? rej() : res()
      })
    })
  })
}

module.exports = function(config) {
  return new rsvp.Promise(function(res, rej) {
    footprintExists(config.domain, function(exists) {
      if (exists) return res(config)
      else {
        buildFootprint(config.domain).then(function() { res(config) }, rej)
      }
    })
  })
}
