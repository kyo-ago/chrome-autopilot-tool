'use strict';

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
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
    copy: {
      typescript: {
        src: ['src/ts/**/*.js', 'src/ts/**/*.map'],
        dest: ['src/js/']
      }
    },
    esteWatch: {
      options: {
        dirs: ['_locales/**/', 'src/**/', 'test/**/'],
        livereload: {
          enabled: false
        }
      },
      'js': function(filepath) { return 'copy:typescript'; },
      '*': function(filepath) { return ''; }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-version');
  grunt.loadNpmTasks('grunt-este-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('default', ['copy:typescript', 'esteWatch']);
  grunt.registerTask('publish', ['version', 'compress']);
};
