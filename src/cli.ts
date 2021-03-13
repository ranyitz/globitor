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
    console.log(`Pattern: ` + chalk.cyan(result.pattern));
    console.log(`Matched: ` + result.files.length);
    console.log(chalk.yellow.dim`Copied pattern to clipboard!`);
  })
  .catch((error) => {
    if (error === 'abort') {
      process.exit(1);
    }

    throw error;
  });
