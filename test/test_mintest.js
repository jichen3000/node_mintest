var it=require('./../lib/mintest');

function x(arg) {
    return arg;
}

if (require.main === module) {
  require("testhelper");

  it.option("only this");
  it("something", function () { });
  it("something2", function () { 
    x(1).mustEqual(2);
    throw new Error("123");
    x('5').mustEqual('5');
  });
  it("something3", function () { 
    x(1).mustEqual(1);
    '4'.mustEqual('4');
  });
  it("something4", function () { 
    ({a: 1, c: NaN, b: null}).mustEqual({a:1, b:null, c:NaN});
    ({a: 1, c: NaN, b: null}).mustEqual({a:1, b:null, c:123});
    ({a: 1}).mustEqual({a:1});
    '4'.mustEqual('4');
  });
}