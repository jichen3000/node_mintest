var fs = require('fs');
var util = require('util');

var stackInfo = module.exports;

function getStack () {
  // callsite
  var orig = Error.prepareStackTrace;
  Error.prepareStackTrace = function(_, stack) {
    return stack;
  };
  var err = new Error;
  Error.captureStackTrace(err, arguments.callee);
  var stack = err.stack;
  Error.prepareStackTrace = orig;
  return stack;
}

stackInfo.getCalleeStrSync = function (filePath, lineNumber, columnNumber) {
  var data = fs.readFileSync(filePath, {encoding: 'utf-8'});
  var curLine = data.split(/\r?\n/)[lineNumber-1];
  var callee = curLine.substring(0, columnNumber);
  callee = callee.trim()
  callee = callee.substring(0, callee.lastIndexOf("."));
  return callee;
}

stackInfo.getCodePosition = function (filePath, lineNumber, columnNumber, funcName) {
  //   File "/Users/colin/work/node_testhelper/lib/testhelper.js", line 30, in <anonymous>
  return util.format('File "%s", line %d, in %s', filePath, lineNumber, funcName);
}

stackInfo.getPositionInfo = function (frameIndex){
  // frameIndex's default value = 2
  frameIndex = typeof frameIndex !== 'undefined' ? frameIndex : 2;
  var curFrame = getStack()[frameIndex];
  return [curFrame.getFileName(), curFrame.getLineNumber(), 
      curFrame.getColumnNumber(), curFrame.getFunctionName() || '<anonymous>']
};
stackInfo.getCurrentFramePositionInfo = function (frameIndex){
  frameIndex = 1;
  var curFrame = getStack()[frameIndex];
  return [curFrame.getFileName(), curFrame.getLineNumber(), 
      curFrame.getColumnNumber(), curFrame.getFunctionName() || '<anonymous>']
};
stackInfo.getCallerFramePositionInfo = function (frameIndex){
  frameIndex = 2;
  var curFrame = getStack()[frameIndex];
  return [curFrame.getFileName(), curFrame.getLineNumber(), 
      curFrame.getColumnNumber(), curFrame.getFunctionName() || '<anonymous>']
};

if (require.main === module){
  var assert = require('assert');
  var puts = console.log;
  var posInfo = stackInfo.getPositionInfo(1);
  puts(__filename);
  // assert.deepEqual(posInfo, ["/Users/colin/work/node_testhelper/lib/stack_info.js",40,25,"anonymous"]);
  assert.deepEqual(posInfo[0], __filename);

  assert.deepEqual(stackInfo.getCalleeStrSync.apply(this, posInfo), 'var posInfo = stackInfo');

  assert.equal(stackInfo.getCodePosition("/Users/colin/work/node_testhelper/lib/stack_info.js",46,25,"<anonymous>"),
      'File "/Users/colin/work/node_testhelper/lib/stack_info.js", line 46, in <anonymous>');
}