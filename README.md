# angular-easy-test

[![Circle CI](https://circleci.com/gh/EventMobi/angular-easy-test.svg?style=svg)](https://circleci.com/gh/EventMobi/angular-easy-test) [![Dependency Status](https://david-dm.org/EventMobi/angular-easy-test/dev-status.svg?theme=shields.io)](https://david-dm.org/EventMobi/angular-easy-test#info=devDependencies) [![npm-version](http://img.shields.io/npm/v/angular-easy-test.svg)](https://www.npmjs.com/package/angular-easy-test)

A framework that makes Angular Unit Test's easier to write.

# install

`npm install angular-easy-test --save-dev --save-exact`

# usage

Just include `node_modules/lib/easy-test.js` into your test files. Make sure it
comes after you've included `angular.js`.

Here are some examples of using `EasyTest` with `Chai`.

```javascript

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
