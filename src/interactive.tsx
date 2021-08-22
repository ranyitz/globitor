import React, { useEffect, useState } from 'react';
import { render, useApp } from 'ink';
import { getFiles } from './getFiles';
import { Monitor } from './components/Monitor';
import { Form } from './components/Form';
import { memoize } from './utils';

const DEFAULT_PATTERN = '**';
const memoizedGetFiles = memoize(getFiles);

type State = {
  files: Array<string>;
  patternError: string | null;
};

export const interactive = async ({
  initialPattern,
  gitignore,
}: {
  initialPattern?: string;
  gitignore?: boolean;
}): Promise<{ pattern: string; files: string[] }> => {
  const allFiles = await memoizedGetFiles({
    pattern: DEFAULT_PATTERN,
    gitignore,
  });

  return new Promise((resolve, reject) => {
    let clear: () => void;
    const App = () => {
      const { exit } = useApp();

      const [state, setState] = useState<State>({
        files: [],
        patternError: null,
      });

      const { files, patternError } = state;

      useEffect(() => {
        updateFiles(initialPattern);
      }, []);

      const updateFiles = (pattern: string | undefined) => {
        if (!pattern) pattern = DEFAULT_PATTERN;

        memoizedGetFiles({ pattern, gitignore })
          .then((f) => {
            setState({ ...state, patternError: null, files: f });
          })
          .catch((error) => {
            setState({ ...state, patternError: error.message, files: [] });
          });
      };

      return (
        <>
          <Form
            onExit={() => {
              clear();
              exit();
              reject('abort');
            }}
            onSubmit={({ inputValue }) => {
              clear();
              exit();
              resolve({ pattern: inputValue, files });
            }}
            input={{
              placeholder: '**',
              label: 'Pattern',
              initialValue: initialPattern,
              validationError: patternError,
              onChange: (newInput) => {
                updateFiles(newInput);
              },
            }}
          />
          <Monitor files={files} allFilesLength={allFiles.length} />
        </>
      );
    };

    const inkRenderApi = render(<App />, {
      exitOnCtrlC: false,
      stdout: process.stderr,
    });

    clear = inkRenderApi.clear;
  });
};
