import arg from 'arg';
import { interactive } from './interactive';
import clipboardy from 'clipboardy';
import chalk from 'chalk';

process.on('unhandledRejection', (error) => {
  throw error;
});

const args = arg(
  {
    // Types
    '--version': Boolean,
    '--help': Boolean,
    '--verbose': Boolean,
    '--silent': Boolean,

    // Aliases
    '-v': '--version',
    '-h': '--help',
  },
  {
    permissive: false,
  }
);

if (args['--version']) {
  console.log(require('../package.json').version);
  process.exit(0);
}

if (args['--help']) {
  console.log(`
    Usage
      > globitor [pattern]

    Interactive Mode
      > globitor

    Options
      --silent            Don't print matching files
      --version, -v       Version number
      --help, -h          Displays this message
`);

  process.exit(0);
}

const [pattern] = args._.slice(0, 1);

interactive({
  initialPattern: pattern,
})
  .then((result) => {
    result.pattern = result.pattern || '**';
    clipboardy.writeSync(result.pattern);
    console.error(`Pattern: ` + chalk.cyan(result.pattern));
    console.error(`Matched: ` + result.files.length);
    console.error(chalk.yellow.dim`Copied pattern to clipboard!`);

    if (!args['--silent']) {
      for (const file of result.files) {
        console.log(file);
      }
    }
  })
  .catch((error) => {
    if (error === 'abort') {
      process.exit(1);
    }

    throw error;
  });
