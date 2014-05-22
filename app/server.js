
var express = require('express')
var bodyParser = require('body-parser')
var requireDir = require('require-dir')
var tasks = requireDir('./tasks')
var _ = require('lodash')

var server = express()

server.use(bodyParser())

server.put('/domain', function(req, res) {

  var config = req.body
  var lazyReply = function(code, msg) { return function() { res.send(code, msg) } }

  tasks.validateConfig(config)
    .then(tasks.initializeDomain, lazyReply(400, 'Config could not be validated'))
    .then(tasks.updateConfig, lazyReply(400, 'Domain could not be created'))
    .then(tasks.rebuild, lazyReply(400, 'Config could not be updated'))
    .then(lazyReply(200), lazyReply(400, 'Sorry something went wrong on the server. WTF?'))
})

module.exports = server
