import arg from 'arg';
import { interactive } from './interactive';
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
    console.error(chalk.yellow.dim`Pattern: ` + chalk.cyan(result.pattern));
    console.error(
      chalk.yellow.dim`Matched: ` + chalk.cyan(result.files.length)
    );

    if (result.files.length > 0) {
      const separatorLength = Math.min(
        11 +
          Math.max(
            result.pattern.length,
            result.files.length.toString().length
          ),
        process.stderr.columns
      );

      const separator = new Array(separatorLength).fill('-').join('');

      console.error(chalk.yellow.dim(separator));
    }

    for (const file of result.files) {
      console.log(file);
    }
  })
  .catch((error) => {
    if (error === 'abort') {
      process.exit(1);
    }

    throw error;
  });
