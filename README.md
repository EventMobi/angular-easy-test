# angular-easy-test

[![Circle CI](https://circleci.com/gh/EventMobi/angular-easy-test.svg?style=svg)](https://circleci.com/gh/EventMobi/angular-easy-test) [![Dependency Status](https://david-dm.org/EventMobi/angular-easy-test/dev-status.svg?theme=shields.io)](https://david-dm.org/EventMobi/angular-easy-test#info=devDependencies)

A framework that makes Angular Unit Test's easier to write.

# install

`npm install angular-easy-test --save-dev --save-exact`

# usage

Just include `node_modules/lib/easy-test.js` into your test files. Make sure it
comes after you've included `angular.js`.

# dependencies

Some parts of the library currently need [Chai Expect](http://chaijs.com/api/bdd/)
to be defined as they run tests automatically. See [EasyTest.testScope](http://eventmobi.github.io/angular-easy-test/EasyTest.html#testScope)
for an example of this.

# documentation

See the [jsdocs](http://eventmobi.github.io/angular-easy-test).
