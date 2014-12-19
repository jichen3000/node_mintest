function x(arg) {
    return arg;
}

if (require.main === module) {
  var it=require('mintest');

  it("support empty function", function () { });
  it("support report error", function () { 
    x(1).mustEqual(2);
    throw new Error("123");
    '5'.mustEqual('5');
  });
  // it.option("only this");
  it("support primitive type", function () { 
    x(1).mustEqual(1);
    '4'.mustEqual('4');
  });
  it("support object", function () { 
    ({a: 1}).mustEqual({a:1});
    ({a: 1, c: NaN, b: null}).mustEqual({a:1, b:null, c:NaN});
    ({a: 1, c: NaN, b: null}).mustEqual({a:1, b:null, c:123});
  });
  it("support compare the error throwed", function () {
    (function () {aa.bb()}).mustThrow("ReferenceError");
    (function () {aa.bb()}).mustThrow("ReferenceError", "aa is not defined");
    (function () {aa.bb()}).mustThrow("ReferenceError", "some error");
    (function () {aa.bb()}).mustThrow("TypeError");
    (function () {aa.bb()}).mustThrow("TypeError", "some error");
  });
  it("support custom compare function", function () {
    (1).mustEqual(2, function (arg1, arg2) {
      return arg1 + 1 === arg2;
    })
  });
}