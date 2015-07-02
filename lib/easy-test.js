'use strict';

/**
 * Framework for making Angular Unit Test's easier to write.
 */

var angular = require('angular');
require('angular-mocks');

/**
 * @class EasyTest
 */
function EasyTest() {}

/**
 * @function injectify
 * @memberof EasyTest
 * @description
 *
 * Injects a number of services and returns an object that has, as its
 * properties, the injected services.
 *
 * @param {array} injectibles An array of the names of the services to inject.
 *
 * @returns {object} An object that has, as its properties, the services that
 * were injected.
 *
 * @example
 * var services = EasyTest.injectify(['MyServiceOne', 'MyServiceTwo']);
 * expect(services.MyServiceOne).to.be.an.instanceOf(MyServiceOne);
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
 * @param {array | object} services An array of objects representing fake
 * services to register with the module. Each object must have a `name` property
 * representing the name of the service, and then one of `provider`, `constant`,
 * `value`, `factory`, or `service`. Alternately, you can supply an object matching
 * names to factories as this is typically the most default use case.
 *
 * @example
 * // Mock MyModule and provide the passed fake services to it.
 * EasyTest.mockModule('MyModule', [{
 *   name: 'ServiceName',
 *   factory: function() {}
 * },{
 *   name: 'MyFakeConstant',
 *   constant: 1337
 * }]);
 *
 * @example
 * // Mock MyModule and provide the passed fake services to it.
 * EasyTest.mockModule('MyOtherModule', {
 *   FooFactory: { foo: function() {} },
 *   BarFactory: { bar: function() {} }
 * });
 */
EasyTest.mockModule = function mockModule(moduleName, services) {
  services = services || [];

  // if services is just a hash, convert to an array of all factories
  services = Array.isArray(services) ? services :
    Object.keys(services).map(function(name) {
      return {
        name: name,
        factory: services[name]
      };
    });

  // iterate over each service, mocking it by type
  var mockTypes = [ 'factory', 'service', 'provider', 'value', 'constant' ];
  angular.mock.module(moduleName, function($provide) {
    services.forEach(function serviceProvide(service) {
      mockTypes.forEach(function mockIfExists(mocktype) {
        if (service[mocktype]) {
          if (mocktype === 'factory' || mocktype === 'service') {
            // if mocktype is factory or service, mock it into $getFn
            $provide[mocktype](service.name, [ function() {
              return service[mocktype];
            }]);
          }
          else {
            // else, mock normally (?)
            $provide[mocktype](service.name, service[mocktype]);
          }
        }
      });
    });
  });
};

/**
 * @memberof EasyTest
 * @description
 *
 * Mocks a series of modules. The arguments that are passed into this function
 * can be passed in a very flexible manner. String arguments will be split
 * on their spaces and mocked directly, object arguments will be expected to
 * have a `name` property and `values` property which is an array of the
 * values to be provided for the module. See the {@link EasyTest.mockModule}
 * function for more information on how that works.
 *
 * @param {string|object} arguments A series of string or object parameters.
 *
 * @example
 * // Simply mock three modules
 * EasyTest.mockModules('one two three');
 * // or
 * EasyTest.mockModules('one two', 'three');
 * // etc, can mix and match.
 *
 * @example
 * // Mock two simple modules and a third with a fake service.
 * EasyTest.mockModules('one two', { name: 'three', values: [{
 *   name: 'FakeService',
 *   service: { get: function() {} }
 * }]});
 */
EasyTest.mockModules = function mockModules() {
  var modules = Array.prototype.slice.call(arguments, 0);
  modules.forEach(function(arg) {
    if (typeof arg === 'string') {
      return arg.split(' ').forEach(function(moduleName) {
        angular.mock.module(moduleName); // Go directly to angular.mock
      });
    }
    EasyTest.mockModule(arg.name, arg.values);
  });
};

/**
 * @memberof EasyTest
 * @description
 *
 * Injects a specific service and returns a reference to it.
 *
 * @param {string} serviceName The name of the service to inject.
 *
 * @returns {object} The service that was injected.
 *
 * @example
 * var $q = EasyTest.getService('$q');
 */
EasyTest.getService = function getService(serviceName) {
  return EasyTest.injectify([ serviceName ])[serviceName];
};

/**
 * @memberof EasyTest
 * @description
 *
 * Creates a 'test context' for a particular controller. Note that currently
 * you need to mock any modules that this controller may need beforehand.
 * See the {@link EasyTest.mockModule} function.
 *
 * @param {string} controller The name of the controller to load and create a context for.
 *
 * @returns {object} An object with a $scope and controller property representing the
 * controller that has been loaded and its scope.
 *
 * @example
 * var context = EasyTest.createTestContext('MyControllerName');
 * expect(context.$scope).to.have.property('MyExpectedProperty');
 * expect(context.controller.myFunc).to.be.a('function');
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
* Gets a specific controller and returns a reference to it.
*
* @param {string} controllerName The name of the controller to get.
*
* @returns {object} The controller that was retreived.
*
* @example
* var myController = EasyTest.getController('myController');
*/
EasyTest.getController = function getController(controllerName) {
  return EasyTest.createTestContext(controllerName).controller;
};

