/**
 * Simple test app.
 */

var app = angular.module('simpleapp', []);

app.factory('TestService1', function() {
  return {
    one: function() { return 'one'; },
    two: 'two',
    test: false,
    something: {}
  };
});

app.controller('TestController', function($scope, TestService1) {
  $scope.one = function() {};
  $scope.two = 'two';
  $scope.test = false;
  $scope.something = {};
  $scope.somethingElse = {};
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
