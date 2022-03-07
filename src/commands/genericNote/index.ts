import { pipe } from 'ramda';
import {
  createNoteObjFromFilePath,
  setNoteContent,
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
  filename: string,
  { folder, content = '', fileFlag }: Flags
) => {
  try {
    const filePath = filename || fileFlag || (await promptNoteTitle());
    const totalFilePath = joinPaths(baseDir, folder, filePath);

    const createNote = pipe(
      createNoteObjFromFilePath,
      setNoteContent(content),
      writeNoteToFileAction,
      (n) => console.log(n.path + n.fileName)
    );

    createNote(totalFilePath);
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};
