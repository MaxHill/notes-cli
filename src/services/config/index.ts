import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { joinPaths, runCommand } from '../../utils';
import YAML from 'yaml';
import { promptCreateConfig } from '../../prompts';
const basedir = require('xdg').basedir;

const configPath = basedir.configPath('notes-cli');
const configFile = joinPaths(configPath, 'config.yml');

export const getConfig = () => {
  if (!existsSync(configFile)) throw new Error('No config file exits');
  const content = runCommand('cat', [configFile]);

  return YAML.parse(content);
};

export const createConfig = async () => {
  const config = await promptCreateConfig();

  try {
    mkdirSync(configPath, { recursive: true });
    writeFileSync(configFile, YAML.stringify(config));
    return config;
  } catch (error) {
    throw new Error('Could not create config file: ' + configFile);
  }
};

export const getOrCreateConfig = async () => {
  try {
    return getConfig();
  } catch {
    return await createConfig();
  }
};
