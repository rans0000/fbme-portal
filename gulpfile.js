/*global require: true*/

var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var mockServer = require('gulp-mock-server');

var mode = 'dev/';

var scssConfig = {outputStyle: 'compressed'};

gulp.task('sass', function () {
    return gulp.src([mode + 'sass/**/style.scss', mode + 'sass/**/lang-*.scss'])
        .pipe(sourcemaps.init())
        .pipe(sass(scssConfig).on('error', sass.logError))
        .pipe(sourcemaps.write('/'))
        .pipe(gulp.dest(mode + 'css'));
});

gulp.task('mock', function() {
    gulp.src('.')
        .pipe(mockServer({
        port: 8090,
        allowCrossOrigin: true
    }));
});

gulp.task('watch', function () {
    //gulp.watch('images/sprites/**/*.png', ['sprite']);
    gulp.watch(mode + 'sass/**/*.scss', ['sass']);
});