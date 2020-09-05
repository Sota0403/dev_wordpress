const gulp = require('gulp');

//ES6のトランスパイル
const babel = require('gulp-babel');

//Sassのコンパイル
const sass = require('gulp-sass');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const cleanCss = require('gulp-clean-css');
const rename = require('gulp-rename');

// サーバ立ち上げ
const browserSync = require('browser-sync');
const { parallel } = require('gulp');

function compileJs() {
  return gulp.src('js/e6.js', { sourcemaps: true })
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(gulp.dest('public/js'), { sourcemaps: true })
}

function compileSass() {
  return gulp.src('scss/app.scss', { sourcemaps: true })
    .pipe(plumber(
      {
        errorHandler: notify.onError('Error:<%= error.message %>')
      }
    ))
    .pipe(sass(
      {
        outputStyle: 'expanded'
      }
    ))
    .pipe(gulp.dest('public/css'), { sourcemaps: true })
    .pipe(cleanCss())
    .pipe(rename(
      {
        extname: '.min.css'
      }
    ))
    .pipe(gulp.dest('public/css'), { sourcemaps: true })
}

const browserSyncFunc = () => {
  browserSync.init({
    port: 9090,
    server: {
      baseDir: './',
    },
    open: true,
  })
}

//参照元パス
const src = {
  css: 'scss/**/**.scss',
  js: 'js/*.js',
 }

//browserSyncリロード
const browserSyncReload = (done) => {
  browserSync.reload();
  done();
 }

const watchFiles = () => {
  gulp.watch(src.css, gulp.series(compileSass, browserSyncReload))
  gulp.watch(src.js, gulp.series(compileJs, browserSyncReload))
 }

exports.js = compileJs;
exports.css = compileSass;
exports.watch = gulp.parallel(watchFiles, browserSyncFunc);

exports.default = gulp.series(gulp.series(compileSass, compileJs), gulp.parallel(watchFiles, browserSyncFunc));
