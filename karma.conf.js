module.exports = function(karma) {
  karma.set({
    basePath: '',
    frameworks: [ 'mocha', 'chai' ],
    files: [
      'node_modules/angular/angular.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'lib/easy-test.js',
      'test/app.js',
      'test/tests.js'
    ],
    reporters: [ 'progress', 'coverage', 'threshold' ],
    thresholdReporter: {
      statements: 30,
      branches: 20,
      functions: 20,
      lines: 30
    },
    port: 9877,
    background : false,
    singleRun : true,
    runnerPort: 9101,
    colors: true,
    autoWatch: false,
    browsers: [ 'Chrome' ],
    captureTimeout: 5000,
    reportSlowerThan: 500,
    plugins: [
      'karma-chai',
      'karma-mocha',
      'karma-chrome-launcher',
      'karma-coverage',
      'karma-threshold-reporter'
    ],
    preprocessors: {
      'lib/**/*.js': 'coverage'
    },
    coverageReporter: {
      reporters: [{
        type: 'html',
        dir: 'coverage/'
      }, {
        type: 'cobertura',
        dir: 'coverage/'
      }]
    }
  });
}