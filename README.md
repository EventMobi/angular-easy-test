# angular-easy-test

[![Circle CI](https://circleci.com/gh/EventMobi/angular-easy-test.svg?style=svg)](https://circleci.com/gh/EventMobi/angular-easy-test)
[![Dependency Status](https://david-dm.org/EventMobi/angular-easy-test.svg)](https://david-dm.org/EventMobi/angular-easy-test)
[![devDependency Status](https://david-dm.org/EventMobi/angular-easy-test/dev-status.svg)](https://david-dm.org/EventMobi/angular-easy-test#info=devDependencies)
[![npm version](http://img.shields.io/npm/v/angular-easy-test.svg)](https://www.npmjs.com/package/angular-easy-test)

A library that makes Angular unit test's easier to write.

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

# documentation

See the [jsdocs](http://eventmobi.github.io/angular-easy-test).
