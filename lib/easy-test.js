/**
 * Framework for making Angular Unit Test's easier to write.
 */
(function() {
  'use strict';

  /**
   * @class EasyTest
   */
  function EasyTest() {}

  /**
   * @function injectify
   * @memberof EasyTest
   * @description
   *
   * Injects a number of services and returns an object containing the injected
   * services.
   *
   * @param {array} injectibles An array of service names to inject.
   *
   * @returns {object} An object containing the services that were injected.
   *
   * @example
   *
   <pre>
     var services = window.injectify(['MyServiceOne', 'MyServiceTwo']);
     expect(services.MyServiceOne).to.be.an.instanceOf(MyServiceOne);
   </pre>
   */
  EasyTest.injectify = function injectify(injectibles) {
    var obj = [];
    injectibles.push(function() {
      for (var i = 0, l = arguments.length; i < l; i++) {
        obj[injectibles[i]] = arguments[i];
      }
    });
    inject(injectibles);
    return obj;
  };

  /**
   * @memberof EasyTest
   * @description
   *
   * Mocks a specified module that has already been registered with angular.
   * Optionally registers a number of services with the mocked module.
   *
   * @param {string} moduleName The name of the module to mock.
   * @param {array} services An array of objects representing fake services to register
   * with the module. Each object must have a name property representing the
   * name of the service and a provider property which is the body of the
   * service, i.e. an object that has the functions and properties of the service.
   *
   * @example
   *
   <pre>
     // Mock MyModule and provide the passed fake services to it.
     window.mockModule('MyModule', [{
         name: 'MyFakeServiceName', =
         provider: {
           get: function() {},
           name: 'ServiceName'
         }
     }]);
   </pre>
   */
  EasyTest.mockModule = function mockModule(moduleName, services) {
    services = services || [];
    angular.mock.module(moduleName, function($provide) {
      services.forEach(function (service) {
        $provide.factory(service.name, [ function () {
          return service.provider;
        }]);
      });
    });
  };

  /**
   * @memberof EasyTest
   * @description
   *
   * Creates a 'test context' for a particular controller. Note that currently
   * you need to mock any modules that this controller may need beforehand.
   * See the mockModule function above.
   *
   * @param {string} controller The name of the controller to load and create a context for.
   *
   * @returns {object} An object with a $scope and controller property representing the
   * controller that has been loaded and its scope.
   *
   * @example
   *
   <pre>
     var context = window.createTextContext('MyControllerName');
     expect(context.$scope).to.have.property('MyExpectedProperty');
     expect(context.controller.myFunc).to.be.a('function');
   </pre>
   */
  EasyTest.createTestContext = function createTestContext(controller) {
    var testContext = {};
    inject(function($rootScope, $controller) {
      var $scope = $rootScope.$new();
      testContext = {
        $scope: $scope,
        controller: $controller(controller, {
          $scope: $scope
        })
      };
    });
    return testContext;
  };

  /**
   * @memberof EasyTest
   * @description
   *
   * Compiles a directive and returns the top level element in the compiled
   * directives HTML. Note that currently you need to mock any modules that
   * this directive may need beforehand. See the mockModule function above.
   *
   * @param {string} directiveHTML The HTML of the directive to be compiled, for example,
   * <div my-directive directive-var="1">My transcluded data here, possibly</div>
   *
   * @returns {HTMLElement} The top level HTML element of the compiled directive.
   *
   * @example
   *
   <pre>
     var element = window.compileDirective('<div em-my-directive>{{ item }}</div>');
     expect(element.length).to.equal(expectedLength);
   </pre>
   */
  EasyTest.compileDirective = function compileDirective(directiveHTML) {
    var $el;
    inject(function($compile, $rootScope) {
      var $scope = $rootScope.$new();
      $el = angular.element(directiveHTML);
      $compile($el)($scope);
      $scope.$digest();
    });
    return $el;
  };

  /**
   * @memberof EasyTest
   * @description
   *
   * Creates a test context for a controller and then tests its scope via
   * reading the passed scope spec.
   *
   * @param {string|object} context The name of the controller to create a test
   * context for or the context itself.
   * @param {array} scopeSpec The scope's spec. An object with the names of the
   * expected types as its keys and a string for its value of all the properties,
   * separated by spaces, that are that type i.e. { 'function': 'prop1 prop2', 'array': 'prop3' }
   *
   * @example
   *
   <pre>
     // Will load the controller and test it using the passed spec.
     window.testScope('MyControllerName', {
       'function': [ 'funcOne', 'funcTwo', 'funcThree' ],
       'number': [ 'numberOne', 'numberTwo' ],
       'boolean': [ 'hasStuff' ];
     });
   </pre>
   */
  EasyTest.testScope = function testScope(context, scopeSpec) {
    if (typeof context === 'string') {
      context = EasyTest.createTestContext(context);
    }
    Object.getOwnPropertyNames(scopeSpec).forEach(function(type) {
      scopeSpec[type].split(' ').forEach(function(prop) {
        expect(context.$scope).to.have.property(prop);
        expect(context.$scope[prop]).to.be.an(type);
      });
    });
  };

  window.EasyTest = EasyTest;

}());
