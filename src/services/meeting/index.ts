import { format } from 'date-fns/fp';
import {
  complement,
  filter,
  has,
  ifElse,
  isEmpty,
  join,
  length,
  lensIndex,
  map,
  mapObjIndexed,
  omit,
  pick,
  pipe,
  reduce,
  set,
  split,
  trim,
  values,
  view
} from 'ramda';
import { IMeeting } from '../../types';
import {
  appendIfNotExist,
  indentationAmount,
  prependIfNotExist,
  runCommand,
  splitOnNewLine
} from '../../utils';
import { addMdExtenssion } from '../note';

type GenericObject = { [key: string]: string };

export const getListOfMeetings = (): IMeeting[] => {
  const bulletIndicator = '3b95a551-26f9-4bc0-bfbc-33b1ecb8155f';
  const icalBuddyString = runCommand('icalBuddy', [
    '-b',
    bulletIndicator,
    '-ea',
    'eventsNow'
  ]);

  /**
   * Transform icalBuddy string to meeting object
   */
  const parseToMeetingObject = pipe(
    trim,
    splitOnNewLine,
    lineToObjectReducer,
    reduce((result, obj: Object) => ({ ...result, ...obj }), {})
  );

  return pipe(
    split(bulletIndicator),
    filter(complement(isEmpty)),
    map(parseToMeetingObject)
  )(icalBuddyString);
};

export const createMeetingFilename = (meeting) => {
  const date = format('yyyy-MM-dd')(new Date());
  const time = meeting.time || '';

  const formatTitle = pipe(
    split(' '),
    filter((c) => c !== '-'),
    join('-'),
    prependIfNotExist(`${date}-${time}-`),
    addMdExtenssion
  );
  return formatTitle(meeting.title);
};

export const formatMeetingContent = (
  meeting: IMeeting,
  content = '<!--- Note content --->'
) => {
  const toString = pipe(
    mapObjIndexed((key, val) => `${val}: ${key}`),
    values,
    join('\n')
  );

  const body = pipe(
    omit(['notes']),
    toString,
    prependIfNotExist('---\n'),
    appendIfNotExist('\n---'),
    appendIfNotExist('\n\n' + content)
  ) as (obj: IMeeting) => string;

  if (!meeting.notes) return body(meeting);

  const footer = pipe(
    pick(['notes']),
    toString,
    prependIfNotExist('\n\n---\n')
  );
  return body(meeting) + footer(meeting);
};

/**
 * Parse line to array of objects based on indentation
 */
const lineToObjectReducer = reduce(
  (acc: GenericObject[], line: string): GenericObject[] => {
    const indentLevel = indentationAmount(line) / 4;

    switch (indentLevel) {
      case 0:
        return [...acc, { title: line.trim() }];
      case 1:
        return (
          matchKeyVal(acc, line) ||
          matchTime(acc, line) ||
          addStringToLastObject(acc, line) ||
          acc
        );
      default:
        return addStringToLastObject(acc, line) || acc;
    }
  },
  []
);

/**
 * Match a key value pair
 * ex. location: place
 */
const matchKeyVal = (
  acc: GenericObject[],
  line: string
): GenericObject[] | false => {
  const rMatchKeyVal = /^([a-zA-Z]+):(.+)/g;
  const [, key, val] = rMatchKeyVal.exec(line.trim()) || [];

  if (key && val) return [...acc, { [key]: val.trim() }];

  return false;
};

/**
 * Match for start & end time
 * ex. 09:00-09:30
 */
const matchTime = (
  acc: GenericObject[],
  line: string
): GenericObject[] | false => {
  const rMatchTime = /^([0-9]+:[0-9]+).-.([0-9]+:[0-9]+)/g;
  const [, start, end] = rMatchTime.exec(line.trim()) || [];

  if (start && end) {
    return [...acc, { time: `${start}-${end}` }];
  }
  return false;
};

/**
 * Add string to last object in the array
 */
const addStringToLastObject = (
  acc: GenericObject[],
  line: string
): GenericObject[] | false => {
  if (line.length < 1) return false;
  const updateValue = (val: string) => val + '\n' + line.trim();
  const lastLens = lensIndex<GenericObject>(-1);

  const lastObjInArray = view<GenericObject[], GenericObject>(lastLens, acc);
  const newVal = mapObjIndexed(updateValue, lastObjInArray);
  return set<GenericObject[], GenericObject>(lastLens, newVal, acc);
};
