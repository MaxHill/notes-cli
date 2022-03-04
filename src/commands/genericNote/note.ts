import * as fs from 'fs';
import { INote } from './types';
import {
  lensProp,
  over,
  mergeRight,
  split,
  join,
  last,
  init,
  set,
  curry
} from 'ramda';
import { appendIfNotExist } from '../../utils';

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
  const filePath = note.path + note.fileName;
  if (fs.existsSync(filePath)) return note;

  fs.mkdirSync(note.path, { recursive: true });
  fs.writeFileSync(filePath, note.content);
  return note;
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
 * Returns a noteFactory with specific content
 */
export const noteFactoryWithContent = (content: string) =>
  mergeRight<INote>(noteFactory({ content })) as (n: Partial<INote>) => INote;
