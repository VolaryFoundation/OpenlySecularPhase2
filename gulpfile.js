
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
        .then(console.log("built " + doc.domain))
    })
    rsvp.all(rebuilds).then(done)
  })
})

gulp.task('watch', function() {
  gulp.watch([ './app/widgets/**/*' ], [ 'build' ])
})
