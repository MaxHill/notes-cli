import createNote, { baseDir } from '.';
import { writeNoteToFileAction } from '../../services/note';
import { promptNoteTitle } from '../../prompts';

jest.mock('../../services/note', () => ({
  ...jest.requireActual('../../services/note'),
  writeNoteToFileAction: jest.fn()
}));

jest.mock('../../prompts', () => ({
  ...jest.requireActual('../../prompts'),
  promptNoteTitle: jest.fn()
}));

const processExit = jest.spyOn(process, 'exit').mockImplementation();
const consoleLog = jest.spyOn(console, 'log').mockImplementation();

describe('genericNote', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    (promptNoteTitle as jest.Mock).mockImplementation(() =>
      Promise.resolve('test-prompted-note')
    );
    (writeNoteToFileAction as jest.Mock).mockImplementation((n) => n);
  });

  it('Can create Note from file path', () => {
    createNote('path/to/file', {});
    expect(writeNoteToFileAction).toHaveBeenCalledWith({
      fileName: 'file.md',
      path: baseDir + 'path/to/',
      content: ''
    });
  });

  it('Can add content to the note', () => {
    createNote('path/to/file', { content: 'test-content' });
    expect(writeNoteToFileAction).toHaveBeenCalledWith(
      expect.objectContaining({
        content: 'test-content'
      })
    );
  });

  it('Can specify a folder in baseDir', () => {
    createNote('path/to/file', { folder: 'test-folder' });
    expect(writeNoteToFileAction).toHaveBeenCalledWith(
      expect.objectContaining({
        path: baseDir + 'test-folder/path/to/'
      })
    );
  });

  it('Accepts filePath as a flag aswell', () => {
    createNote('', { fileFlag: 'test-file' });
    expect(writeNoteToFileAction).toHaveBeenCalledWith(
      expect.objectContaining({
        fileName: 'test-file.md'
      })
    );
  });

  it('Outputs the created file', () => {
    createNote('test-file', {});
    expect(consoleLog).toHaveBeenCalledWith(baseDir + 'test-file.md');
  });

  it('Exits with 0 code if successfull', () => {
    createNote('test-file', {});
    expect(processExit).toHaveBeenCalledWith(0);
  });

  it.skip('Exits with 1 code if not successfull', () => {
    // Don't know how to force an error
    const consoleError = jest.spyOn(console, 'error').mockImplementation();

    createNote('', {});

    expect(processExit).toHaveBeenCalledWith(1);
    expect(consoleError).toHaveBeenCalledWith(new Error('Specify a filename'));
  });

  it('Prompts for note name if not specified', async () => {
    await createNote('', {});
    expect(consoleLog).toHaveBeenCalledWith(baseDir + 'test-prompted-note.md');
  });
});
