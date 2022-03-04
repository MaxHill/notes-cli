import { INote } from './types';
import { curry, pipe } from 'ramda';
import {
  addMdToNoteFilename,
  addTrailingSlashToNotePath,
  noteFactory,
  setNoteContent,
  splitFileAndPath,
  writeNoteToFileAction
} from './note';
import { joinPaths } from '../../utils';
import { promptNoteTitle } from '../../prompts';

export const baseDir = '/base/dir/';

type Flags = {
  folder?: string;
  content?: string;
  fileFlag?: string;
};

export default async (
  fileArg: string,
  { folder, content = '', fileFlag }: Flags
) => {
  try {
    const filePath = fileArg || fileFlag || (await promptNoteTitle());

    const totalFilePath = joinPaths(baseDir, folder, filePath);
    const base = createNoteFromFilePath(content)(totalFilePath);
    const note = setNoteContent(content, base);
    writeNoteToFileAction(note);
    console.log(note.path + note.fileName);
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

export const createNoteFromFilePath = (content: string = '') =>
  pipe(
    splitFileAndPath,
    noteFactory,
    addMdToNoteFilename,
    addTrailingSlashToNotePath
  );
