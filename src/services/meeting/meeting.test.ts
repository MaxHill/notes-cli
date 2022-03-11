import {
  createMeetingFilename,
  formatMeetingContent,
  getListOfMeetings
} from '.';
import { runCommand } from '../../utils';
import { testMeeting, testTeamsMeeting, testTwoMeetings } from './testData';

jest.mock('../../utils', () => ({
  ...jest.requireActual('../../utils'),
  runCommand: jest.fn().mockReturnValue('')
}));

jest.useFakeTimers().setSystemTime(new Date('2022-01-01:16:00').getTime());

describe('Meeting', () => {
  describe('getListOfMeetings()', () => {
    it('Calls icalBuddy to get events now', () => {
      getListOfMeetings();
      expect(runCommand).toHaveBeenCalledWith('icalBuddy', [
        '-b',
        '3b95a551-26f9-4bc0-bfbc-33b1ecb8155f',
        '-ea',
        'eventsNow'
      ]);
    });

    it('Returns an empty array if there is no meetings', () => {
      expect(getListOfMeetings()).toEqual([]);
    });

    it('Can parse a meeting', () => {
      (runCommand as jest.Mock).mockReturnValue(testMeeting);
      expect(getListOfMeetings()).toEqual([
        {
          time: '08:45-09:45',
          title: 'Test meeting 2 (Calendar)',
          location: 'Lupinvagen\nKungsbacka, Sweden',
          attendees: 'Max Hill, Max Hill',
          notes: 'This is a test meeting made only to test stuff'
        }
      ]);
    });

    it.skip('Returns an array of meetings', () => {
      (runCommand as jest.Mock).mockReturnValue(testMeeting);
      expect(getListOfMeetings()).toEqual([
        {
          time: '08:45-09:45',
          title: 'Test meeting 2 (Calendar)',
          location: 'Lupinvagen\nKungsbacka, Sweden',
          attendees: 'Max Hill, Max Hill',
          notes: 'This is a test meeting made only to test stuff'
        }
      ]);
    });

    it('Can parse two meetings', () => {
      (runCommand as jest.Mock).mockReturnValue(testTwoMeetings);
      expect(getListOfMeetings()).toEqual([
        {
          title: 'Test meeting 1 (Calendar)',
          time: '08:45-09:45'
        },
        {
          time: '08:45-09:45',
          title: 'Test meeting 2 (Calendar)',
          location: 'Lupinvagen\nKungsbacka, Sweden',
          attendees: 'Max Hill, Max Hill',
          notes: 'This is a test meeting made only to test stuff'
        }
      ]);
    });

    it('Can parse a teams meeting', () => {
      (runCommand as jest.Mock).mockReturnValue(testTeamsMeeting);
      expect(getListOfMeetings()).toEqual([
        {
          time: '09:00-09:15',
          title: 'COO standup (Calendar)',
          attendees: 'Doe, John, Doe, Jane, #Apollo11',
          notes: `Daily standup, important that we keep this short and effective, 15min is the max time ideally we can do this faster.
________________________________________________________________________________
Microsoft Teams meeting
Join on your computer or mobile app
Click here to join the meeting<https://teams.microsoft.com/l/meetup-join/19%3ameeting_MDc0NzcwMmEtZWU4OS00MGFmLWE2MjMtZGU3YzU1ODM0ZTlh%40thread.v2/0?context=%7b%22Tid%22%3a%22fa74eeb7-373a-4c5b-8c97-4d330cfa9f60%22%2c%22Oid%22%3a%229a44ce02-b057-4eab-bc8e-e754672d7210%22%7d>
Learn More<https://aka.ms/JoinTeamsMeeting> | Meeting options<https://teams.microsoft.com/meetingOptions/?organizerId=9a44ce02-b057-4eab-bc8e-e754672d7210&tenantId=fa74eeb7-373a-4c5b-8c97-4d330cfa9f60&threadId=19_meeting_MDc0NzcwMmEtZWU4OS00MGFmLWE2MjMtZGU3YzU1ODM0ZTlh@thread.v2&messageId=0&language=en-US>
________________________________________________________________________________`
        }
      ]);
    });
  });

  describe('createMeetingFilename', () => {
    it('Should format the meeting filename correctly', () => {
      expect(
        createMeetingFilename({
          title: 'Test meeting',
          time: '09:30'
        })
      ).toEqual('2022-01-01-09:30-Test-meeting.md');
    });
  });

  describe('formatMeetingContent', () => {
    it('Should format the meeting content correctly', () => {
      expect(
        formatMeetingContent({
          title: 'Test meeting',
          time: '09:30',
          notes: 'This is a note'
        })
      ).toEqual(`---
title: Test meeting
time: 09:30
---

<!--- Note content --->

---
notes: This is a note`);
    });

    it('Should format the meeting content correctly if no notes exist', () => {
      expect(
        formatMeetingContent({
          title: 'Test meeting',
          time: '09:30'
        })
      ).toEqual(`---
title: Test meeting
time: 09:30
---

<!--- Note content --->`);
    });
  });
});
