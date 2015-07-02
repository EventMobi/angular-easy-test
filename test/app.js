'use strict';

/**
 * Simple test app.
 */

var angular = require('angular');

var app = angular.module('simpleapp', []);

app.factory('TestService1', function() {
  return {
    one: function() { return 'one'; },
    two: 'two',
    test: false,
    something: {}
  };
});

app.controller('TestController', function($scope, TestService1) {  // eslint-disable-line no-unused-vars
  $scope.one = function() {};
  $scope.two = 'two';
  $scope.test = false;
  $scope.something = {};
  $scope.somethingElse = {};
  this.testFunction = function() {};
});

app.controller('TestBoundController', function(TestService1) {  // eslint-disable-line no-unused-vars
  this.one = function() {};
  this.two = 'two';
  this.test = false;
  this.something = {};
  this.somethingElse = {};
  this.testFunction = function() {};
});

app.directive('testDirective', function() {
  return {
    template: '<div><p>Testa</p></div>',
    controller: 'TestController'
  };
});

var simpleapp2 = angular.module('simpleapp2', []);

simpleapp2.factory('TestService2', function() {
  return {
    testPropHere: 1
  };
});

var simpleapp3 = angular.module('simpleapp3', []);

simpleapp3.factory('TestService3', function() {
  return {
    anotherPropHere: 1
  };
});

angular.module('simpleapp4', [])
  .controller('simpleCtrl', function($scope, $baz) {
    $scope.baz = function baz() {
      return $baz;
    };
  })
  .provider({
    $baz: function somethingStupidThatShouldBeMocked() {
      this.$get = function $get() {
        return 'arbitrary result that should be mocked';
      };
    }
  });

module.exports = app;
