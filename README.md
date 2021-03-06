# Mintest

This project is inspired by Ruby's minispec and Python's minitest.

It offers some useful methods:

    mustEqual, mustThrow, option.

github: [https://github.com/jichen3000/node_mintest](https://github.com/jichen3000/node_mintest)

-----------------------

### Author

Colin Ji <jichen3000@gmail.com>


### How to install

    npm install mintest

### How to use
In your code, you can write as the below:


    var it=require('mintest');

    // the function you want to test
    function x(arg) {
        return arg;
    }

    if (require.main === module) {

      it("support empty function", function () { });

      it("support report error", function () { 
        (1).mustEqual(2);
        throw new Error("123");
        '5'.mustEqual('5');
      });

      it("support primitive type", function () { 
        (1).mustEqual(1);
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

print result:

    Running tests:

    .E.FF.

    Finished tests in 0.008s.

    Error list:
      1) Error: 123
        at it.a (/Users/colin/work/node_mintest/lib/mintest.js:238:11)
        at self.TestFunction.run (/Users/colin/work/node_mintest/lib/test_function.js:14:30)
        at process.onExit (/Users/colin/work/node_mintest/lib/mintest.js:128:23)
        at process.emit (events.js:95:17)

    Failure list:
      1) Failure:
    File "/Users/colin/work/node_mintest/lib/mintest.js", line 237, in it.a
    Expected: 2
      Actual: 1

      2) Failure:
    File "/Users/colin/work/node_mintest/lib/mintest.js", line 249, in <anonymous>
    Expected: {
      "a": 1,
      "b": null,
      "c": 123
    }
      Actual: {
      "a": 1,
      "c": "NaN",
      "b": null
    }

      3) Failure:
    File "/Users/colin/work/node_mintest/lib/mintest.js", line 254, in <anonymous>
    Expected: {
      "error name": "ReferenceError",
      "error message": "some error"
    }
      Actual: {
      "error name": "ReferenceError",
      "error message": "aa is not defined"
    }

      4) Failure:
    File "/Users/colin/work/node_mintest/lib/mintest.js", line 255, in <anonymous>
    Expected: "TypeError"
      Actual: "ReferenceError"

      5) Failure:
    File "/Users/colin/work/node_mintest/lib/mintest.js", line 256, in <anonymous>
    Expected: {
      "error name": "TypeError",
      "error message": "some error"
    }
      Actual: {
      "error name": "ReferenceError",
      "error message": "aa is not defined"
    }

    6 tests, 12 assertions, 5 failures, 1 errors.

And now, it support 'only this' option, it can run only one test function which is nearest to the option. Example:

    var it=require('mintest');

    // the function you want to test
    function x(arg) {
        return arg;
    }

    if (require.main === module) {

      it("something2", function () { 
        x(1).mustEqual(2);
        throw new Error("123");
        x('5').mustEqual('5');
      });
      it.option("only this");
      it("something3", function () { 
        x(1).mustEqual(1);
        '4'.mustEqual('4');
      });
    }


print result:

    Running tests:

    .

    Finished tests in 0.004s.

    1 tests, 2 assertions, 0 failures, 0 errors.
    
    Since 'only this' has been set, only one test function has been run.
    [Finished in 0.1s]
