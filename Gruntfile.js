'use strict';

module.exports = function(grunt) {
    var pkg = grunt.file.readJSON('package.json');
    grunt.initConfig({
        pkg: pkg,
        version: {
            options: {
                release: 'patch'
            },
            defaults: {
                src: ['package.json', 'manifest.json', 'bower.json']
            }
        }
    });

    Object.keys(pkg.devDependencies).forEach(function (devDependency) {
        if (devDependency.match(/^grunt\-/)) {
            grunt.loadNpmTasks(devDependency);
        }
    });

    grunt.registerTask('default', 'version');
};