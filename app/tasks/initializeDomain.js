
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
