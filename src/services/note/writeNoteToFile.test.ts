import { writeFileSync, mkdirSync } from 'fs';
import os from 'os';
import { writeNoteToFileAction } from '.';

jest.mock('fs', () => ({
  existsSync: jest.fn(),
  mkdirSync: jest.fn(),
  writeFileSync: jest.fn()
}));

jest.mock('os', () => ({
  homedir: jest.fn()
}));

describe('createNoteObjFromFilePath', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('Can create a note from a file path', () => {
    const note = {
      fileName: 'test',
      path: 'path/to/note/',
      content: 'test content'
    };
    writeNoteToFileAction(note);

    expect(writeFileSync).toHaveBeenCalledWith(
      'path/to/note/test',
      'test content'
    );
  });

  it('Replaces ~ with homeDir', () => {
    (os.homedir as jest.Mock).mockReturnValue('/Users/test');
    const note = {
      fileName: 'test',
      path: '~/path/to/note/',
      content: ''
    };

    writeNoteToFileAction(note);

    expect(writeFileSync).toHaveBeenCalledWith(
      '/Users/test/path/to/note/test',
      ''
    );
  });

  it('Creates the correct path', () => {
    (os.homedir as jest.Mock).mockReturnValue('/Users/test');
    const note = {
      fileName: 'test',
      path: '~/path/to/note/',
      content: ''
    };

    writeNoteToFileAction(note);

    expect(mkdirSync).toHaveBeenCalledWith('/Users/test/path/to/note/', {
      recursive: true
    });
  });
});
