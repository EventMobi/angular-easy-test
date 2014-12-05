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
    reporters: [ 'progress' ],
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
      'karma-chrome-launcher'
    ],
  });
}