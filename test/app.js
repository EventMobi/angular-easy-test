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

app.directive('TestDirective', [ function() {
  return {
    template: '<div><p>Testa</p></div>',
    controller: 'TestController',
  };
}]);
