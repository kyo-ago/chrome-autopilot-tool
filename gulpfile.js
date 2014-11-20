"use strict";
var gulp = require("gulp");

gulp.task('bump', function () {
    var bump = require('gulp-bump');
    var path = require('path');
    ['*.json', 'extension/*.json'].forEach(function (file) {
        gulp.src(file)
            .pipe(bump())
            .pipe(gulp.dest(path.dirname(file)))
        ;
    });
});

gulp.task('zip', function () {
    var zip = require('gulp-zip');
    return gulp.src([
        'extension/*',
        'extension/**/*'
    ], { base: process.cwd() })
        .pipe(zip('archive.zip'))
        .pipe(gulp.dest('./'))
    ;
});

gulp.task('compile', function () {
    var merge = require('event-stream').merge;
    var typescript = require('gulp-tsc');
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
    var typescript = require('gulp-tsc');
    return gulp.src(['test/*.ts', 'test/**/*.ts'])
        .pipe(typescript())
        .pipe(gulp.dest('tmp/test/'))
    ;
});
function testPowerAssert () {
    var espower = require("gulp-espower");
    return gulp.src(['./tmp/test/*.js', './tmp/test/test/**/*.js'])
        .pipe(espower())
        .pipe(gulp.dest('./tmp/powered-test/'))
    ;
}
gulp.task('test:power-assert', testPowerAssert);
gulp.task('test:karma', function (done) {
    var karma = require('karma').server;
    karma.start({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done);
});
gulp.task('test:clean', function () {
    var rm = require('gulp-rm');
    return gulp.src(['./tmp/**/*', './tmp/*', './tmp/'], { read: false })
        .pipe(rm())
    ;
});
gulp.task('test:init', function () {
    var runSequence = require('run-sequence');
    runSequence('test:compile', 'test:power-assert');
});
gulp.task('test', function () {
    var runSequence = require('run-sequence');
    runSequence('test:init', 'test:karma', 'test:clean');
});
gulp.task('watch', ['compile', 'test:init'], function() {
    var karma = require('karma').server;
    var plumber = require('gulp-plumber');
    var typescript = require('gulp-tsc');
    karma.start({
        configFile: __dirname + '/karma.conf.js'
    });
    gulp.watch(['test/**/*.ts', 'test/*.ts']).on('change', function (file) {
        return gulp.src(file['path'].replace(__dirname + '/', ''))
            .pipe(plumber())
            .pipe(typescript())
            .pipe(gulp.dest('tmp/test/'))
            .on('end', testPowerAssert)
            ;
    });
    gulp.watch(['src/**/*.ts', 'src/*.ts'], ['compile']);
});

gulp.task('default', ['watch']);
