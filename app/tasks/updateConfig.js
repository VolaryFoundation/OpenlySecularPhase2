
var rsvp = require('rsvp')
var fs = require('fs')

function configPath(domain) { return __dirname + '/../domains/' + domain + '/config.js' }
function asJSONExport(config) { return 'module.exports = ' + JSON.stringify(config) }

module.exports = function(config) {
  return new rsvp.Promise(function(res, rej) {
    fs.writeFile(configPath(config.domain), asJSONExport(config), 'utf8', function(e) {
      e ? rej() : res(config)
    })
  })
}
