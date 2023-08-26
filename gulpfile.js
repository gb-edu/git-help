const { src, dest, parallel, series, watch } = require('gulp');

const browserSync  = require('browser-sync').create();
const concat       = require('gulp-concat');
const sass         = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const cleancss     = require('gulp-clean-css');

function browser_sync() {
  browserSync.init({
    server: { baseDir: 'dist/' },
    notify: false, // notify tooltip
    online: true // online: false работать без сети. Но тогда не зайти с др устройств.
  })
}

function scripts() {
  return src([
    'node_modules/jquery/dist/jquery.min.js',
    'scr/js/app.js',
  ])
  .pipe(concat('app.min.js'))   // gulp-concat (in package.json)
  .pipe(dest('dist/js/'))
  .pipe(browserSync.stream())
}

function makecss() {
  return src([
    'scr/scss/style.scss',
    'scr/scss/media.scss',
  ])
  .pipe(concat('style.css'))
  .pipe(sass())
  .pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true }))
  .pipe(cleancss(( { level: { 1: { specialComments: 0 } } } )))
  // .pipe(cleancss(( { level: { 1: { specialComments: 0 } }, format: 'beautify' } )))
  .pipe(dest('dist/'))
  .pipe(browserSync.stream())
}

function startwatch() {
  watch('scr/scss/*.scss', makecss);
  watch('scr/js/*.js', scripts);
  watch('dist/index.html').on('change', browserSync.reload);
}

exports.bsync = browser_sync; // to terminate hit ctrl+c. Имя bsync можно задать как browser_sync
exports.scripts = scripts;
exports.makecss = makecss;

exports.default = parallel(scripts, makecss, browser_sync, startwatch);
// exports.default = parallel(startwatch);