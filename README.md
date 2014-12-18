# Mintest

This project is inspired by Ruby minispec, and same as the Python minitest.

I am actively developing it, now it only support one method mustEqual.

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

print result:

    Running tests:

    .E.F

    Finished tests in 0.004s.

      1) Error: 123
        at it.a (/Users/colin/work/node_mintest/test/test_mintest.js:10:11)
        at self.TestFunction.run (/Users/colin/work/node_mintest/lib/test_function.js:14:30)
        at process.onExit (/Users/colin/work/node_mintest/lib/mintest.js:79:23)
        at process.emit (events.js:95:17)

      1) Failure:
    File "/Users/colin/work/node_mintest/test/test_mintest.js", line 9, in it.a
    Expected: 2
      Actual: 1

      2) Failure:
    File "/Users/colin/work/node_mintest/test/test_mintest.js", line 19, in <anonymous>
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

    4 tests, 7 assertions, 2 failures, 1 errors.

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
