import React, { useEffect, useRef, useState } from 'react';
import { Text } from 'ink';
import { useInput } from 'ink';

const confirmText = '- Press "Enter" to copy to clipboard';

export const Monitor = ({ files }: { files: Array<string> }) => {
  const maxMonitorHeight = process.stdout.rows - 7;
  const totalFiles = files.length;
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    // Change the offset to zero when the files change
    setOffset(0);
  }, [files]);

  useInput((input, key) => {
    if (key.downArrow) {
      if (offset < totalFiles - maxMonitorHeight) setOffset(offset + 1);
    } else if (key.upArrow) {
      if (offset > 0) setOffset(offset - 1);
    } else if (key.tab && key.shift) {
      if (offset > 0) setOffset(Math.max(0, offset - maxMonitorHeight));
    } else if (key.tab) {
      if (offset < totalFiles - maxMonitorHeight)
        setOffset(
          Math.min(totalFiles - maxMonitorHeight, offset + maxMonitorHeight)
        );
    }
  });

  const notInitialRender = useRef(false);

  // Prevent flickering on the no matched files
  // Warning (since we get the files after a few miliseconds)
  if (!notInitialRender.current) {
    notInitialRender.current = true;
    return <></>;
  }

  if (totalFiles === 0) {
    return (
      <>
        <Text dimColor color="yellow">
          no matched files for pattern
        </Text>
      </>
    );
  }

  return (
    <>
      <Text dimColor color="yellow">
        {0} / {totalFiles}
        <Text> {confirmText}</Text>
      </Text>
      {files
        .map((filePath, index) => {
          return (
            <Text key={filePath}>
              <Text dimColor italic>
                {index.toString().padEnd(4, ' ') + ' '}
              </Text>
              {filePath}
            </Text>
          );
        })
        .slice(offset, offset + maxMonitorHeight)}
    </>
  );
};
