import inquirer from 'inquirer';
const prompt = inquirer.createPromptModule({ output: process.stderr }); // To not have prompt output part of stdout that could be piped to other programs

export const promptNoteTitle = async () =>
  await prompt([
    {
      type: 'input',
      name: 'title',
      message: 'Meeting title?',
      validate(value) {
        const valid = !isNaN(value.length);
        return valid || 'Please enter a note title';
      }
    }
  ]);
