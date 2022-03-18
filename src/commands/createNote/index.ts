import { pipe } from 'ramda';
import {
  createNoteObjFromFilePath,
  setNoteContent,
  writeNoteToFileAction
} from '../../services/note';
import { joinPaths } from '../../utils';
import { promptNoteTitle } from '../../prompts';
import { getOrCreateConfig } from '../../services/config';

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
    const { baseDir } = await getOrCreateConfig();
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