/**
* @memberof EasyTest
* @description
*
* Gets a specific controller and returns a reference to it. Use this
* instead of `getController` if the controller belongs to a directive
* that has `bindToController` set to true.
*
* @param {string} controllerName The name of the controller to get.
*
* @param {object} scope a object that will be inserted into the controller's
* scope.
*
* @returns {object} The controller that was retreived.
*
* @example
* var scope = { value: 'some value' };
* var myController = EasyTest.getBoundController('myController', scope);
*/
EasyTest.getBoundController = function getBoundController(controllerName, scope) {
  var controller = {};

  inject(function($rootScope, $controller) {
    // The third arg for $controller is an undocumented parameter
    // that allows us to delay the instantiation of the controller.
    // This approach may break in a future version of angular, but it is
    // currently the only way to deal with `bindToController` controllers.
    controller = $controller(controllerName, {
      $scope: $rootScope.$new()
    }, true);
  });

  if (scope) {
    angular.extend(controller.instance, scope);
  }

  // Instantiate the controller.
  return controller();
};

/**
 * @memberof EasyTest
 * @description
 *
 * Compiles a directive and returns the top level element in the compiled
 * directive's HTML. Note that currently you need to mock any modules that
 * this directive may need beforehand. See the {@link EasyTest.mockModule} function.
 *
 * @param {string} directiveHTML The HTML of the directive to be compiled.
 * @param {object} scope a dictionary of variables that will be inserted into the element's scope.
 * @param {HTMLElement|angular.element} parent an element to attach the compiled directive as a child.
 *  If <code>scope</code> is an HTMLElement or an Angular element, it will be treated as the parent.
 *
 * @returns {HTMLElement} The top level HTML element of the compiled directive.
 *
 * @example
 * var element = EasyTest.compileDirective('&lt;p directive&gt;&lt;/p&gt;');
 * expect(element.length).to.equal(expectedLength);
 *
 * @example
 * var scope = { a: 1, b: 'something' };
 * var element = EasyTest.compileDirective('&lt;p&gt;{{a}} {{b}}&lt;/p&gt;', scope);
 * expect(element.text()).to.equal('1 something');
 *
 * @example
 * var scope = { foo: 'bar' };
 * var parent = angular.element('&lt;div&gt;&lt;/div&gt;');
 * var element = EasyTest.compileDirective('&lt;p&gt;{{foo}}&lt;/p&gt;', scope, parent);
 * expect(angular.element(parent.children()[0]).text()).to.equal('bar');
 *
 * @example
 * var parent = angular.element('&lt;div&gt;&lt;/div&gt;');
 * var element = EasyTest.compileDirective('&lt;p&gt;baz&lt;/p&gt;', parent);
 * expect(angular.element(parent.children()[0]).text()).to.equal('baz');
 */
EasyTest.compileDirective = function compileDirective(directiveHTML, scope, parent) {
  // if scope is a Node or angular.element, set parent to scope
  //  and ignore parent
  if (Node.prototype.isPrototypeOf(scope) ||
      angular.element.prototype.isPrototypeOf(scope)) {
    parent = scope;
    scope = null;
  }

  var $el;
  inject(function($compile, $rootScope) {
    var $scope = $rootScope.$new();
    if (scope) {
      angular.extend($scope, scope);
    }
    $el = angular.element(directiveHTML);

    if (parent) {
      // since angular.element(foo) doesn't do anything if foo is
      //  already an angular.element, we can simply call it anyways
      parent = angular.element(parent);
      parent.append($el);
    }

    $compile($el)($scope);
    $scope.$digest();
  });
  return $el;
};

/**
* @memberof EasyTest
* @description
*
* Allows access to the controller scope for directive that has
* `bindToController` set to true.
*
* @param {object} angularElement An angular element gotten from compiled
* HTML.
*
* @returns {object} The scope of the bound controller.
*/
EasyTest.getBoundScope = function getBoundScope(angularElement) {
  return angularElement.data('$scope').$$childHead.ctrl;
};

/**
 * @memberof EasyTest
 * @description
 *
 * Tests an HTMLElement or Angular/jQuery element to see if it contains
 * some attribute, optionally with some given value.
 *
 * @param {HTMLElement|angular.element} element the element to be tested.
 * @param {string} attr the name of the attribute being tested.
 * @param {string} val optional: the value of the attribute being tested.
 *
 * @returns {boolean} Whether the element contains the attribute `attr`.
 * If `val` is provided, returns true if and only if the value of `attr` is
 * also `val`.
 *
 * @example
 * var element = EasyTest.compileDirective('&lt;p foo="bar"&gt;&lt;/p&gt;');
 * expect(EasyTest.hasAttr(element[0], 'foo')).to.be.true;
 * expect(EasyTest.hasAttr(element[0], 'foo', 'bar')).to.be.true;
 */
