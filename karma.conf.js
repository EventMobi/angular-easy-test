'use strict';

module.exports = function(karma) {
  karma.set({
    basePath: '',
    frameworks: ['mocha', 'chai'],
    files: [
      'test/tests.js'
    ],
    preprocessors: {
      'lib/**/*.js': ['coverage'],
      'test/tests.js': ['webpack']
    },
    webpack: {},
    webpackMiddleware: {
      stats: {
        colors: true
      }
    },
    reporters: ['progress', 'coverage', 'threshold'],
    thresholdReporter: {
      statements: 80,
      branches: 100,
      functions: 85,
      lines: 89
    },
    port: 9877,
    background: false,
    singleRun: true,
    runnerPort: 9101,
    colors: true,
    autoWatch: false,
    browsers: ['Chrome'],
    captureTimeout: 5000,
    reportSlowerThan: 500,
    plugins: [
      'karma-chai',
      'karma-mocha',
      'karma-chrome-launcher',
      'karma-coverage',
      'karma-threshold-reporter',
      'karma-webpack'
    ],
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
};
