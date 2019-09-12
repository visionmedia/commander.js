const childProcess = require('child_process');
const path = require('path');

// Test that a signal sent to the parent process is received by the executable subcommand process (which is listening)

// Note: the previous (sinon) test had custom code for SIGUSR1, revist if required:
//    As described at https://nodejs.org/api/process.html#process_signal_events
//    this signal will start a debugger and thus the process might output an
//    additional error message: 
//      "Failed to open socket on port 5858, waiting 1000 ms before retrying".

describe.each([['SIGINT'], ['SIGHUP'], ['SIGTERM'], ['SIGUSR1'], ['SIGUSR2']])(
  'test signal handling in executableSubcommand', (value) => {
    test(`when command killed with ${value} then executableSubcommand receieves ${value}`, (done) => {
      const pmPath = path.join(__dirname, './fixtures/pm');

      // The child process writes dots to stdout.
      var proc = childProcess.spawn(pmPath, ['listen2'], {});

      let processOutput = '';
      proc.stdout.on('data', (data) => {
        if (processOutput.length === 0) {
          proc.kill(`${value}`);
        }
        processOutput += data.toString();
      });
      proc.on('close', (code) => {
        expect(processOutput).toBe(`Listening for signal...${value}`);
        done();
      });
    });
  });