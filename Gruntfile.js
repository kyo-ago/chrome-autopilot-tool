'use strict';

module.exports = function(grunt) {
    var pkg = grunt.file.readJSON('package.json');
    grunt.initConfig({
        pkg: pkg,
        typescript: {
            content_scripts : {
                src : ['src/ts/content_scripts.ts'],
                dest : 'src/js/content_scripts.js',
                options : { target: 'es5' }
            },
            background : {
                src : ['src/ts/background.ts'],
                dest : 'src/js/background.js',
                options : { target: 'es5' }
            },
            window : {
                src : ['src/ts/window.ts'],
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
            'ts': function(filepath) { return 'typescript:window'; }
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
