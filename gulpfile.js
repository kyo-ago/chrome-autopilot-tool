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
        'extension/**/*'
    ], { base: process.cwd() })
        .pipe(zip('archive.zip'))
        .pipe(gulp.dest('./'))
    ;
});

gulp.task('compile:clean', function () {
    var rm = require('gulp-rm');
    return gulp.src('extension/src/*.map', { read: false })
        .pipe(rm())
    ;
});
gulp.task('compile:tsc', function () {
    var merge = require('event-stream').merge;
    var typescript = require('gulp-tsc');
    var sourcemaps = require('gulp-sourcemaps');
    var app = gulp.src(['typings/tsd.d.ts', 'src/_define.ts', 'src/*/**/*.ts'])
        .pipe(typescript({
            'out' : 'src/application.js',
            'sourcemap' : true,
            'declaration' : true
        }))
        .pipe(sourcemaps.init({'loadMaps': true}))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('extension/'))
    ;
    var init = gulp.src(['typings/tsd.d.ts', 'src/*.ts', '!src/_define.ts'])
        .pipe(typescript())
        .pipe(gulp.dest('extension/'))
    ;

    return merge(app, init);
});
gulp.task('compile', function () {
    var runSequence = require('run-sequence');
    return runSequence('compile:tsc', 'compile:clean');
});

gulp.task('test:compile', function () {
    var typescript = require('gulp-tsc');
    var espower = require('gulp-espower');
    return gulp.src(['typings/tsd.d.ts', 'extension/src/application.d.ts', 'test/**/*.ts'])
        .pipe(typescript())
        .pipe(espower())
        .pipe(gulp.dest('tmp/'))
    ;
});
gulp.task('test:karma', function (done) {
    var karma = require('karma').server;
    karma.start({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done);
});
gulp.task('test:clean', function () {
    var rm = require('gulp-rm');
    return gulp.src(['./tmp/**/*', './tmp/'], { read: false })
        .pipe(rm())
    ;
});
gulp.task('test', function () {
    var runSequence = require('run-sequence');
    runSequence('test:compile', 'test:karma', 'test:clean');
});
gulp.task('watch:testCompile', ['test:compile', 'compile'], function() {
    gulp.watch('test/**/*.ts', ['test:compile']);
    gulp.watch('src/**/*.ts', ['compile']);
});
gulp.task('watch:test', ['watch:testCompile'], function() {
    var karma = require('karma').server;
    karma.start({
        configFile: __dirname + '/karma.conf.js'
    });
});
gulp.task('default', ['watch:test']);
