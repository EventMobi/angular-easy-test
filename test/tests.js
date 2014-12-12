/**
 * Test suite for angular-easy-test
 */

describe('angular-easy-test', function() {

  // Properties that are on our test service and controller.
  var properties = [ 'one', 'two', 'test', 'something', 'somethingElse' ];

  beforeEach(function() {
    EasyTest.mockModule('simpleapp');
  });

  describe('EasyTest', function () {

    it('should look like an EasyTest', function() {
      ('mockModule injectify createTestContext testScope ' +
       'compileDirective getService getController ' +
       'mockModules').split(' ').forEach(function(prop) {
         expect(EasyTest).to.itself.respondTo(prop);
       });
    });

  });

  describe('#mockModule', function() {

    it('should mock correct module', function() {
      // Will work correctly if mockModule worked in the beforeEach call.
      inject(function(TestService1) {});
    });

    it('should be able to provide fake services', function() {
      EasyTest.mockModule('simpleapp', [{
        name: 'FakeService',
        provider: { testFunction: function() {} }
      }]);
      inject(function(FakeService) {
        expect(FakeService).to.respondTo('testFunction');
      });
    });

  });

  describe('#mockModules', function() {

    it('should mock multiple modules from one string', function() {
      EasyTest.mockModules('simpleapp2 simpleapp3');
      inject(function(TestService2, TestService3) {
        expect(TestService2).to.have.property('testPropHere');
        expect(TestService3).to.have.property('anotherPropHere');
      });
    });

    it('should mock multiple modules from one or more strings', function() {
      EasyTest.mockModules('simpleapp2', 'simpleapp3');
      inject(function(TestService2, TestService3) {
        expect(TestService2).to.have.property('testPropHere');
        expect(TestService3).to.have.property('anotherPropHere');
      });
    });

    it('should provide fake values as well', function () {
      EasyTest.mockModules('simpleapp2', {
        name: 'simpleapp3',
        values: [{
          name: 'TestService3',
          provider: {
            fakePropHere: 1
          }
        }]
      });
      inject(function(TestService2, TestService3) {
        expect(TestService2).to.have.property('testPropHere');
        expect(TestService3).to.not.have.property('anotherPropHere');
        expect(TestService3).to.have.property('fakePropHere');
      });
    });

  });

  describe('#injectify', function() {

    it('should injectify things properly', function() {
      var serviceNames = ['TestService1', '$q', '$rootScope'],
      services = EasyTest.injectify(serviceNames.slice(0));

      angular.forEach(serviceNames, function(serviceName) {
        expect(services).to.have.property(serviceName);
      });
    });

  });

  describe('#createTestContext', function() {

    var context;
    beforeEach(function() {
      context = EasyTest.createTestContext('TestController');
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

  describe('#looksLike', function() {

    it('should not return error if spec matches', function(done) {
      var context = EasyTest.createTestContext('TestController');
      var res = EasyTest.looksLike(context.$scope, {
        'function': 'one',
        'string': 'two',
        'boolean': 'test',
        'object': 'something somethingElse'
      });
      done(res);
    });

    it('should return error if a property expected is not there', function() {
      var context = EasyTest.createTestContext('TestController');
      var res = EasyTest.looksLike(context.$scope, {
        'function': 'one four',
        'string': 'two',
        'boolean': 'test',
        'object': 'something somethingElse'
      });
      expect(res).to.be.an.instanceOf(Error);
      expect(res.message).to.equal('Expected object to have the property \'' +
                                   'four\'.');
    });

    it('should return error if a property is not expected type', function() {
      var context = EasyTest.createTestContext('TestController');
      var res = EasyTest.looksLike(context.$scope, {
        'boolean': 'one',
        'string': 'two',
        'object': 'something somethingElse'
      });
      expect(res).to.be.an.instanceOf(Error);
      expect(res.message).to.equal('Expected property \'one\' to be of type ' +
                                   'boolean.');
    });

  });

  describe('#testScope', function() {

    it('should work passing in a controller\'s name', function(done) {
      var res = EasyTest.testScope('TestController', {
        'function': 'one',
        'string': 'two',
        'boolean': 'test',
        'object': 'something somethingElse'
      });
      done(res);
    });

    it('should work passing in a test context', function(done) {
      var context = EasyTest.createTestContext('TestController');
      var res = EasyTest.testScope(context, {
        'function': 'one',
        'string': 'two',
        'boolean': 'test',
        'object': 'something somethingElse'
      });
      done(res);
    });

  });

  describe('#testController', function() {

    it('should work passing in a controller\'s name', function(done) {
      var res = EasyTest.testController('TestController', {
        'function': 'testFunction'
      });
      done(res);
    });

    it('should work passing in a controller', function(done) {
      var controller = EasyTest.getController('TestController');
      var res = EasyTest.testController(controller, {
        'function': 'testFunction',
      });
      done(res);
    });

  });

  describe('#testService', function() {

    it('should work passing in a service\'s name', function(done) {
      var res = EasyTest.testService('TestService1', {
        'function': 'one',
        'string': 'two',
        'boolean': 'test',
        'object': 'something'
      });
      done(res);
    });

    it('should work passing in a service', function(done) {
      var service = EasyTest.getService('TestService1');
      var res = EasyTest.testService(service, {
        'function': 'one',
        'string': 'two',
        'boolean': 'test',
        'object': 'something'
      });
      done(res);
    });

  });

  describe('#compileDirective', function() {

    it.skip('should compile directive correctly', function() {
      var element = EasyTest.compileDirective('<div test-directive></div>');
    });

  });

  describe('#getService', function() {

    it('should return a service correctly', function() {
      var my$q = EasyTest.getService('$q');
      inject(function($q) {
        expect(my$q).to.equal($q);
      });
    });

  });

  describe('#getController', function() {

    it('should return a controller correctly', function() {
      var controller = EasyTest.getController('TestController');
      expect(controller).to.itself.respondTo('testFunction');
    });

  });

});
