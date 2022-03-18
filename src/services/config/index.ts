import { writeFileSync, existsSync } from 'fs';
import { runCommand } from '../../utils';
import YAML from 'yaml';
import { promptCreateConfig } from '../../prompts';
const basedir = require('xdg').basedir;

const configFile = basedir.configPath('notes-cli/config.yml');

export const getConfig = () => {
  if (!existsSync(configFile)) throw new Error('No config file exits');
  const content = runCommand('cat', [configFile]);

  return YAML.parse(content);
};

export const createConfig = async () => {
  const config = await promptCreateConfig();

  try {
    writeFileSync(configFile, YAML.stringify(config));
    return config;
  } catch (error) {
    throw new Error('Could not create config file: ', configFile);
  }
};

export const getOrCreateConfig = async () => {
  try {
    return getConfig();
  } catch {
    return await createConfig();
  }
};
