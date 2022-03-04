import genericNote, { baseDir } from '.';
import { writeNoteToFileAction } from './note';
import { promptNoteTitle } from '../../prompts';

jest.mock('./note', () => ({
  ...jest.requireActual('./note'),
  writeNoteToFileAction: jest.fn()
}));

jest.mock('../../prompts', () => ({
  ...jest.requireActual('../../prompts'),
  promptNoteTitle: () => Promise.resolve('test-prompted-note')
}));

const processExit = jest.spyOn(process, 'exit').mockImplementation();
//const consoleLog = jest.spyOn(console, 'log').mockImplementation();

describe('genericNote', () => {
  beforeEach(() => jest.resetAllMocks());

  it('Can create Note from file path', () => {
    genericNote('path/to/file', {});
    expect(writeNoteToFileAction).toHaveBeenCalledWith({
      fileName: 'file.md',
      path: baseDir + 'path/to/',
      content: ''
    });
  });

  it.only('Can add content to the note', () => {
    genericNote('path/to/file', { content: 'test-content' });
    expect(writeNoteToFileAction).toHaveBeenCalledWith(
      expect.objectContaining({
        content: 'test-content'
      })
    );
  });

  it('Can specify a folder in baseDir', () => {
    genericNote('path/to/file', { folder: 'test-folder' });
    expect(writeNoteToFileAction).toHaveBeenCalledWith(
      expect.objectContaining({
        path: baseDir + 'test-folder/path/to/'
      })
    );
  });

  it('Accepts filePath as a flag aswell', () => {
    genericNote('', { fileFlag: 'test-file' });
    expect(writeNoteToFileAction).toHaveBeenCalledWith(
      expect.objectContaining({
        fileName: 'test-file.md'
      })
    );
  });

  it('Outputs the created file', () => {
    genericNote('test-file', {});
    expect(consoleLog).toHaveBeenCalledWith(baseDir + 'test-file.md');
  });

  it('Exits with 0 code if successfull', () => {
    genericNote('test-file', {});
    expect(processExit).toHaveBeenCalledWith(0);
  });

  it.skip('Exits with 1 code if not successfull', () => {
    // Don't know how to force an error
    const consoleError = jest.spyOn(console, 'error').mockImplementation();

    genericNote('', {});

    expect(processExit).toHaveBeenCalledWith(1);
    expect(consoleError).toHaveBeenCalledWith(new Error('Specify a filename'));
  });

  it('Prompts for note name if not specified', async () => {
    await genericNote('', {});
    expect(consoleLog).toHaveBeenCalledWith(baseDir + 'test-prompted-note.md');
  });
});
