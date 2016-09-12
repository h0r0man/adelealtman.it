'use strict';

var gulp          = require('gulp'),
    plumber       = require('gulp-plumber'),
    path          = require('path'),
    del           = require('del'),
    ghPages       = require('gulp-gh-pages');

var jade          = require('gulp-jade'),
    htmlmin       = require('gulp-htmlmin');

var imageResize   = require('gulp-image-resize'),
    parallel      = require('concurrent-transform'),
    os            = require('os'),
    rename        = require('gulp-rename'),
    imagemin      = require('gulp-imagemin');

var webpackstream = require('webpack-stream');

var sass          = require('gulp-sass'),
    combineMq     = require('gulp-combine-mq'),
    autoprefixer  = require('gulp-autoprefixer'),
    cssnano       = require('gulp-cssnano'),
    csscomb       = require('gulp-csscomb'),
    bourbon       = require('node-bourbon').includePaths,
    neat          = require('node-neat').includePaths;

var cheerio       = require('gulp-cheerio'),
    svgstore      = require('gulp-svgstore'),
    svgmin        = require('gulp-svgmin');

var browserSync   = require('browser-sync'),
    reload        = browserSync.reload;

// CLEAN -----------------------------------------------------------------------

gulp.task('clean', function () {
  return del.sync([
    './dist/**/*'
  ]);
});

// JADE ------------------------------------------------------------------------

gulp.task('jade', function() {

  var YOUR_LOCALS = {};

  return gulp.src(['./src/**/*.jade', '!./src/**/_*.jade'])
    .pipe(plumber())
    .pipe(jade({
      locals: YOUR_LOCALS
    }))
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('./dist/'))
});

gulp.task('jade-watch', ['jade'], reload);

// STYLESHEETS -----------------------------------------------------------------

var AUTOPREFIXER_BROWSERS = {
  browsers: [
    'ie >= 10',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10'
  ]
};

gulp.task('stylesheets', function () {
  return gulp.src('./src/stylesheets/**/*.{scss,sass}')
    .pipe(plumber())
    .pipe(sass({
      includePaths: bourbon,
      includePaths: neat,
      precision: 6
    }).on('error', sass.logError))
    .pipe(autoprefixer(AUTOPREFIXER_BROWSERS))
    .pipe(combineMq())
    .pipe(csscomb())
    .pipe(cssnano())
    .pipe(gulp.dest('./dist/css/'))
    .pipe(reload({stream: true}));
});

// SCRIPTS ---------------------------------------------------------------------

gulp.task('scripts', function () {
  return gulp.src(['./src/js/**/*.js'])
    .pipe(webpackstream(
      require('./webpack.config.js')
    ))
    .pipe(gulp.dest('./dist/js/'));
});

gulp.task('scripts-watch', ['scripts'], reload);

// RESIZE ----------------------------------------------------------------------

gulp.task('1440', function () {
  return gulp.src('./src/img/*{jpg,JPG,jpeg,JPEG}')
    .pipe(plumber())
    .pipe(parallel(
      imageResize({ width : 1440 }),
      os.cpus().length
    ))
    .pipe(rename(function (path) { path.basename += "-1440"; }))
    .pipe(gulp.dest('./dist/img'));
});

gulp.task('1680', function () {
  return gulp.src('./src/img/*{jpg,JPG,jpeg,JPEG}')
    .pipe(plumber())
    .pipe(parallel(
      imageResize({ width : 1680 }),
      os.cpus().length
    ))
    .pipe(rename(function (path) { path.basename += "-1680"; }))
    .pipe(gulp.dest('./dist/img'));
});

gulp.task('1920', function () {
  return gulp.src('./src/img/*{jpg,JPG,jpeg,JPEG}')
    .pipe(plumber())
    .pipe(parallel(
      imageResize({ width : 1920 }),
      os.cpus().length
    ))
    .pipe(rename(function (path) { path.basename += "-1920"; }))
    .pipe(gulp.dest('./dist/img'));
});

gulp.task('2560', function () {
  return gulp.src('./src/img/*{jpg,JPG,jpeg,JPEG}')
    .pipe(plumber())
    .pipe(parallel(
      imageResize({ width : 2560 }),
      os.cpus().length
    ))
    .pipe(rename(function (path) { path.basename += "-2560"; }))
    .pipe(gulp.dest('./dist/img'));
});

gulp.task('images-resize', ['1440', '1680', '1920', '2560']);

// IMAGES ----------------------------------------------------------------------

gulp.task('images-compress', function () {
  return gulp.src(['./src/img/**/*{gif,GIF,jpg,JPG,jpeg,JPEG,png,PNG}'])
    .pipe(plumber())
    .pipe(imagemin({
      // optimizationLevel: 5,
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest('./dist/img/'));
});

gulp.task('images', ['images-resize', 'images-compress']);

// ICONS -----------------------------------------------------------------------

gulp.task('icons', function () {
  return gulp.src(['./src/img/icons/**/*.svg'])
    .pipe(plumber())
    .pipe(svgmin(function (file) {
      var prefix = path.basename(file.relative, path.extname(file.relative));
      return {
        plugins: [{
          removeDoctype: true
        }, {
          removeComments: true
        }, {
          cleanupIDs: {
            prefix: prefix + '-',
            minify: false
          }
        }]
      }
    }))
    .pipe(svgstore({ inlineSvg: true }))
    .pipe(cheerio({
      run: function ($) {
        $('[fill]').removeAttr('fill');
        $('svg').attr('style', 'display:none');
      },
      parserOptions: { xmlMode: true }
    }))
    .pipe(gulp.dest('./src/img/icons/tmp/'))
});

// FONTS -----------------------------------------------------------------------

gulp.task('fonts', function () {
  return gulp.src('./src/fonts/*')
    .pipe(gulp.dest('./dist/fonts/'));
});

// SVGS ------------------------------------------------------------------------

gulp.task('svgs', function () {
  return gulp.src('./src/img/*.svg')
    .pipe(gulp.dest('./dist/img/'));
});

// COPY ------------------------------------------------------------------------

var FILES_TO_COPY = [
  './src/*.txt',
  './src/CNAME',
  './src/favicon.ico',
  './src/manifest.json'
];

gulp.task('copy', function () {
  return gulp.src(FILES_TO_COPY)
    .pipe(gulp.dest('./dist'));
});

// BUILD -----------------------------------------------------------------------

gulp.task('build', ['jade', 'icons', 'scripts', 'images', 'stylesheets', 'fonts', 'svgs', 'copy'], function () {
  browserSync({
    notify: false,
    server: './dist',
    port: 9999
  });
});

// WATCH -----------------------------------------------------------------------

gulp.task('watch', function () {
  gulp.watch('./src/**/*.jade',                    ['jade-watch']);
  gulp.watch('./src/js/**/*.js',                   ['scripts-watch']);
  gulp.watch('./src/stylesheets/**/*.{scss,sass}', ['stylesheets']);
});

// DEFAULT/WATCH ---------------------------------------------------------------

gulp.task('default', function () {
  gulp.start('clean', 'build', 'watch');
});

// DEPLOY ----------------------------------------------------------------------

gulp.task('deploy', function() {
  return gulp.src('./dist/**/*')
    .pipe(ghPages());
});
