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
    '--gitignore': Boolean,

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

      --gitignore         Include files ignored by patterns in '.gitignore'
`);

  process.exit(0);
}

const [pattern] = args._.slice(0, 1);
// negate the '--gitignore' CLI parameter, as this is how globby works (which *ignores* files from .gitignore if gitignore set to true)
// to make it easier on the user, by default we want to ignore the files in .gitignore and only if '--gitignore' is set they should be included
const gitignore = !args['--gitignore'];

interactive({
  initialPattern: pattern,
  gitignore,
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
