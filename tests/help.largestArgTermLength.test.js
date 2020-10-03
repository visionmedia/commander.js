const commander = require('../');

// These are tests of the Help class, not of the Command help.
// There is some overlap with the higher level Command tests (which predate Help).

describe('largestArgTermLength', () => {
  test('when no arguments then returns zero', () => {
    const program = new commander.Command();
    const helper = new commander.Help();
    expect(helper.largestArgTermLength(program, helper)).toEqual(0);
  });

  test('when has argument description then returns argument length', () => {
    const program = new commander.Command();
    program.arguments('<wonder>');
    program.description('dummy', { wonder: 'wonder description' });
    const helper = new commander.Help();
    expect(helper.largestArgTermLength(program, helper)).toEqual('wonder'.length);
  });

  test('when has multiple argument descriptions then returns longest', () => {
    const program = new commander.Command();
    program.arguments('<alpha> <longest> <beta>');
    program.description('dummy', {
      alpha: 'x',
      longest: 'x',
      beta: 'x'
    });
    const helper = new commander.Help();
    expect(helper.largestArgTermLength(program, helper)).toEqual('longest'.length);
  });
});
