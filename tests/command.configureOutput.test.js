const commander = require('../');

test('when default writeErr() then error on stderr', () => {
  const writeSpy = jest
    .spyOn(process.stderr, 'write')
    .mockImplementation(() => {});
  const program = new commander.Command();
  program.exitOverride();

  try {
    program.parse(['--unknown'], { from: 'user' });
  } catch (err) {
    /* empty */
  }

  expect(writeSpy).toHaveBeenCalledTimes(1);
  writeSpy.mockRestore();
});

test('when custom writeErr() then error on custom output', () => {
  const writeSpy = jest
    .spyOn(process.stderr, 'write')
    .mockImplementation(() => {});
  const customWrite = jest.fn();
  const program = new commander.Command();
  program.exitOverride().configureOutput({ writeErr: customWrite });

  try {
    program.parse(['--unknown'], { from: 'user' });
  } catch (err) {
    /* empty */
  }

  expect(writeSpy).toHaveBeenCalledTimes(0);
  expect(customWrite).toHaveBeenCalledTimes(1);
  writeSpy.mockRestore();
});

test('when default write() then version on stdout', () => {
  const writeSpy = jest
    .spyOn(process.stdout, 'write')
    .mockImplementation(() => {});
  const program = new commander.Command();
  program.exitOverride().version('1.2.3');

  expect(() => {
    program.parse(['--version'], { from: 'user' });
  }).toThrow();

  expect(writeSpy).toHaveBeenCalledTimes(1);
  writeSpy.mockRestore();
});

test('when custom write() then version on custom output', () => {
  const writeSpy = jest
    .spyOn(process.stdout, 'write')
    .mockImplementation(() => {});
  const customWrite = jest.fn();
  const program = new commander.Command();
  program
    .exitOverride()
    .version('1.2.3')
    .configureOutput({ writeOut: customWrite });

  expect(() => {
    program.parse(['--version'], { from: 'user' });
  }).toThrow();

  expect(writeSpy).toHaveBeenCalledTimes(0);
  expect(customWrite).toHaveBeenCalledTimes(1);
  writeSpy.mockRestore();
});

test('when default write() then help on stdout', () => {
  const writeSpy = jest
    .spyOn(process.stdout, 'write')
    .mockImplementation(() => {});
  const program = new commander.Command();
  program.outputHelp();

  expect(writeSpy).toHaveBeenCalledTimes(1);
  writeSpy.mockRestore();
});

test('when custom write() then help error on custom output', () => {
  const writeSpy = jest
    .spyOn(process.stdout, 'write')
    .mockImplementation(() => {});
  const customWrite = jest.fn();
  const program = new commander.Command();
  program.configureOutput({ writeOut: customWrite });
  program.outputHelp();

  expect(writeSpy).toHaveBeenCalledTimes(0);
  expect(customWrite).toHaveBeenCalledTimes(1);
  writeSpy.mockRestore();
});

test('when default writeErr then help error on stderr', () => {
  const writeSpy = jest
    .spyOn(process.stderr, 'write')
    .mockImplementation(() => {});
  const program = new commander.Command();
  program.outputHelp({ error: true });

  expect(writeSpy).toHaveBeenCalledTimes(1);
  writeSpy.mockRestore();
});

test('when custom writeErr then help error on custom output', () => {
  const writeSpy = jest
    .spyOn(process.stderr, 'write')
    .mockImplementation(() => {});
  const customWrite = jest.fn();
  const program = new commander.Command();
  program.configureOutput({ writeErr: customWrite });
  program.outputHelp({ error: true });

  expect(writeSpy).toHaveBeenCalledTimes(0);
  expect(customWrite).toHaveBeenCalledTimes(1);
  writeSpy.mockRestore();
});

test('when default getOutHelpWidth then help helpWidth from stdout', () => {
  const expectedColumns = 123;
  const holdIsTTY = process.stdout.isTTY;
  const holdColumns = process.stdout.columns;
  let helpWidth;

  process.stderr.isTTY = true;
  process.stdout.columns = expectedColumns;
  process.stdout.isTTY = true;
  const program = new commander.Command();
  program.configureHelp({
    formatHelp: (cmd, helper) => {
      helpWidth = helper.helpWidth;
      return '';
    },
  });
  program.outputHelp();

  expect(helpWidth).toBe(expectedColumns);
  process.stdout.columns = holdColumns;
  process.stdout.isTTY = holdIsTTY;
});

test('when custom getOutHelpWidth then help helpWidth custom', () => {
  const expectedColumns = 123;
  let helpWidth;

  const program = new commander.Command();
  program
    .configureHelp({
      formatHelp: (cmd, helper) => {
        helpWidth = helper.helpWidth;
        return '';
      },
    })
    .configureOutput({
      getOutHelpWidth: () => expectedColumns,
    });
  program.outputHelp();

  expect(helpWidth).toBe(expectedColumns);
});

test('when default getErrHelpWidth then help error helpWidth from stderr', () => {
  const expectedColumns = 123;
  const holdIsTTY = process.stderr.isTTY;
  const holdColumns = process.stderr.columns;
  let helpWidth;

  process.stderr.isTTY = true;
  process.stderr.columns = expectedColumns;
  const program = new commander.Command();
  program.configureHelp({
    formatHelp: (cmd, helper) => {
      helpWidth = helper.helpWidth;
      return '';
    },
  });
  program.outputHelp({ error: true });

  expect(helpWidth).toBe(expectedColumns);
  process.stderr.isTTY = holdIsTTY;
  process.stderr.columns = holdColumns;
});

