'use strict'

var j = require('path').join
var sh = require("shelljs")

var gulp = require('gulp')
var p = require('gulp-load-plugins')()

var pngquant = require('imagemin-pngquant')
var browserify = require('browserify')
var buffer = require('vinyl-buffer')
var source = require('vinyl-source-stream')

var globby = require('globby')

var MODE = null

var ASSETS_URL_PREFIX = '/static'

var ASSETS_ROOT = null
var DEVELOP_ROOT = 'static'
var PUBLISH_DIR = '../assets_dist'
var PUBLISH_ROOT = j(PUBLISH_DIR, 'static')

//VIEW PATH
var VIEW_PATH = null
var DEVELOP_VIEW_PATH = '../views'
var PUBLISH_VIEW_PATH = '../views_dist'


/**
 * COMMON TASK ====================================
 */

// Set Gulp Mode
function setMode(mode) {

  if (mode == 'develop') {
    MODE = 'develop'

    ASSETS_ROOT = DEVELOP_ROOT
    VIEW_PATH = DEVELOP_VIEW_PATH

    console.log('Start DEVELOP ...')
    console.log('ASSETS_ROOT: ', ASSETS_ROOT)

  } else if (mode == 'publish') {

    MODE = 'publish'
      //define by customer solution,nginx or express static
    ASSETS_ROOT = PUBLISH_ROOT
    VIEW_PATH = PUBLISH_VIEW_PATH

    console.log('Start Publish ...')
    console.log('ASSETS_ROOT: ', ASSETS_ROOT)
  }

}


gulp.task('es6', function() {
  return gulp.src(j(ASSETS_ROOT, 'es6/**/*.es6'))
    .pipe(p.babel({
      'sourceMaps': false,
      optional: [
        "es7.asyncFunctions",
        "es7.objectRestSpread"
      ],
      modules: 'common'
    }))
    .pipe(gulp.dest(
      j(ASSETS_ROOT, '.tmp_js')
    ))

})


gulp.task('tmp_clean', function() {
  return sh.rm('-rf', [
    j(DEVELOP_ROOT, '.tmp_js'),
    j(DEVELOP_ROOT, 'js'),
    j(DEVELOP_ROOT, 'css')
  ])
})


/**
 * FOR PUBLISH ASSETS ==============================
 */

gulp.task('publish_clean', ['tmp_clean'], function() {
  return sh.rm('-rf', [PUBLISH_DIR, PUBLISH_VIEW_PATH])
})


// Delete Raw Assets
gulp.task('publish_completed_clean', function() {
  return sh.rm('-rf', [
    j(PUBLISH_ROOT, '.tmp_js'),
    j(PUBLISH_ROOT, 'es6'),
    j(PUBLISH_ROOT, 'scss'),
    j(PUBLISH_ROOT, 'lib'),
  ])
})


gulp.task('publish_copy', ['publish_clean'], function() {
  //创建输出目录
  sh.mkdir('-p', PUBLISH_ROOT)
    //复制ASSETS到输出目录
  sh.cp('-rf', j(DEVELOP_ROOT, '*'), PUBLISH_ROOT)

  sh.cp('-rf', j(DEVELOP_VIEW_PATH, '*'), PUBLISH_VIEW_PATH)

  return true
})

gulp.task('publish_css', function() {
  return gulp.src(j(ASSETS_ROOT, 'scss/**/*.scss'))
    .pipe(p.sass())
    .pipe(
      p.md5Plus(
        10,
        j(VIEW_PATH, '**/*.html'),
        //第三个参数，是拿到html中去match从而replace, 所以取html中资源的url_prefix
        j(ASSETS_URL_PREFIX, 'css')
      )
    )
    .pipe(p.minifyCss())
    .pipe(gulp.dest(j(ASSETS_ROOT, 'css')))
})


function browserifyOne(fpath){
    return browserify({
          entries: fpath,
          debug: true,
          // sourceMaps: false,
          extensions: ['.es6', '.jsx'],
          paths: [j(ASSETS_ROOT, 'lib')]
      })
      .bundle()
      .pipe(source(fpath))
      .pipe(buffer())
      .pipe(p.rename(function(path) {

        path['dirname'] = path['dirname'].replace('.tmp_js', 'js').replace(j(ASSETS_ROOT,'/'), '')
      }))
}

gulp.task('publish_js', ['es6'], function() {
  // Single entry point to browserify 

    var fileList = globby.sync(j(ASSETS_ROOT, '.tmp_js/**/*.js'))
    var fpath = null

    for(var i in fileList){
        fpath = fileList[i]

        browserifyOne(fpath)
        .pipe(p.md5Plus(
            10,
            j(VIEW_PATH, '**/*.html'),
            //这里跟publish_css不一样，因为目录层级产生的不同
            ASSETS_URL_PREFIX //eg. /static, replaced into .
          )
        )
        .pipe(p.uglify())
        .pipe(gulp.dest(ASSETS_ROOT))
        .on('error', function(err) {
            throw Error(err)
          })
    }

})


gulp.task('publish_imagemin', function() {
  // setMode('publish')
  return gulp.src(j(ASSETS_ROOT, 'img/**/*.*'))
    .pipe(p.imagemin({
      progressive: true,
      debug: true,
      svgoPlugins: [{
        removeViewBox: false
      }],
      use: [pngquant()]
    }))
    .pipe(gulp.dest(j(ASSETS_ROOT, 'img')));
})


gulp.task('publish', ['publish_copy'], function() {

  setMode('publish')

  gulp.start(
    'publish_css',
    'publish_js',
    'publish_imagemin'
  )
})


/**
 * DEVELOP TASK =================================
 */

gulp.task('develop_css', function() {
  return gulp.src(j(ASSETS_ROOT, 'scss/**/*.scss'))
    .pipe(p.sass())
    .pipe(gulp.dest(j(ASSETS_ROOT, 'css')))
})


gulp.task('develop_js', ['es6'], function() {
  var fileList = globby.sync(j(ASSETS_ROOT, '.tmp_js/**/*.js'))
  var fpath = null
  for(var i in fileList){
    fpath = fileList[i]

    browserifyOne(fpath)
    .pipe(gulp.dest(ASSETS_ROOT))
    .on('error', function(err) {
      throw Error(err)
    })
  }

  return true

})


gulp.task('develop_init', ['tmp_clean'], function(argument) {

  setMode('develop')

  gulp.start(
    'develop_css',
    'develop_js'
  )

})


gulp.task('develop', function() {

  setMode('develop')

  gulp.watch(j(ASSETS_ROOT, 'scss/**/*.scss'), ['develop_css'])
  gulp.watch(j(ASSETS_ROOT, 'es6/**/*.es6'), ['develop_js'])

})

