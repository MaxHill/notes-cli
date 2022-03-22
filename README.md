# Notes-CLI
A set of simple cli commands to make it easier to use and create notes as .md files.

This is tested on **Mac only**

## Installation

```
yarn global add @maxhill/notes-cli
```
or
```
npm install -g @maxhill/notes-cli
```


Notes-cli uses [ical-buddy](https://formulae.brew.sh/formula/ical-buddy) to populate notes with meeting information.
You need to install it separately.
You can install it with [homebrew](https://brew.sh/):
```
brew install ical-buddy
```

And make sure it works:
```
icalBuddy eventsToday
```



## Usage

```
notes-cli new noteName
```

```
Usage: notes-cli [options] [command]

Options:
  -h, --help                display help for command

Commands:
  new [options] [filename]  Create a new note
  meeting-note [options]    Create a new meeting note
  help [command]            display help for command
```
