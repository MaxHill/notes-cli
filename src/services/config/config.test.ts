import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { createConfig, getConfig, getOrCreateConfig } from '.';
import { promptCreateConfig } from '../../prompts';
import { runCommand } from '../../utils';
const basedir = require('xdg').basedir;

jest.mock('../../utils', () => ({
  ...jest.requireActual('../../utils'),
  runCommand: jest.fn()
}));

jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  existsSync: jest.fn(),
  mkdirSync: jest.fn(),
  writeFileSync: jest.fn()
}));

jest.mock('../../prompts', () => ({ promptCreateConfig: jest.fn() }));

describe('Config', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    (runCommand as jest.Mock).mockReturnValue('baseDir: "get/config/path"');
    (existsSync as jest.Mock).mockReturnValue(true);
    (writeFileSync as jest.Mock).mockReturnValue(true);
    (promptCreateConfig as jest.Mock).mockReturnValue(
      Promise.resolve({
        baseDir: 'create/config/path'
      })
    );
  });

  it('Is possible to get config', () => {
    expect(getConfig()).toEqual(
      expect.objectContaining({
        baseDir: 'get/config/path'
      })
    );
  });

  it('Throws if no config exist', async () => {
    (existsSync as jest.Mock).mockReturnValue(false);
    await expect(async () => await getConfig()).rejects.toThrow();
  });

  it('Can create a config', async () => {
    await createConfig();
    expect(writeFileSync).toHaveBeenCalledWith(
      expect.stringContaining('/'),
      `baseDir: create/config/path
`
    );
  });

  it('Throws if it cannot create the config file', async () => {
    (writeFileSync as jest.Mock).mockImplementation(() => {
      throw new Error('Test error');
    });

    await expect(async () => await createConfig()).rejects.toThrowError(
      'Could not create config file: '
    );
  });

  it('returns the config when created', async () => {
    const config = await createConfig();
    expect(config).toEqual({
      baseDir: 'create/config/path'
    });
  });

  it('should be possible to either get of create the config ', async () => {
    expect(await getOrCreateConfig()).toEqual({
      baseDir: 'get/config/path'
    });

    (existsSync as jest.Mock).mockReturnValue(false);

    expect(await getOrCreateConfig()).toEqual({
      baseDir: 'create/config/path'
    });
  });

  it('Creates the correct path', async () => {
    const configPath = basedir.configPath('notes-cli');
    await createConfig();

    expect(mkdirSync).toHaveBeenCalledWith(configPath, {
      recursive: true
    });
  });
});
