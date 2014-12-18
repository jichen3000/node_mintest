var util = require('util');

module.exports = function(thisObject) {
  // when use object to call a method, js will new Object(this), this is reversal function.

  // actual, this cannot be null
  if (thisObject === null) return null;
  constructorStr = util.inspect(thisObject.constructor);
  if (constructorStr === '[Function: Number]' || constructorStr === '[Function: String]' ){
    return thisObject.constructor(thisObject);
  } else {
    return thisObject;
  }
}

if (require.main === module) {
  require('testhelper');
  var assert = require('assert');

  var originalThis = module.exports;

  var testFun = function (msg) {
    console.log(msg);
  };
  assert.deepEqual((new Object(testFun) === testFun), true);
  assert.deepEqual(originalThis(new Object(testFun)), testFun);
  assert.deepEqual((originalThis(new Object(testFun)) === testFun), true);

  assert.deepEqual((new Object(1) === 1), false);
  assert.deepEqual(originalThis(new Object(1)), 1);
  assert.deepEqual((originalThis(new Object(1)) === 1), true);
  // NaN is not equal with NaN by === and even by assert.deepEqual
  assert.deepEqual((new Object(NaN) === NaN), false);
  // assert.deepEqual(NaN, NaN);
  // assert.deepEqual(originalThis(new Object(NaN)), NaN);
  assert.deepEqual((originalThis(new Object(NaN)) === NaN), false);
  // originalThis(NaN).p();
  assert.deepEqual((new Object("s") === "s"), false);
  assert.deepEqual(originalThis(new Object("s")), "s");
  assert.deepEqual((originalThis(new Object("s")) === "s"), true);
  // object is not equal with object by ===, even they have same properties.
  assert.deepEqual({a:1} === {a:1}, false);
  assert.deepEqual((new Object({a:1}) === {a:1}), false);
  assert.deepEqual(originalThis(new Object({a:1})), {a:1});
  assert.deepEqual((originalThis(new Object({a:1})) === {a:1}), false);

  // array is object
  assert.deepEqual([1,2] === [1,2], false);
  assert.deepEqual((new Object([1,2]) === [1,2]), false);
  assert.deepEqual(originalThis(new Object([1,2])), [1,2]);
  assert.deepEqual((originalThis(new Object([1,2])) === [1,2]), false);

  // actual, this cannot be null
  assert.deepEqual(originalThis(null) === null, true);

  "ok".p();
}