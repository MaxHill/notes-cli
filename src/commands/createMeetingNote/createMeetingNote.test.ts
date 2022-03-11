import {
  promptSelectMeetingFromList,
  promptSetMeetingTitleManually
} from '../../prompts';
import {
  formatMeetingContent,
  getListOfMeetings
} from '../../services/meeting';
import createNote from '../createNote';
import createMeetingNote from './';

jest.mock('../../services/meeting', () => ({
  ...jest.requireActual('../../services/meeting'),
  getListOfMeetings: jest.fn()
}));

jest.mock('../../prompts', () => ({
  promptSelectMeetingFromList: jest.fn(),
  promptSetMeetingTitleManually: jest.fn()
}));

jest.mock('../createNote', () => jest.fn());

jest.useFakeTimers().setSystemTime(new Date('2022-01-01:16:00').getTime());

describe('createMeetingNote', () => {
  beforeEach(() => {
    jest.resetAllMocks();

    (promptSelectMeetingFromList as jest.Mock).mockImplementation((m) => m[0]);
    (promptSetMeetingTitleManually as jest.Mock).mockReturnValue(
      'Test meeting'
    );
  });

  it('Should create a meeting note', async () => {
    (getListOfMeetings as jest.Mock).mockReturnValue([
      { title: 'Meeting 1', time: '09:00' }
    ]);

    await createMeetingNote({});

    expect(createNote).toHaveBeenCalledWith('', {
      content: `---
title: Meeting 1
time: 09:00
---

<!--- Note content --->`,
      fileFlag: '2022-01-01-09:00-Meeting-1.md',
      folder: ''
    });
  });

  it('Should create prompt to select a meeting if multiple', async () => {
    const meetings = [
      { title: 'Meeting 1', time: '09:00' },
      { title: 'Meeting 2', time: '16:00-17:00' }
    ];
    (getListOfMeetings as jest.Mock).mockReturnValue(meetings);

    await createMeetingNote({});

    expect(createNote).toHaveBeenCalledWith('', {
      content: formatMeetingContent(meetings[0]),
      fileFlag: '2022-01-01-09:00-Meeting-1.md',
      folder: ''
    });
  });

  it('Should create prompt to create a meeting title if no meetings are found', async () => {
    (getListOfMeetings as jest.Mock).mockReturnValue([]);

    await createMeetingNote({});

    expect(createNote).toHaveBeenCalledWith('', {
      content: formatMeetingContent({ title: 'Test meeting', time: '16:00' }),
      fileFlag: '2022-01-01-16:00-Test-meeting.md',
      folder: ''
    });
  });

  it('Should be possible to specify folder', async () => {
    const meeting = [{ title: 'Meeting 1', time: '09:00' }];
    (getListOfMeetings as jest.Mock).mockReturnValue(meeting);

    await createMeetingNote({ folder: 'path/to/folder' });

    expect(createNote).toHaveBeenCalledWith('', {
      content: formatMeetingContent(meeting[0]),
      fileFlag: '2022-01-01-09:00-Meeting-1.md',
      folder: 'path/to/folder'
    });
  });
});
