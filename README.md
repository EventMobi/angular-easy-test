# angular-easy-test

[![Circle CI](https://circleci.com/gh/EventMobi/angular-easy-test.svg?style=svg)](https://circleci.com/gh/EventMobi/angular-easy-test)
[![Dependency Status](https://david-dm.org/EventMobi/angular-easy-test.svg)](https://david-dm.org/EventMobi/angular-easy-test)
[![devDependency Status](https://david-dm.org/EventMobi/angular-easy-test/dev-status.svg)](https://david-dm.org/EventMobi/angular-easy-test#info=devDependencies)
[![npm version](http://img.shields.io/npm/v/angular-easy-test.svg)](https://www.npmjs.com/package/angular-easy-test)

A library that makes Angular unit tests easier to write.

# install

```shell
npm install angular-easy-test
```

# usage

### CommonJS

```js
var EasyTest = require('angular-easy-test');
```

### AMD

```js
define(['angular-easy-test'], function(EasyTest) {
  ...
});
```

### Browser Global

```html
<script src="angular.js"></script>
<script src="angular-mocks.js"></script>
<script src="angular-easy-test.js"></script>
```

Here are some examples of using `EasyTest` with `Chai`.

```js

describe('MyService', function() {

  beforeEach(function() {
    EasyTest.mockModules('myModule myDependentModule');
    var services = EasyTest.injectify([ 'ServiceOne', '$q' ]);
    services.ServiceOne.functionToFake = function() {
      return services.$q.when('something');
    };
  });

  it('should look like my service', function(done) {
    var res = EasyTest.testService('MyService', {
      'function': 'one two',
      'number': 'three'
    });
    done(res);
  });

  it('some controller stuff', function() {
    var context = EasyTest.createTestContext('MyController');
    expect(context.$scope).to.have.property('something');
    context.controller.myFunction();
    expect(context.controller.state).to.equal('something');
  });

  it('some service stuff', function() {
    var service = EasyTest.getService('MyService');
    service.something();
    EasyTest.getService('$rootScope').$digest();
    expect(service.property).to.equal('something');
  });

  it('some directive stuff', function() {
    var element = EasyTest.compileDirective('<div my-directive></div>');
    expect(element.find('li')).to.have.length(10);
  });

});
```

### comparison with ngMock

angular-easy-test is built on top of AngularJS's [ngMock](https://docs.angularjs.org/api/ngMock). Here is the same set of test cases implemented using just ngMock:

```js
describe('MyService', function() {

  beforeEach(module('myModule', 'myDependentModule', function($provide, $q) {
    $provide.value('ServiceOne', {
      functionToFake: function() {
        return $q.when('something');
      };
    })
  }));

  it('should look like my service', inject(function(MyService) {
    expect(MyService.one).to.be.a('function');
    expect(MyService.two).to.be.a('function');
    expect(MyService.three).to.be.a('number');
  }));

  it('some controller stuff', inject(function($rootScope, $controller) {
    var scope = $rootScope.$new();
    var ctrl = $controller('MyController', {
      $scope: scope
    })
    expect(scope).to.have.property('something');
    ctrl.myFunction();
    expect(ctrl.state).to.equal('something');
  }));

  it('some service stuff', inject(function($rootScope, MyService) {
    MyService.something();
    $rootScope.$digest();
    expect(MyService.property).to.equal('something');
  }));

  it('some directive stuff', inject(function($compile, $rootScope) {
    var element = $compile('<div my-directive></div>')($rootScope.$new());
    expect(element.find('li')).to.have.length(10);
  }));

});
```

# documentation

See the [jsdocs](http://eventmobi.github.io/angular-easy-test).
