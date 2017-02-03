var gulp = require('gulp');
var imagemin = require('gulp-imagemin');
var notify = require('gulp-notify');
var uglify = require('gulp-uglify');
var postcss = require('gulp-postcss');
var sass = require('gulp-sass');
var watch = require('gulp-watch');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var browserSync = require('browser-sync').create();
var autoprefixer = require('autoprefixer');
var pxtorem = require('postcss-pxtorem');
var cssnano = require('cssnano');
var mozjpeg = require('imagemin-mozjpeg');
var print = require('gulp-print');
var changed = require('gulp-changed');
var imageminOptipng = require('imagemin-pngquant');

var paths = {
  scripts: ['js/*.js'],
  sasspath: ['sass/style.scss'],
  watchsass: ['sass/*.scss', 'sass/*/*.scss', 'sass/*/*/*.scss'],
  images: ['images/*', 'images/**/*']
};

// JS Minify 
gulp.task('jsmin', function() {

    var options = {
        mangle: false
    };

  return gulp.src(paths.scripts)
    .pipe(uglify(options))
    .pipe(concat('functions.min.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('js/min'))
    .pipe(notify("JS Updated"))
    .pipe(browserSync.stream());
});

// CSS Minify 
gulp.task('css', function () {
    var plugins = [
        autoprefixer({browsers: ['ie >= 10', 'ie_mob >= 10', 'ff >= 30', 'chrome >= 34', 'safari >= 7', 'opera >= 23', 'ios >= 7', 'android >= 4.4', 'bb >= 10']}),
        pxtorem(),
        cssnano({zindex: false, discardEmpty:true, discardComments: true, autoprefixer: false, safe: true})
    ];
    return gulp.src('sass/style.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss(plugins))
        .pipe(concat('style.css'))
        .pipe(sourcemaps.write(''))
        .pipe(gulp.dest(''))
        .pipe(browserSync.stream({ match: '**/style.css' }))
        .pipe(notify({ message: 'Stylesheet Updated', onLast: true }))
});

// Image Optimizing! Beep Bop Beep
gulp.task('images', function() {
  return gulp.src(paths.images)
    .pipe(changed('dist/images'))
    .pipe(print())
    .pipe(imagemin(
        [mozjpeg({quality: 80, progressive: 'true'}), imageminOptipng({optimizationLevel: 80})] 
    )) 
    .pipe(gulp.dest('dist/images'));
});

// Rerun the task when a file changes
gulp.task('watch', ['browser-sync'], function() {
    gulp.watch(paths.watchsass, ['css']);
    gulp.watch(paths.scripts, ['jsmin']);
});

gulp.task('browser-sync', function () {
    browserSync.init({
        injectChanges: true,
        proxy: "domainhere.local"
    });
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['watch']);