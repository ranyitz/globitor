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
}: {
  initialPattern?: string;
}): Promise<{ pattern: string; files: string[] }> => {
  const allFiles = await memoizedGetFiles(DEFAULT_PATTERN);

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

      const updateFiles = (p: string | undefined) => {
        if (!p) p = DEFAULT_PATTERN;

        memoizedGetFiles(p)
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
