
var fs = require('fs')
var gulp = require('gulp')
var gutil = require('gulp-util')
var exec = require('child_process').exec
var requireDir = require('require-dir')
var tasks = requireDir('./app/tasks')
var db = require('mongo-promise')
var envConfig = require('config')
var rsvp = require('rsvp')

gulp.task('test:units', function() {
  exec('NODE_ENV=test mocha test/units/ --colors --recursive --compilers coffee:coffee-script/register --reporter spec', function(e, stdout, stderr) {
    console.log(stdout, stderr)
  })
})

gulp.task('test:features', function() {
  exec('NODE_ENV=test mocha test/features/ --colors --recursive --compilers coffee:coffee-script/register --reporter spec', function(e, stdout, stderr) {
    console.log(stdout, stderr) 
  })
})

gulp.task('build', function(done) {

  db.url = process.env.MONGOLAB_URI || envConfig.servers.mongodb
  db.shortcut('configurations')
  var results = db.configurations.find({})
  results.then(function(c,e) {
    var rebuilds = c.map(function(doc) { 
      return tasks.validateConfig(doc)
        .then(tasks.initializeDomain)
        .then(tasks.rebuild)
    })
    if (!rebuilds[0]) return done()
    else return rsvp.all(rebuilds).then(done).catch(console.log.bind(console))
  })
})

gulp.task('watch', function() {
  gulp.watch([ './app/widgets/**/*' ], [ 'build' ])
})

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
