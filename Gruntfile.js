'use strict';

module.exports = function(grunt) {
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    eslint: {
      all: ['Gruntfile.js', 'karma.conf.js', 'lib/*.js', 'test/**/*.js']
    },
    karma: {
      options: {
        configFile: 'karma.conf.js'
      },
      unit: {
        browsers: [ 'Chrome' ],
        reporters: [ 'progress', 'coverage', 'threshold' ]
      },
      debug: {
        singleRun: false,
        autoWatch: true,
        browsers: [ 'Chrome' ],
        reporters: [ 'progress', 'coverage', 'threshold' ]
      }
    },
    bump: {
      options: {
        files: [ 'package.json' ],
        commit: true,
        commitMessage: 'Release v%VERSION%',
        commitFiles: [ 'package.json' ],
        createTag: true,
        tagName: 'v%VERSION%',
        tagMessage: 'Version %VERSION%',
        push: true,
        pushTo: 'origin',
        gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d',
        globalReplace: false
      }
    },
    jsdoc: {
      dist: {
        src: [ 'lib/easy-test.js', 'README.md' ],
        options: {
          destination: 'docs'
        }
      }
    }
  });

  grunt.registerTask('default', ['eslint', 'karma:unit']);
};
