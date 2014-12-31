var gulp = require('gulp')
  , tinylr = require('tiny-lr')
  , nodemon = require('gulp-nodemon')
  , jshint = require('gulp-jshint')

require('./tasks/test')
require('./tasks/assets')

gulp.task('lint', function() {
  gulp.src(['./lib/**/*.js', 'app.js'])
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'))
})

gulp.task('nodemon', function() {
  nodemon({
    verbose: false,
    script: 'index.js',
    watch: ['lib', 'views', 'index.js'],
    ext: 'js json',
    env: {
      NODE_ENV: 'development'
    }
  })
})

gulp.task('watch', function() {
  tinylr = tinylr()
  tinylr.listen(4002)
  gulp.watch('./assets/js/**/*.js', ['assets:js'])
  gulp.watch('./assets/stylesheets/**/*.styl', ['assets:css'])
  gulp.watch('./assets/templates/**/*.jade', ['assets:html'])
  gulp.watch('./assets/images/**/*', ['assets:images'])
  gulp.watch('./dist/css/application.css', notifyLiveReload)
})

gulp.task('build', [
  'assets:css',
  'assets:js',
  'assets:vendor:css',
  'assets:vendor:js',
  'assets:html',
  'assets:images'
])

// http://help.nitrous.io/setting-up-gulp-with-livereload-and-sass/
function notifyLiveReload(event) {
  var fileName = require('path').relative(__dirname, event.path)
  tinylr.changed({
    body: {
      files: [fileName]
    }
  })
}

gulp.task('default', ['build'])

