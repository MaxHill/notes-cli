import { format } from 'date-fns/fp';
import { andThen, pipe } from 'ramda';
import {
  promptSelectMeetingFromList,
  promptSetMeetingTitleManually
} from '../../prompts';
import {
  createMeetingFilename,
  formatMeetingContent,
  getListOfMeetings
} from '../../services/meeting';
import { IMeeting } from '../../types';
import createNote from '../createNote';

type Flags = {
  folder?: string;
  content?: string;
};

export default async ({ folder = '', content }: Flags) => {
  const flagsFromMeeting = (meeting: IMeeting) => ({
    content: formatMeetingContent(meeting, content),
    fileFlag: createMeetingFilename(meeting),
    folder: folder
  });

  const flags = pipe(
    getListOfMeetings,
    selectMeeting,
    andThen(flagsFromMeeting)
  );

  createNote('', await flags());
};

const selectMeeting = async (meetings: IMeeting[]) => {
  if (meetings.length > 1) {
    return await promptSelectMeetingFromList(meetings);
  } else if (meetings.length < 1) {
    return {
      title: await promptSetMeetingTitleManually(),
      time: format('HH:mm')(new Date())
    };
  } else {
    return meetings[0];
  }
};
