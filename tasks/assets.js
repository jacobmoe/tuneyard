var gulp = require('gulp')
  , jade = require('gulp-jade')
  , stylus = require('gulp-stylus')
  , autoprefixer = require('gulp-autoprefixer')
  , concat = require('gulp-concat')
  , dependencies = require('./dependencies')

gulp.task('assets:html', function() {
  gulp.src('./assets/templates/**/*.jade')
    .pipe(jade({ pretty: true }))
    .pipe(gulp.dest('./dist/templates'))
})

gulp.task('assets:css', function() {
  gulp.src('./assets/stylesheets/application.styl')
    .pipe(stylus())
    .pipe(autoprefixer(
      'last 2 version',
      'safari 5',
      'ie 8',
      'ie 9',
      'opera 12.1',
      'ios 6',
      'android 4'
    ))
    .pipe(gulp.dest('./dist/css/'))
})

gulp.task('assets:vendor:css', function() {
  gulp.src(dependencies.css)
    .pipe(concat('vendor.css'))
    .pipe(gulp.dest('./dist/css/'))
})

gulp.task('assets:js', function() {
  gulp.src('./assets/js/**/*.js')
    .pipe(concat('application.js'))
    .pipe(gulp.dest('./dist/js/'))
})

gulp.task('assets:vendor:js', function () {
  return gulp.src(dependencies.js)
    .pipe(concat('vendor.js', {newLine: '\n;\n'}))
    .pipe(gulp.dest('./dist/js/'));
})

gulp.task('assets:images', function() {
  gulp.src('./assets/img/**/*')
    .pipe(gulp.dest('./dist/img/'))
})

