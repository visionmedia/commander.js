const { Option } = require('../');

describe('Option methods that should return this for chaining', () => {
  test('when call .default() then returns this', () => {
    const option = new Option('-e,--example <value>');
    const result = option.default(3);
    expect(result).toBe(option);
  });

  test('when call .parseArgWith() then returns this', () => {
    const option = new Option('-e,--example <value>');
    const result = option.parseArgWith(() => { });
    expect(result).toBe(option);
  });

  test('when call .makeOptionMandatory() then returns this', () => {
    const option = new Option('-e,--example <value>');
    const result = option.makeOptionMandatory();
    expect(result).toBe(option);
  });

  test('when call .hideHelp() then returns this', () => {
    const option = new Option('-e,--example <value>');
    const result = option.hideHelp();
    expect(result).toBe(option);
  });

  test('when call .choices() then returns this', () => {
    const option = new Option('-e,--example <value>');
    const result = option.choices(['a']);
    expect(result).toBe(option);
  });
});
