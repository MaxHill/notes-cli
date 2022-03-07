import {
  addMdToNoteFilename,
  addTrailingSlashToNotePath,
  createNoteObjFromFilePath,
  setNoteContent,
  splitFileAndPath
} from './';
import { INote } from '../../types';

describe('Note', () => {
  describe('splitFileAndPath()', () => {
    it('can splitFileAndPath', () => {
      const res = splitFileAndPath('path/to/the/file.md');
      expect(res).toEqual({
        fileName: 'file.md',
        path: 'path/to/the'
      });
    });

    it('can splitFileAndPath without file extension', () => {
      const res = splitFileAndPath('path/to/the/file');
      expect(res).toEqual({
        fileName: 'file',
        path: 'path/to/the'
      });
    });
  });

  describe('addMdToNoteFilename()', () => {
    it('adds .md to filename', () => {
      const note: INote = {
        fileName: 'test',
        path: 'path/to/note/',
        content: ''
      };

      expect(addMdToNoteFilename(note)).toEqual({
        fileName: 'test.md',
        path: 'path/to/note/',
        content: ''
      });
    });
  });

  describe('addTrailingSlashToNotePath()', () => {
    it('adds / to end of path', () => {
      const note: INote = {
        fileName: 'test',
        path: 'path/to/note',
        content: ''
      };

      expect(addTrailingSlashToNotePath(note)).toEqual({
        fileName: 'test',
        path: 'path/to/note/',
        content: ''
      });
    });
  });

  describe('setContent', () => {
    it('Can set the content of a note', () => {
      const note = {
        fileName: 'test',
        path: 'path/to/note/',
        content: ''
      };
      expect(setNoteContent('test', note)).toEqual({
        fileName: 'test',
        path: 'path/to/note/',
        content: 'test'
      });
    });
  });

  describe('createNoteObjFromFilePath', () => {
    it('Can create a note from a file path', () => {
      expect(createNoteObjFromFilePath('path/to/note/test')).toEqual({
        fileName: 'test.md',
        path: 'path/to/note/',
        content: ''
      });
    });
  });
});
