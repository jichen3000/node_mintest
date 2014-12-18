var util = require('util');

module.exports = function (arg1, arg2) {
  // different with ===, for object and NaN
  // different with assert.deepEqual, for NaN

  var stack = [[arg1,arg2]];
  var recurCheckList1 = [];
  var recurCheckList2 = [];
  recurCheckList1.push(arg1);
  recurCheckList2.push(arg2);
  // arg1.pp();
  // arg2.pp();
  while(stack.length>0){
    // stack.p();
    var curPair = stack.shift();
    // curPair.p()
    var x = curPair[0];
    var y = curPair[1];
    // x.p();
    // y.p();
    // remember that NaN === NaN returns false
    // and isNaN(undefined) returns true
    if (isNaN(x) && isNaN(y) && typeof x === 'number' && typeof y === 'number') {
      // return true;
      continue;
    }
    // Compare primitives and functions.     
    // Check if both arguments link to the same object.
    // Especially useful on step when comparing prototypes
    if (x === y) {
      // return true;
      continue;
    }  

    // Works in case when functions are created in constructor.
    // Comparing dates is a common scenario. Another built-ins?
    // We can even handle functions passed across iframes
    if ((typeof x === 'function' && typeof y === 'function') ||
        (x instanceof Date && y instanceof Date) ||
        (x instanceof RegExp && y instanceof RegExp) ||
        (x instanceof String && y instanceof String) ||
        (x instanceof Number && y instanceof Number)) {
      return x.toString() === y.toString();
    }

    // At last checking prototypes as good a we can
    if (!(x instanceof Object && y instanceof Object)) {
      return false;
    }

    if (x.isPrototypeOf(y) || y.isPrototypeOf(x)) {
      return false;
    }
    if (x.constructor !== y.constructor) {
      return false;
    }

    if (x.prototype !== y.prototype) {
      return false;
    }

    if (Object.keys(x).length !== Object.keys(y).length){
      return false;
    }
    for (var item in x) {
      if (y.hasOwnProperty(item) !==  x.hasOwnProperty(item)) {
        return false;
      } else if (typeof x[item] !== typeof y[item]){
        return false;
      }
      stack.push([ x[item], y[item] ]);
      // [ x[item], y[item] ].p();
      // stack.p();
      // for circular reference check
      if (recurCheckList1.indexOf(x[item]) >= 0){
        if(recurCheckList1.indexOf(x[item]) !== recurCheckList2.indexOf(y[item])){
          return false;
        } else {
          stack.pop();
        }
      }
      recurCheckList1.push(x[item]);
      recurCheckList2.push(y[item]);
    }

  }

  return true;
};




if (require.main === module) {
  require('testhelper');
  var assert = require('assert');
  var deepEqual = module.exports;

  var fun1 = function () { console.log("1");}
  var fun2 = function () { console.log("2");}

  assert.deepEqual(deepEqual(NaN, NaN), true);
  assert.deepEqual(deepEqual(NaN, 1), false);
  assert.deepEqual(deepEqual(2, 1), false);
  assert.deepEqual(deepEqual(1, 1), true);
  assert.deepEqual(deepEqual("str", "str"), true);
  assert.deepEqual(deepEqual("str", "str1"), false);
  assert.deepEqual(deepEqual(fun1, fun1), true);
  assert.deepEqual(deepEqual(fun1, fun2), false);
  assert.deepEqual(deepEqual({a:1, b:NaN}, {b:NaN, a:1}),true);
  assert.deepEqual(deepEqual({a:1, b:NaN}, {b:1, a:1}),false);
  assert.deepEqual(deepEqual({a:1, b:NaN}, {a:1, c:NaN}),false);
  assert.deepEqual(deepEqual({a:1, b:fun1}, {a:1, b:fun1}),true);
  assert.deepEqual(deepEqual({a:1, b:fun1}, {a:1, b:fun2}),false);

  assert.deepEqual(deepEqual([1,2], [1,2]),true);
  assert.deepEqual(deepEqual([1,2], [1,3]),false);
  assert.deepEqual(deepEqual([1,[1,2]], [1,1]),false);

  //some special
  assert.deepEqual(deepEqual({a: 1, c: NaN, b: null}, {a:1, b:null, c:123}), false);
  assert.deepEqual(deepEqual({a: 1, c: NaN, b: null}, {a:1, b:null, c:NaN}), true);
  assert.deepEqual(deepEqual({a: {aa:1, bb:2}, c: NaN, b: null}, {a:{aa:1, bb:2}, b:null, c:123}), false);
  assert.deepEqual(deepEqual({a: {aa:1, bb:2}, c: NaN, b: null}, {a:{aa:1, bb:2}, b:null, c:NaN}), true);

  // for circular reference
  var recurObj1 = {a:1};
  recurObj1.myself = recurObj1;
  var recurObj2 = {a:1};
  recurObj2.myself = recurObj2;
  assert.deepEqual(deepEqual(recurObj1,recurObj2),true);
  assert.deepEqual(deepEqual(recurObj1,{a:1, b:1}),false);

  "ok".p();
}