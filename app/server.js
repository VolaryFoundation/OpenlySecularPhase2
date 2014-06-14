
var express = require('express')
var bodyParser = require('body-parser')
var requireDir = require('require-dir')
var tasks = requireDir('./tasks')
var _ = require('lodash')
var db = require('mongo-promise')
var envConfig = require('config')

db.url = process.env.MONGOLAB_URI || envConfig.servers.mongodb

var server = express()

server.use(bodyParser())
server.use('/widgets', express.static(__dirname + '/widgets'))

server.put('/domain', function(req, res) {

  var config = req.body
  var lazyReply = function(code, msg) { return function() { res.send(code, msg) } }

  tasks.validateConfig(config)
    .then(tasks.initializeDomain, lazyReply(400, 'Config could not be validated'))
    .then(tasks.updateConfig, lazyReply(400, 'Domain could not be created'))
    .then(tasks.rebuild, lazyReply(400, 'Config could not be updated'))
    .then(lazyReply(200), lazyReply(400, 'Sorry something went wrong on the server. WTF?'))
})

function withDomainDirectory(req, res, next) {
  var host = req.host
  req.domainDirectory = __dirname + '/domains/' + host + '/build/'
  next()
}

server.get('/build.js', withDomainDirectory, function(req, res) {
  res.sendfile(req.domainDirectory + 'build.js')
})

server.get('/build.css', withDomainDirectory, function(req, res) {
  res.sendfile(req.domainDirectory + 'build.css')
})

server.get('*', withDomainDirectory, function(req, res) {
  res.sendfile(req.domainDirectory + 'build.html')
})

module.exports = server
