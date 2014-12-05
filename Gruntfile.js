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
      all: [ 'Gruntfile.js', 'lib/*.js' ]
    }
  });
  
  grunt.registerTask('default', [ 'jshint' ]);
};
