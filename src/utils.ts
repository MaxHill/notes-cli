import { curry, join, pipe, replace } from 'ramda';

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
export const joinPaths = (...paths) => pipe(join('/'), removeRepeatedSlashes)(paths);
