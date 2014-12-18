var self = module.exports;

var puts  =console.log;

self.TestFunction = function (funcOrMsg, theFunc){
  this.msg = funcOrMsg.toString();
  this.func = theFunc;
  this.runStatus = 'successful';
  this.compareResultList = [];
  this.err = null;
};

self.TestFunction.prototype.run = function () {
  var runResult =  this.func.call(null);
  return runResult;
};

self.TestFunction.prototype.addResult = function (isEqual, expectedValue, actualValue, positionInfo) {
  var newCompareResult = new self.CompareResult(
      isEqual, expectedValue, actualValue, positionInfo);
  this.compareResultList.push(newCompareResult);
  // one failed, means this test function is failed.
  if (isEqual===false) this.runStatus = 'failed';
  return newCompareResult;
};

self.CompareResult = function (isEqual, expectedValue, actualValue, positionInfo) {
  this.isEqual = isEqual;
  this.expectedValue = expectedValue;
  this.actualValue = actualValue;
  this.positionInfo = positionInfo;

  // body...
};





if (require.main === module) {
  require('testhelper');
  
  (new self.TestFunction("should ", function (argument) {
      // body...
  })).pp();

  "ok".p();
}