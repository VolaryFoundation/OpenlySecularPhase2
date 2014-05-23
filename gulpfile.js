
var fs = require('fs')
var gulp = require('gulp')
var gutil = require('gulp-util')
var exec = require('child_process').exec
var requireDir = require('require-dir')
var tasks = requireDir('./app/tasks')

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

gulp.task('build', function() {
  fs.readdir('./app/domains', function(e, dirs) {
    dirs.forEach(function(dir) {
      var config = require('./app/domains/' + dir + '/config')
      tasks.rebuild(config)
    })
  })
})

gulp.task('watch', function() {
  gulp.watch([ './app/widgets/**/*' ], [ 'build' ])
})
