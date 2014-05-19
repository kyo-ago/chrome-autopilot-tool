"use strict";
var gulp = require("gulp");
var typescript = require('gulp-tsc');
var espower = require("gulp-espower");
var mocha = require("gulp-mocha");
var zip = require('gulp-zip');
require('gulp-grunt')(gulp);

gulp.task('version', function() {
    gulp.run('grunt-version');
});
gulp.task('zip', function () {
    gulp.src(['_locales/**/*', 'bower_components/**/*', 'src/**/*', 'manifest.json'], { base: process.cwd() })
        .pipe(zip('archive.zip'))
        .pipe(gulp.dest('./'));
});
gulp.task('compile', function () {
    gulp.src('src/ts/background.ts')
        .pipe(typescript({ out: 'background.js' }))
        .pipe(gulp.dest('src/js/'));
    gulp.src('src/ts/content_scripts.ts')
        .pipe(typescript({ out: 'content_scripts.js' }))
        .pipe(gulp.dest('src/js/'));
    gulp.src('src/ts/window.ts')
        .pipe(typescript({ out: 'window.js' }))
        .pipe(gulp.dest('src/js/'));
});
var paths = {
    test: "./test/*.js",
    powered_test: "./powered-test/*.js",
    powered_test_dist: "./powered-test/"
};
gulp.task("power-assert", function () {
    return gulp.src(paths.test)
        .pipe(espower())
        .pipe(gulp.dest(paths.powered_test_dist));
});
gulp.task("test", ["power-assert"], function () {
    gulp.src(paths.powered_test)
        .pipe(mocha());
});
