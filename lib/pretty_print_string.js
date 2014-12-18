var util = require('util');

var originalThis = require('./original_this');

var self = module.exports;
var puts = console.log;


function objectToString(o) {
  return Object.prototype.toString.call(o);
}
function isUndefined(arg) {
  return arg === void 0;
}
function isNumberWrong(arg) {
  return typeof arg === 'number';
  // return !isNaN(parseFloat(arg));
}
function isNumber(arg) {
  return typeof arg === 'number';
  // return !isNaN(parseFloat(arg));
}
function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
function isFunction(arg) {
  return typeof arg === 'function';
}
function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
function isNaNObject(arg) {
  return Object.keys(arg).length===0 && isNaN(arg);
}
function isString(arg) {
  return typeof arg === 'string' || arg instanceof String;
}

self.genSimpleStr = function (obj) {
  if(isString(obj)) return obj;
  // for Boolean
  if(obj.toString() === 'true' || obj.toString() === 'false') return obj.toString();
  // for NaN
  if(isObject(obj) && Object.keys(obj).length===0 && isNaN(obj)) return 'NaN';
  if (isNumber(obj)) return obj.toString();
  return util.inspect(obj);
}

self.genPrettyStr = function (obj) {
  if(isObject(obj) && Object.keys(obj).length===0 && isNaN(obj)) return 'NaN';
  var cache = [];
  var result = JSON.stringify(obj, function (key, value) {
    if (isObject(value)){
      if (cache.indexOf(value) !== -1) {
        // circular reference found
        return '[circular]';
      }
      cache.push(value);
    }
    // puts("v:"+value);
    if(!isString(value) && isNaN(value) && !isObject(value) && !isFunction(value)) return 'NaN';
    // if (isUndefined(value)) {
    //   return '' + value;
    // }
    if (isNumber(value) && (isNaN(value) || !isFinite(value))) {
      return value.toString();
    }
    if (isFunction(value) || isRegExp(value)) {
      return value.toString();
      // return '[function]';
    }
    return value;
    
  }, 2);
  cache=null;
  return result;
}


if (require.main === module) {
  var assert = require('assert');
  
  var obj = {mykey:1, myfun:function (argument) {
    console.log(argument);
    return argument;
  }};
  obj.obj = obj;

  assert.equal(self.genSimpleStr(123), '123');
  var returnThis = function (arg) {
    return arg;
  }
  var mm=123;
  assert.equal(isNumber(returnThis(mm)), true);
  assert.equal(self.genSimpleStr(mm), '123');
  assert.equal(self.genSimpleStr(true), 'true');
  assert.equal(self.genSimpleStr(NaN), 'NaN');
  assert.equal(self.genSimpleStr(returnThis), '[Function]');
  assert.equal(self.genPrettyStr(returnThis), "\"function (arg) {\\n    return arg;\\n  }\"");
  assert.equal(self.genSimpleStr([1,2]), '[ 1, 2 ]');

  assert.equal(self.genPrettyStr(obj), 
    '{\n  "mykey": 1,\n  "myfun": "function (argument) {\\n    console.log(argument);\\n    return argument;\\n  }",\n  "obj": "[circular]"\n}')

}
