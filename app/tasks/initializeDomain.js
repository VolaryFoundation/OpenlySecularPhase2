
var fs = require('fs')
var rsvp = require('rsvp')
var AWS = require('aws-sdk');
AWS.config.region = 'us-west-2';
var envConfig = require('config')
var domainPath = function(domain) { return __dirname + '/../domains/' + domain }
var buildPath = function(domain) { return domainPath(domain) + '/build' }

var footprintExists = {
  local: function(config, cb) {
    fs.readdir(domainPath(config.domain), function(e) { cb(!e) })
  },

  s3: function(config, cb) {
    var bucket = config.storageLocation.bucket || process.env.S3_BUCKET || envConfig.aws.bucket
    var s3 = new AWS.S3();
    s3.client.headBucket({Bucket: bucket},  function(e) { cb(!e) })
  }
}


var buildFootprint = {

  local: function(config) {
    return new rsvp.Promise(function(res, rej) {
      fs.mkdir(domainPath(config.domain), function(e) {
        if (e) return rej()
        fs.mkdir(buildPath(config.domain), function(e) {
          e ? rej() : res()
        })
      })
    })
  },

  s3: function(config) {
    return new rsvp.Promise(function(res, rej) {
      var bucket = config.storageLocation.bucket || process.env.S3_BUCKET || envConfig.aws.bucket
      var s3 = new AWS.S3();
      s3.client.createBucket({Bucket: bucket}, function(err, data) {
        (err) ? rej() : res()
      })
    })
  }
}

module.exports = function(config) {
  var location = (config.storageLocation && config.storageLocation.service) ? config.storageLocation.service : 'local'
  return new rsvp.Promise(function(res, rej) {
    if (process.env.NODE_ENV == 'production') {
      res(config)
    } else {
      footprintExists[location](config, function(exists) {
        if (exists) {
          return res(config)
        }else {
          buildFootprint[location](config).then(function() { res(config) }, rej)
        }
      })
    }
  })
}
