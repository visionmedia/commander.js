const commander = require('../');
const childProcess = require('child_process');
const path = require('path');

describe.skip('open issues', () => {
  // https://github.com/tj/commander.js/issues/1039
  test('#1039: when unknown option then unknown option detected', () => {
    const program = new commander.Command();
    program
      ._exitOverride();
    expect(() => {
      program.parse(['node', 'text', '--bug']);
    }).toThrow();
  });

  test('#1039: when unknown option and multiple arguments then unknown option detected', () => {
    const program = new commander.Command();
    program
      ._exitOverride();
    expect(() => {
      program.parse(['node', 'text', '--bug', '0', '1', '2', '3']);
    }).toThrow();
  });

  // https://github.com/tj/commander.js/issues/1032
  function createProgram1032() {
    const program = new commander.Command();
    program
      .command('doit [id]')
      .option('--better', 'do it better')
      .action((id, cmd) => {
      });
    return program;
  };

  test('#1032: when specify subcommand then args not empty', () => {
    const program = createProgram1032();
    program.parse(['node', 'test.js', 'doit', 'myid']);
    expect(program.args.length).toBeGreaterThan(0);
  });

  test('#1032: when specify subcommand and option then args not empty', () => {
    const program = createProgram1032();
    program.parse(['node', 'test.js', 'doit', '--better', 'myid']);
    expect(program.args.length).toBeGreaterThan(0);
  });

  // https://github.com/tj/commander.js/issues/561
  test('#561: when specify argument and unknown option then error', () => {
    const program = new commander.Command();
    program
      ._exitOverride()
      .option('-x, --x-flag', 'A flag')
      .arguments('<file>');

    expect(() => {
      program.parse(['node', 'test', '--NONSENSE', '1', '2', '3']);
    }).toThrow();
  });

  // https://github.com/tj/commander.js/issues/508
  test('#508: when arguments to executable include option flags then argument order preserved', (done) => {
    const pm = path.join(__dirname, 'fixtures/pm');
    childProcess.execFile('node', [pm, 'echo', '1', '2', '--dry-run', '3', '4', '5', '6'], function(_error, stdout, stderr) {
      expect(stdout).toBe("[ '1', '2', '--dry-run', '3', '4', '5', '6' ]\n");
      done();
    });
  });
});
