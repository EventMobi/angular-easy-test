'use strict';

/*
 * Using webpack to build a UMD module for publishing to npm
 */

module.exports = {
  entry: './lib/easy-test',
  output: {
    path: './dist/',
    filename: 'easy-test.js',
    library: 'EasyTest',
    libraryTarget: 'umd'
  },
  /*
   * Declare external libraries which should be privoded by the user.
   *
   * See <http://webpack.github.io/docs/configuration.html#externals>
   */
  externals: {
    'angular': true,
    'angular-mocks': {
      commonjs: 'angular-mocks',
      commonjs2: 'angular-mocks',
      amd: 'angular-mocks',
      // Using browser globals, angular-mocks is found on `angular.mock`
      root: ['angular', 'mock']
    }
  }
};
