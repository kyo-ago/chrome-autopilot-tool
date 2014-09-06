"use strict";
var gulp = require("gulp");
var typescript = require('gulp-tsc');
var merge = require('event-stream').merge;
var espower = require("gulp-espower");
var mocha = require("gulp-mocha");
var zip = require('gulp-zip');
var runSequence = require('run-sequence');
var plumber = require('gulp-plumber');
var path = require('path');
require('gulp-grunt')(gulp);

gulp.task('version', function() {
    return gulp.run('grunt-version');
});
gulp.task('zip', function () {
    return gulp.src(['_locales/**/*', 'bower_components/**/*', 'src/**/*', 'manifest.json'], { base: process.cwd() })
        .pipe(zip('archive.zip'))
        .pipe(gulp.dest('./'))
    ;
});
gulp.task('compile', function () {
    return merge.apply(this, ['background', 'content_scripts', 'window'].map(function (name) {
        return gulp.src('src/ts/'+name+'.ts')
            .pipe(typescript({ out: name+'.js', 'sourcemap' : name+'.map' }))
            .pipe(gulp.dest('src/js/'))
    }));
});
gulp.task('test:compile', function () {
    return gulp.src('test/ts/**/*.ts')
        .pipe(typescript({ module : 'commonjs' }))
        .pipe(gulp.dest('test/js/'))
    ;
});
gulp.task('power-assert', function () {
    return gulp.src('./test/*.js')
        .pipe(espower())
        .pipe(gulp.dest('./powered-test/'))
    ;
});
gulp.task('test:init', function () {
    runSequence('test:compile', 'power-assert');
});
gulp.task('test', ['test:init'], function () {
    return gulp.src('./powered-test/*.js')
        .pipe(mocha())
    ;
});
gulp.task('watch', function() {
    runSequence('compile');
    return gulp.watch('test/ts/**/*.js').on('change', function (file) {
//        var out = path.join(path.dirname(file['path']), path.basename(file['path'], '.ts') + '.xxx');
        return gulp.src(file['path'])
            .pipe(plumber())
            .pipe(mocha())
        ;
    });
});
