import globby from 'globby';

export type Pattern = string | readonly string[];

export const getFiles = async ({
  pattern,
  gitignore,
}: {
  pattern: Pattern;
  gitignore?: boolean;
}) => {
  return globby(pattern, {
    cwd: process.cwd(),
    gitignore,
    caseSensitiveMatch: true,
    ignore: ['**/node_modules/**', '**/.git/**'],
    dot: true,
  });
};
