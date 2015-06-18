var exec = require('child_process').exec
  , path = require('path')
  , should = require('should');

var bin = path.join(__dirname, './fixtures/pm')

var proc = exec(bin + ' service', function (error, stdout, stderr) {
});

setTimeout(function(){
  proc.kill('SIGINT');
  setTimeout(function(){
    should.equal(true, proc.killed);
  },500);
},100);
