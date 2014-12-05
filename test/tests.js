/**
 * Test suite for angular-easy-test
 */

describe('angular-easy-test', function() {

  // Properties that are on our test service and controller.
  var properties = [ 'one', 'two', 'test', 'something', 'somethingElse' ];

  beforeEach(function() {
    mockModule('simpleapp');
  });

  describe('#mockModule', function() {

    it('should mock correct module', function() {
      // Will work correctly if mockModule worked in the beforeEach call.
      inject(function(TestService1) {});
    });

    it('should be able to provide fake services', function() {
      mockModule('simpleapp', [{
        name: 'FakeService',
        provider: { testFunction: function() {} }
      }]);
      inject(function(FakeService) {
        expect(FakeService).to.respondTo('testFunction');
      });
    });

  });

  describe('#injectify', function() {

    it('should injectify things properly', function() {
      var serviceNames = ['TestService1', '$q', '$rootScope'],
      services = injectify(serviceNames.slice(0));

      angular.forEach(serviceNames, function(serviceName) {
        expect(services).to.have.property(serviceName);
      });
    });

  });

  describe('#createTestContext', function() {

    var context;
    beforeEach(function() {
      context = createTestContext('TestController');
    });

    it('should look like a test context', function() {
      expect(context).to.have.property('controller');
      expect(context).to.have.property('$scope');
    });

    it('should create correct controller', function() {
      expect(context.controller).to.respondTo('testFunction');
      angular.forEach(properties, function(property) {
        expect(context.$scope).to.have.property(property);
      });
    });

  });

  describe('#testScope', function() {

    it('test scope should work passing in a test context', function() {
      var context = createTestContext('TestController');
      testScope(context, {
        'function': 'one',
        'string': 'two',
        'boolean': 'test',
        'object': 'something somethingElse'
      });
    });

    it('test scope should work passing in a controller\'s name', function() {
      testScope('TestController', {
        'function': 'one',
        'string': 'two',
        'boolean': 'test',
        'object': 'something somethingElse'
      });
    });

  });

  describe('#compileDirective', function() {

    it.skip('should compile directive correctly', function() {
      var element = compileDirective('<div test-directive></div>');
    });

  });

});
