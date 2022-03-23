import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { INote } from '../../types';
import {
  lensProp,
  over,
  mergeRight,
  split,
  join,
  last,
  init,
  set,
  curry,
  pipe,
  startsWith,
  slice
} from 'ramda';
import { appendIfNotExist, joinPaths } from '../../utils';
import os from 'os';

/**
 * Create a note object with default values
 */
export const noteFactory = mergeRight<INote>({
  fileName: '',
  path: '',
  content: ''
}) as (n: Partial<INote>) => INote;

/**
 * Create a file based on a note object
 */
export const writeNoteToFileAction = (note: INote): INote => {
  const path = startsWith('~', note.path) ? setHomePath(note.path) : note.path;
  const filePath = joinPaths(path, note.fileName);

  if (existsSync(filePath)) return note;

  mkdirSync(path, { recursive: true });
  writeFileSync(filePath, note.content);

  return note;
};

/**
 * Replace ~ with the actual path to user directory. ex /Users/johndoe
 */
const setHomePath = (path: string): string => {
  const stripFirstChar = slice(1, Infinity);
  return joinPaths(os.homedir(), stripFirstChar(path));
};

/**
 * Split a file and a path into separate fileName and path
 */
export const splitFileAndPath = (filePath: string): Partial<INote> => {
  const pathStrSplit = split('/', filePath);
  return {
    fileName: last(pathStrSplit),
    path: join('/', init(pathStrSplit))
  };
};

export const addMdExtenssion = appendIfNotExist('.md') as (
  str: string
) => string;
export const addTrailingSlash = appendIfNotExist('/') as (
  str: string
) => string;

/**
 * On a note object, suffix the property fileName's value with .md if it does not exist
 */
export const addMdToNoteFilename = over(
  lensProp<INote>('fileName'),
  addMdExtenssion
);

/**
 * On a note object, suffix the property path's value with a trailing slash if it does not exist
 */
export const addTrailingSlashToNotePath = over(
  lensProp<INote>('path'),
  addTrailingSlash
);

/**
 * On a note object, suffix the property path's value with a trailing slash if it does not exist
 */
export const setNoteContent = curry(set(lensProp<INote>('content')));

/**
 * Create note a object from filepath
 */
export const createNoteObjFromFilePath = pipe(
  splitFileAndPath,
  noteFactory,
  addMdToNoteFilename,
  addTrailingSlashToNotePath
);
