const { Command } = require('../');

function getSuggestion(program, arg) {
  let message = '';
  program.exitOverride();
  program.configureOutput({
    writeErr: (str) => { message = str; }
  });
  try {
    program.parse([arg], { from: 'user' });
  } catch (err) {
  }

  const match = message.match(/Did you mean (one of )?(.*)\?/);
  return match ? match[2] : null;
};

test.each([
  ['yyy', ['zzz'], null, 'none similar'],
  ['a', ['b'], null, 'one edit away but not similar'],
  ['a', ['ab'], 'ab', 'one edit away'],
  ['ab', ['a'], null, 'one edit away'],
  ['at', ['cat'], 'cat', '1 insertion'],
  ['cat', ['at'], 'at', '1 deletion'],
  ['bat', ['cat'], 'cat', '1 substitution'],
  ['act', ['cat'], 'cat', '1 transposition'],
  ['cxx', ['cat'], null, '2 edits away and short string'],
  ['caxx', ['cart'], 'cart', '2 edits away and longer string'],
  ['1234567', ['1234567890'], '1234567890', '3 edits away is similar for long string'],
  ['123456', ['1234567890'], null, '4 edits is too far'],
  ['xat', ['rat', 'cat', 'bat'], 'bat, cat, rat', 'sorted possibles'],
  ['cart', ['camb', 'cant', 'bard'], 'cant', 'only closest of different edit distances']
])('when cli of %s and commands %j then suggest %s because %s', (arg, commandNames, expected) => {
  const program = new Command();
  commandNames.forEach(name => { program.command(name); });
  const suggestion = getSuggestion(program, arg);
  expect(suggestion).toBe(expected);
});

test('when similar alias then suggest alias', () => {
  const program = new Command();
  program.command('xyz')
    .alias('car');
  const suggestion = getSuggestion(program, 'bar');
  expect(suggestion).toBe('car');
});

test('when similar hidden alias then not suggested', () => {
  const program = new Command();
  program.command('xyz')
    .alias('visible')
    .alias('silent');
  const suggestion = getSuggestion(program, 'slent');
  expect(suggestion).toBe(null);
});

test('when similar command and alias then suggest both', () => {
  const program = new Command();
  program.command('aaaaa')
    .alias('cat');
  program.command('bat');
  program.command('ccccc');
  const suggestion = getSuggestion(program, 'mat');
  expect(suggestion).toBe('bat, cat');
});

test('when implicit help command then help is candidate for suggestion', () => {
  const program = new Command();
  program.command('sub');
  const suggestion = getSuggestion(program, 'hepl');
  expect(suggestion).toBe('help');
});

test('when help command disabled then not candidate for suggestion', () => {
  const program = new Command();
  program.addHelpCommand(false);
  program.command('sub');
  const suggestion = getSuggestion(program, 'hepl');
  expect(suggestion).toBe(null);
});

test('when default help option then --help is candidate for suggestion', () => {
  const program = new Command();
  const suggestion = getSuggestion(program, '--hepl');
  expect(suggestion).toBe('--help');
});

test('when custom help option then --custom-help is candidate for suggestion', () => {
  const program = new Command();
  program.helpOption('-H, --custom-help');
  const suggestion = getSuggestion(program, '--custom-hepl');
  expect(suggestion).toBe('--custom-help');
});

test('when help option disabled then not candidate for suggestion', () => {
  const program = new Command();
  program.helpOption(false);
  const suggestion = getSuggestion(program, '--hepl');
  expect(suggestion).toBe(null);
});
