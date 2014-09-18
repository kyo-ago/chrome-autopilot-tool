"use strict";
var gulp = require("gulp");
var typescript = require('gulp-tsc');
var merge = require('event-stream').merge;
var espower = require("gulp-espower");
var zip = require('gulp-zip');
var runSequence = require('run-sequence');
var plumber = require('gulp-plumber');
var path = require('path');
var rm = require('gulp-rm');
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
function testKarma (done) {
    karma.start({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done);
}
function testPowerAssert () {
    return gulp.src(['./tmp/test/*.js', './tmp/test/test/**/*.js'])
        .pipe(espower())
        .pipe(gulp.dest('./tmp/powered-test/'))
    ;
}
gulp.task('test:power-assert', testPowerAssert);
gulp.task('test:karma', testKarma);
gulp.task('test:clean', function () {
    return gulp.src(['./tmp/**/*', './tmp/*', './tmp/'], { read: false })
        .pipe(rm())
    ;
});
gulp.task('test:init', function () {
    runSequence('test:compile', 'test:power-assert');
});
gulp.task('test', function () {
    runSequence('test:init', 'test:karma', 'test:clean');
});
gulp.task('watch', ['compile', 'test:init'], function() {
    gulp.watch(['test/**/*.ts', 'test/*.ts']).on('change', function (file) {
        return gulp.src(file['path'].replace(__dirname + '/', ''))
            .pipe(plumber())
            .pipe(typescript())
            .pipe(gulp.dest('tmp/test/'))
            .on('end', function (done) {
                testPowerAssert().on('end', testKarma.bind(this, done));
            })
        ;
    });
    gulp.watch(['src/**/*.ts', 'src/*.ts'], ['compile']);
});
