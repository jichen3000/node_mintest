var util    = require("util");

var testFunction = require("./test_function");
var stackInfo = require("./stack_info");
var prettyPrintString = require("./pretty_print_string");
var deepEqual = require("./deep_equal");
var originalThis = require('./original_this');

var puts = console.log;

var options = {onlyThis: false, skipAll: false};

var testFunctions = [];

var startTime = null;

var currentTestFunc = null;


var mustEqual = function (expectedValue) {
  if(typeof expectedValue === 'undefined'){
    throw new Error("mustEqual needs at least an argument used to compare!");
  }

  var actualValue = originalThis(this);
  var isEqual = deepEqual(actualValue, expectedValue);
  if (isEqual){
    currentTestFunc.addResult(true);
  } else{
    currentTestFunc.addResult(false, 
        expectedValue, this, stackInfo.getCallerFramePositionInfo());
  }
}

Object.defineProperty( Object.prototype, "mustEqual", {
    value: mustEqual, enumerable: false});
Object.defineProperty( Number.prototype, "mustEqual", {
    value: mustEqual, enumerable: false});

var onStart = function (argument) {
  startTime = new Date().getTime();
  process.on("exit", onExit);
}

// Running tests:

// F

// Finished tests in 0.007659s.

// 1) Failure:
// File "/Users/colin/work/minitest/minitest/test_without_test_case.py", line 7, in <module>:
// EXPECTED: 2
//   ACTUAL: 1


// 1 tests, 2 assertions, 1 failures, 0 errors.

// Run options: --seed 29538

// # Running:

// ....F

// Finished in 0.036784s, 135.9287 runs/s, 217.4859 assertions/s.

//   1) Failure:
// GA::TreeNode#test_0005_from_breadth_first_list [/Users/colin/work/ruby/test/genetic_algorithms/binary_tree.rb:182]:
// Expected: 2
//   Actual: 1

// 5 runs, 8 assertions, 1 failures, 0 errors, 0 skips
// [Finished in 0.3s with exit code 1]
var onExit = function (argument) {
  puts("Running tests:\n");
  for (var index in testFunctions){
    currentTestFunc = testFunctions[index];
    try {
      currentTestFunc.run();
    } catch (err) {
      // console.error(err.stack);
      currentTestFunc.err = err
      currentTestFunc.runStatus = 'error';
    }
    if (currentTestFunc.runStatus==='successful'){
      process.stdout.write(".");
    } else if (currentTestFunc.runStatus==='failed') {
      process.stdout.write("F");
    } else {
      process.stdout.write("E");
    }
  }
  puts("");
  puts("");
  var passSeconds = (new Date().getTime() - startTime)/1000;

  // puts("report finish time.");
  puts(util.format("Finished tests in %ds.\n", passSeconds));

  var errIndex = 1;
  // puts("error info")
  for (var index in testFunctions){
    var curFunction = testFunctions[index];
    if (curFunction.runStatus == 'error'){
      if(errIndex === 1){
        puts("Error list:");
      }
      process.stdout.write(util.format("  %d) ", errIndex))
      console.error(curFunction.err.stack);
      puts();
      errIndex++;
    }
  }
  var errCount = errIndex - 1;

  // puts("every failure");
  var notEqualIndex = 1;
  var assertionCount = 0;
  for (var index in testFunctions){
    var curFunction = testFunctions[index];
    for (var j in curFunction.compareResultList){
      var curResult = curFunction.compareResultList[j];
      assertionCount++;
      if (!curResult.isEqual){
        if(notEqualIndex===1){
          puts("Failure list:");
        }
        puts(util.format("  %d) Failure:", notEqualIndex));
        // curResult.p();
        // stackInfo.getCodePosition.apply(null, curResult.positionInfo).p();
        puts(stackInfo.getCodePosition.apply(null, curResult.positionInfo));
        puts("Expected: "+prettyPrintString.genPrettyStr(curResult.expectedValue));
        puts("  Actual: "+prettyPrintString.genPrettyStr(curResult.actualValue));
        puts();
        notEqualIndex++;
      }
    }
  }
  var notEqualCount = notEqualIndex - 1
  // puts("report statistics");
  puts(util.format("%d tests, %d assertions, %d failures, %d errors.", 
      testFunctions.length, assertionCount, notEqualCount, errCount))
  if(options['onlyThis'] === true){
    puts();
    puts("Since 'only this' has been set, only one test function has been run.");
  }
}



module.exports = function (funcOrMsg, testFunc) {
  if(testFunctions.length===0){
    onStart();
  }
  if(options['skipAll'] === false){
    testFunctions.push(new testFunction.TestFunction(funcOrMsg, testFunc));
    if(options['onlyThis'] === true){
      testFunctions = testFunctions.slice(-1);
      options['skipAll'] = true;
    }
  }
};

module.exports.option = function (optionStr) {
  if (optionStr === 'only this'){
    if (options['onlyThis'] === true){
      throw new Error("'only this' can be set only ONCE!");
    }
    options['onlyThis'] = true;
  } else {
    throw new Error("now suport: 'only this'.");
  }
  return options;
}

module.exports.getTestFunctions = function () {
  return testFunctions;
}


if (require.main === module){
  require('testhelper');

  var it = module.exports;
  it("something", function () { });
  it("something2", function () { 
    (1).mustEqual(2);
    throw new Error("123");
    '5'.mustEqual('5');
  });
  it.option("only this");
  it("something3", function () { 
    (1).mustEqual(1);
    '4'.mustEqual('4');
  });
  it("something4", function () { 
    ({a: 1, c: NaN, b: null}).mustEqual({a:1, b:null, c:NaN});
    ({a: 1, c: NaN, b: null}).mustEqual({a:1, b:null, c:123});
    ({a: 1}).mustEqual({a:1});
    '4'.mustEqual('4');
  });
  // it.getTestFunctions().ppl();
}