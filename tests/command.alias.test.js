const commander = require('../');

// Running alias commands is tested in command.executableSubcommand.lookup.test.js
// Test various other behaviours for .alias

test('when command has alias then appears in help', () => {
  const program = new commander.Command();
  program
    .command('info [thing]')
    .alias('i');
  const helpInformation = program.helpInformation();
  expect(helpInformation).toMatch('info|i');
});

test('when command has more than one alias then only first appears in help', () => {
  const program = new commander.Command();
  program
    .command('list [thing]')
    .alias('ls')
    .alias('dir');
  const helpInformation = program.helpInformation();
  expect(helpInformation).toMatch('list|ls ');
});

test('when command name = alias then error', () => {
  const program = new commander.Command();
  expect(() => {
    program
      .command('fail')
      .alias('fail');
  }).toThrow("Command alias can't be the same as its name");
});

test('when use alias then action handler called', () => {
  const program = new commander.Command();
  const actionMock = jest.fn();
  program
    .command('list')
    .alias('ls')
    .action(actionMock);
  program.parse(['ls'], { from: 'user' });
  expect(actionMock).toHaveBeenCalled();
});

test('when use second alias then action handler called', () => {
  const program = new commander.Command();
  const actionMock = jest.fn();
  program
    .command('list')
    .alias('ls')
    .alias('dir')
    .action(actionMock);
  program.parse(['dir'], { from: 'user' });
  expect(actionMock).toHaveBeenCalled();
});
