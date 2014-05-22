
var gulp = require('gulp')
var gutil = require('gulp-util')
var exec = require('child_process').exec

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

gulp.task('serve', function() {
  exec('nodemon app.js')
})
