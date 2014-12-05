module.exports = function(grunt) {
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      options: {
        reporter: require('jshint-stylish'),
        globals: {
          angular: true,
          inject: true,
          expect: true,
          window: true
        }
      },
      all: [ 'Gruntfile.js', 'lib/*.js', 'test/**/*.js' ]
    },
    karma: {
      options: {
        configFile: 'karma.conf.js',
      },
      unit: {
        browsers: [ 'Chrome' ],
        reporters: [ 'progress' ]
      },
      debug: {
        singleRun: false,
        autoWatch: true,
        browsers: [ 'Chrome' ],
        reporters: [ 'progress' ]
      }
    },
  });
  
  grunt.registerTask('default', [ 'jshint', 'karma:unit' ]);
};
