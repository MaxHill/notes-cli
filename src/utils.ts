import { curry, join, pipe, replace, split } from 'ramda';
import * as cp from 'child_process';

/**
 * Add suffix to a string
 */
export const appendIfNotExist = curry((suffix: string, str: string) => {
  if (!str.endsWith(suffix)) return str + suffix;
  return str;
});

export const prependIfNotExist = curry((prefix: string, str: string) => {
  if (!str.startsWith(prefix)) return prefix + str;
  return str;
});

const removeRepeatedSlashes = replace(/\/(\/*)\//g, '/');
export const joinPaths = (...paths: string[]) =>
  pipe(join('/'), removeRepeatedSlashes)(paths);

export const splitOnNewLine = split(/\r?\n/);
export const indentationAmount = (str: string) =>
  str.replace(/^(\s*).*$/, '$1').length;

/**
 * Run command in child_process and return the result synchronous
 * @param cmd
 * @param args
 * @param childProcess
 */
export const runCommand = (
  cmd: string,
  args: string[] = [],
  childProcess: typeof cp = cp
): string => {
  const process = childProcess.spawnSync(cmd, args, { stdio: 'pipe' });
  if (process.status) {
    throw new Error(process.stderr.toString());
  }
  return process.stdout?.toString() || '';
};
