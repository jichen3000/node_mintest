
function do_something (argument) {
  // body...
}

if (require.main === module) {
  var it = require('node-mini-test');
  it("should support something",function () {
    // body...
    // do some test
  });

  it.option('only this','sync');
  it(do_something,function () {
    // body...
    // do some test
    do_something(123).must_equal(456);
  });
}