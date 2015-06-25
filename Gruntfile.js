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
    release: {
      options: {
        npm: false,
        commitMessage: 'Release <%= version %>',
        beforeRelease: ['webpack:dist']
      }
    },
    webpack: {
      dist: require('./webpack.config')
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