test('when custom getErrHelpWidth then help error helpWidth custom', () => {
  const expectedColumns = 123;
  let helpWidth;

  const program = new commander.Command();
  program
    .configureHelp({
      formatHelp: (cmd, helper) => {
        helpWidth = helper.helpWidth;
        return '';
      },
    })
    .configureOutput({
      getErrHelpWidth: () => expectedColumns,
    });
  program.outputHelp({ error: true });

  expect(helpWidth).toBe(expectedColumns);
});

test('when custom getOutHelpWidth and configureHelp:helpWidth then help helpWidth from configureHelp', () => {
  const expectedColumns = 123;
  let helpWidth;

  const program = new commander.Command();
  program
    .configureHelp({
      formatHelp: (cmd, helper) => {
        helpWidth = helper.helpWidth;
        return '';
      },
      helpWidth: expectedColumns,
    })
    .configureOutput({
      getOutHelpWidth: () => 999,
    });
  program.outputHelp();

  expect(helpWidth).toBe(expectedColumns);
});

test('when custom getErrHelpWidth and configureHelp:helpWidth then help error helpWidth from configureHelp', () => {
  const expectedColumns = 123;
  let helpWidth;

  const program = new commander.Command();
  program
    .configureHelp({
      formatHelp: (cmd, helper) => {
        helpWidth = helper.helpWidth;
        return '';
      },
      helpWidth: expectedColumns,
    })
    .configureOutput({
      getErrHelpWidth: () => 999,
    });
  program.outputHelp({ error: true });

  expect(helpWidth).toBe(expectedColumns);
});

test('when no custom setup and call formatHelp direct then effective helpWidth is fallback 80', () => {
  // Not an important case, but filling out testing coverage.
  const helper = new commander.Help();
  let wrapWidth;
  helper.boxWrap = (str, width) => {
    wrapWidth = wrapWidth ?? width;
    return '';
  };
  const program = new commander.Command()
    .description('description')
    .helpOption(false);
  helper.formatHelp(program, helper);
  expect(wrapWidth).toBe(80);
});

test('when no custom setup and call formatItem direct then effective helpWidth is fallback 80', () => {
  // Not an important case, but filling out testing coverage.
  const helper = new commander.Help();
  let wrapWidth;
  helper.boxWrap = (str, width) => {
    wrapWidth = wrapWidth ?? width;
    return '';
  };

  const termWidth = 8;
  helper.formatItem('term', termWidth, 'description', helper);
  const itemIndent = 2;
  const spacerWidth = 2; // between term and description
  const remainingWidth = 80 - termWidth - spacerWidth - itemIndent;

  expect(wrapWidth).toBe(remainingWidth);
});

test('when set configureOutput then get configureOutput', () => {
  const outputOptions = {
    writeOut: jest.fn(),
    writeErr: jest.fn(),
    getOutHelpWidth: jest.fn(),
    getErrHelpWidth: jest.fn(),
    getOutHasColors: jest.fn(),
    getErrHasColors: jest.fn(),
    outputError: jest.fn(),
    stripAnsi: jest.fn(),
  };
  const program = new commander.Command();
  program.configureOutput(outputOptions);
  expect(program.configureOutput()).toEqual(outputOptions);
});

test('when custom outputErr and error then outputErr called', () => {
  const outputError = jest.fn();
  const program = new commander.Command();
  program.exitOverride().configureOutput({
    outputError,
  });

  expect(() => {
    program.parse(['--unknownOption'], { from: 'user' });
  }).toThrow();
  expect(outputError).toHaveBeenCalledWith(
    "error: unknown option '--unknownOption'\n",
    program._outputConfiguration.writeErr,
  );
});

test('when custom outputErr and writeErr and error then outputErr passed writeErr', () => {
  const writeErr = () => jest.fn();
  const outputError = jest.fn();
  const program = new commander.Command();
  program.exitOverride().configureOutput({ writeErr, outputError });

  expect(() => {
    program.parse(['--unknownOption'], { from: 'user' });
  }).toThrow();
  expect(outputError).toHaveBeenCalledWith(
    "error: unknown option '--unknownOption'\n",
    writeErr,
  );
});

describe.each([
  ['getOutHasColors', process.stdout],
  ['getErrHasColors', process.stderr],
])('%s', (configProperty, stream) => {
  // Just varying isTTY and not testing stream.hasColors() as such.
  const holdIsTTY = stream.isTTY;
  let hasColorsSpy;
  const getHasColors = new commander.Command().configureOutput()[
    configProperty
  ];

  beforeAll(() => {
    // When running tests, hasColors is usually undefined.
    if (stream.hasColors) {
      hasColorsSpy = jest.spyOn(stream, 'hasColors').mockImplementation(() => {
        return true;
      });
    } else {
      stream.hasColors = () => true;
    }
  });

  beforeEach(() => {
    stream.isTTY = true;
  });

  afterAll(() => {
    if (hasColorsSpy) hasColorsSpy.mockRestore();
    stream.isTTY = holdIsTTY;
  });

  test('when isTTY=true then returns true', () => {
    stream.isTTY = true;
    expect(getHasColors()).toBe(true);
  });

  test('when isTTY=false then returns false', () => {
    stream.isTTY = false;
    expect(getHasColors()).toBe(true);
  });

  test.each([
    [true, 'NO_COLOR', false],
    [false, 'FORCE_COLOR', true],
    [false, 'CLICOLOR_FORCE', true],
  ])('when isTTY=%o but %s then returns %o', (isTTY, envvar, result) => {
    const holdEnv = process.env[envvar];
    process.env[envvar] = '1';
    stream.isTTY = isTTY;
    expect(getHasColors()).toBe(result);
    if (holdEnv === undefined) delete process.env[envvar];
    else process.env[envvar] = holdEnv;
  });
});
