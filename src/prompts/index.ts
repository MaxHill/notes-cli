import inquirer from 'inquirer';
import { IMeeting } from '../types';
const prompt = inquirer.createPromptModule({ output: process.stderr }); // To not have prompt output part of stdout that could be piped to other programs

export const promptNoteTitle = async () =>
  await prompt([
    {
      type: 'input',
      name: 'title',
      message: 'Note title?',
      validate(value) {
        const valid = !isNaN(value.length);
        return valid || 'Please enter a note title';
      }
    }
  ]);

export const promptSelectMeetingFromList = async (meetings: IMeeting[]) =>
  await prompt([
    {
      type: 'list',
      name: 'meeting',
      message: 'For which meeting?',
      choices: meetings.map((m) => m.title)
    }
  ]).catch(console.error);

export const promptSetMeetingTitleManually = async () =>
  await prompt([
    {
      type: 'input',
      name: 'title',
      message: 'Meeting title?',
      validate(value) {
        const valid = !isNaN(value.length);
        return valid || 'Please enter a meeting title';
      }
    }
  ]).catch(console.error);
