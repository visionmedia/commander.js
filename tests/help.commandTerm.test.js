const commander = require('../');

// These are tests of the Help class, not of the Command help.
// There is some overlap with the higher level Command tests (which predate Help).

// commandTerm does not currently respect helpOption or ignore hidden options, so not testing those.
describe('commandTerm', () => {
  test('when plain command then returns name', () => {
    const command = new commander.Command('program');
    const helper = new commander.Help();
    expect(helper.commandTerm(command)).toEqual('program');
  });

  test('when command has alias then returns name|alias', () => {
    const command = new commander.Command('program')
      .alias('alias');
    const helper = new commander.Help();
    expect(helper.commandTerm(command)).toEqual('program|alias');
  });

  test('when command has options then returns name [options]', () => {
    const command = new commander.Command('program')
      .option('-a,--all');
    const helper = new commander.Help();
    expect(helper.commandTerm(command)).toEqual('program [options]');
  });

  test('when command has <argument> then returns name <argument>', () => {
    const command = new commander.Command('program')
      .arguments('<argument>');
    const helper = new commander.Help();
    expect(helper.commandTerm(command)).toEqual('program <argument>');
  });

  test('when command has everything then returns name|alias [options] <argument>', () => {
    const command = new commander.Command('program')
      .alias('alias')
      .option('-a,--all')
      .arguments('<argument>');
    const helper = new commander.Help();
    expect(helper.commandTerm(command)).toEqual('program|alias [options] <argument>');
  });
});
