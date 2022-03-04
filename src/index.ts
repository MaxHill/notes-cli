#!/usr/bin/env node
import { program } from 'commander';
import genericNote from './commands/genericNote';

program
  .command('new [filename]')
  .description('Create a new note')
  .option('-f, --folder <folder>', 'Sub folder of basedir notes directory', '')
  .option('-c, --content <content>', `Text to be added to file`, '')
  .action(genericNote);
