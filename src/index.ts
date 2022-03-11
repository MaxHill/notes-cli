#!/usr/bin/env node
import { program } from 'commander';
import createMeetingNote from './commands/createMeetingNote';
import creataNote from './commands/createNote';

program
  .command('new [filename]')
  .description('Create a new note')
  .option('-f, --folder <folder>', 'Sub folder of notes directory', '')
  .option('-c, --content <content>', `Text to be added to file`, '')
  .option(
    '-fi, --fileName <fileFlag>',
    `Alternative way of specifying fileName`,
    ''
  )
  .action(creataNote);

program
  .command('meeting-note')
  .description('Create a new meeting note')
  .option('-f, --folder <folder>', 'Sub folder of notes directory', '')
  .option('-c, --content <content>', `Text to be added to file`, '')
  .action(createMeetingNote);

program.parse(); // Run program
