"use strict";
var gulp = require("gulp");
var typescript = require('gulp-tsc');
var merge = require('event-stream').merge;
var espower = require("gulp-espower");
var zip = require('gulp-zip');
var runSequence = require('run-sequence');
var plumber = require('gulp-plumber');
var karma = require('karma').server;
require('gulp-grunt')(gulp);

gulp.task('version', function() {
    return gulp.run('grunt-version');
});
gulp.task('zip', function () {
    return gulp.src([
        'extension/*',
        'extension/**/*'
    ], { base: process.cwd() })
        .pipe(zip('archive.zip'))
        .pipe(gulp.dest('./'))
    ;
});
gulp.task('compile', function () {
    return merge.apply(this, [
        'background',
        'content_scripts',
        'window'
    ].map(function (name) {
        return gulp.src('src/'+name+'.ts')
            .pipe(typescript({ out: name+'.js' }))
            .pipe(gulp.dest('extension/js/'))
    }));
});
gulp.task('test:compile', function () {
    return gulp.src(['test/*.ts', 'test/**/*.ts'])
        .pipe(typescript())
        .pipe(gulp.dest('tmp/test/'))
    ;
});
gulp.task('power-assert', function () {
    return gulp.src(['./tmp/test/*.js', './tmp/test/**/*.js'])
        .pipe(espower())
        .pipe(gulp.dest('./tmp/powered-test/'))
    ;
});
gulp.task('test:init', function () {
    runSequence('test:compile', 'power-assert');
});
gulp.task('test', ['test:init'], function (done) {
//    karma.start({
//        singleRun: true
//    }, done);
});
gulp.task('watch', function() {
    runSequence('compile');
    return gulp.watch('test/ts/**/*.js').on('change', function (file) {
        return gulp.src(file['path'])
            .pipe(plumber())
            .pipe(mocha())
        ;
    });
});
