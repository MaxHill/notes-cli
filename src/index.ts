#!/usr/bin/env node
import { program } from 'commander';
import creataNote from './commands/createNote';

program
  .command('new [filename]')
  .description('Create a new note')
  .option('-f, --folder <folder>', 'Sub folder of basedir notes directory', '')
  .option('-c, --content <content>', `Text to be added to file`, '')
  .option(
    '-fi, --fileName <fileFlag>',
    `Alternative way of specifying fileName`,
    ''
  )
  .action(creataNote);