EasyTest.hasAttr = function hasAttr(element, attr, val) {
  element = angular.element.prototype.isPrototypeOf(element) ?
    element[0] : element;

  var attrs = element.attributes;
  for (var k in attrs) {
    var objAttr = attrs[k];
    if ((objAttr.name === attr) && (typeof val === 'undefined' || objAttr.value === val)) {
      return true;
    }
  }
  return false;
};

/**
 * @memberof EasyTest
 * @description
 *
 * Tests an object against a JSON specification object.
 *
 * @param {object} object The object to test.
 * @param {object} spec The 'specification' to test the object against. Should
 * have the expected types as properties and the names of the properties with
 * that type as their value, separated by spaces.
 *
 * @returns {object} An error object if anything failed, nothing if it passed.
 *
 * @example
 * // Using Chai you could pass the result directly back to 'done'
 * it('test object', function(done) {
 *   var res = EasyTest.looksLike(object, {
 *     'function': 'funcOne funcTwo',
 *     'number': 'numberOne numberTwo numberThree'
 *   });
 *   done(res);
 * });
 * @example
 * // Properties can also be passed into the function as an array
 * it('test object', function(done) {
 *   var res = EasyTest.looksLike(object, {
 *     'function': [ 'funcOne', 'funcTwo' ],
 *     'number': [ 'numberOne', 'numberTwo', 'numberThree' ]
 *   });
 *   done(res);
 * });
 */
EasyTest.looksLike = function looksLike(object, spec) {
  var types = Object.getOwnPropertyNames(spec);
  for (var i = 0; i < types.length; i++) {
    var type = types[i];
    var properties = spec[type];
    if (typeof spec[type] === 'string') {
      properties = spec[type].split(' ');
    }
    for (var y = 0; y < properties.length; y++) {
      var property = properties[y];
      if (!(property in object)) {
        return new Error('Expected object to have the property \'' +
                         property + '\'.');
      }
      if (typeof object[property] !== type) {
        return new Error('Expected property \'' + property + '\' to be of ' +
                         'type ' + type + '.');
      }
    }
  }
};

/**
 * @memberof EasyTest
 * @description
 *
 * Tests a controller's scope by seeing if it conforms to a JSON specficiation
 * object. See {@link EasyTest.looksLike} for more information.
 *
 * @param {string|object} context The name of the controller to create a test
 * context for or the context itself.
 * @param {array} scopeSpec The scope's spec. An object with the names of the
 * expected types as its keys and a string for its value of all the properties,
 * separated by spaces.
 *
 * @example
 * // Will load the controller and test it using the passed spec.
 * EasyTest.testScope('MyControllerName', {
 *   'function': 'funcOne funcTwo funcThree',
 *   'number': 'numberOne numberTwo',
 *   'boolean': 'hasStuff'
 * });
 */
EasyTest.testScope = function testScope(context, scopeSpec) {
  if (typeof context === 'string') {
    context = EasyTest.createTestContext(context);
  }
  return EasyTest.looksLike(context.$scope, scopeSpec);
};

/**
 * @memberof EasyTest
 * @description
 *
 * Tests a controller to see if it conforms to a JSON specification object.
 * See {@link EasyTest.looksLike} for more information.
 *
 * @param {string|object} controller The name of the controller to create or a
 * reference to a controller.
 * @param {array} spec The controller's spec. An object with the names of the
 * expected types as its keys and a string for its value of all the properties,
 * separated by spaces.
 *
 * @example
 * // Will load the controller and test it using the passed spec.
 * EasyTest.testController('MyControllerName', {
 *   'function': 'funcOne funcTwo funcThree',
 *   'number': 'numberOne numberTwo',
 *   'boolean': 'hasStuff'
 * });
 */
EasyTest.testController = function testScope(controller, spec) {
  if (typeof controller === 'string') {
    controller = EasyTest.getController(controller);
  }
  return EasyTest.looksLike(controller, spec);
};

/**
* @memberof EasyTest
* @description
*
* Tests a service to see if it conforms to a JSON specification object.
* See {@link EasyTest.looksLike} for more information.
*
* @param {string|object} service The name of the service to create or a
* reference to a service.
* @param {array} spec  The service's spec. An object with the names of the
* expected types as its keys and a string for its value of all the properties,
* separated by spaces.
*
* @example
* // Will load the service and test it using the passed spec.
* EasyTest.testService('MyServiceName', {
*   'function': 'funcOne funcTwo funcThree',
*   'number': 'numberOne numberTwo',
*   'boolean': 'hasStuff'
* });
*/
EasyTest.testService = function testScope(service, spec) {
  if (typeof service === 'string') {
    service = EasyTest.getService(service);
  }
  return EasyTest.looksLike(service, spec);
};

module.exports = EasyTest;
