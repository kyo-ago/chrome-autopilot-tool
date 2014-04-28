'use strict';

module.exports = function(grunt) {
    var pkg = grunt.file.readJSON('package.json');
    grunt.initConfig({
        pkg: pkg,
        typescript: {
            content_scripts : {
                src : ['src/ts/Applications/content_scripts.ts'],
                dest : 'src/js/content_scripts.js',
                options : { target: 'es5' }
            },
            popup : {
                src : ['src/ts/Applications/popup.ts'],
                dest : 'src/js/popup.js',
                options : { target: 'es5' }
            },
            window : {
                src : ['src/ts/Applications/window.ts'],
                dest : 'src/js/window.js',
                options : { target: 'es5' }
            }
        },
        version: {
            options: {
                release: 'patch'
            },
            defaults: {
                src: ['package.json', 'manifest.json', 'bower.json']
            }
        },
        compress: {
            main: {
                options: {
                    archive: 'archive.zip'
                },
                files: [
                    {src: [
                        'manifest.json',
                        '_locales/**',
                        'src/css/**/*',
                        'src/html/**/*',
                        'src/img/**/*',
                        'src/js/**/*'
                    ], dest: '/'}
                ]
            }
        },
        esteWatch: {
            options: {
                dirs: ['src/ts/**/*.ts'],
                livereload: {
                    enabled: false
                }
            },
            'ts': function(filepath) { return 'typescript'; }
        }
    });

    Object.keys(pkg.devDependencies).forEach(function (devDependency) {
        if (devDependency.match(/^grunt\-/)) {
            grunt.loadNpmTasks(devDependency);
        }
    });

    grunt.registerTask('default', ['typescript', 'esteWatch']);
    grunt.registerTask('publish', ['version', 'compress']);
};
