var commons = require("./commons");
var util    = require("util");

var puts = console.log;

var options = {};

var testFunctions = [];

module.exports = function (func_or_msg, test_func) {
  testFunctions.push(new commons.TestFunction(func_or_msg, test_func));  
};

module.exports.option = function () {
  // body...
  puts(arguments);
}

module.exports.getTestFunctions = function () {
  return testFunctions;
}

function runTestFunctions () {

}



if (require.main === module){
  var it = module.exports;
  it.option("only this");
  it("something");
}