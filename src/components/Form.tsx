import React, { useEffect, useRef, useState } from 'react';
import { useInput } from 'ink';
import { Box, Text } from 'ink';

type State = {
  inputValue: string;
  cursorOffset: number;
};

type InputDescriptor = {
  placeholder?: string;
  label?: string;
  initialValue?: string;
  validationError?: string | null;
  onChange: (newInput?: string) => void;
};

export const Form = ({
  input: inputDescriptor,
  onExit,
  onSubmit,
}: {
  input: InputDescriptor;
  onExit: () => void;
  onSubmit: (state: State) => void;
}) => {
  const initialInput = inputDescriptor.initialValue ?? '';

  const [state, setState] = useState<State>({
    inputValue: initialInput,
    cursorOffset: initialInput.length,
  });

  const { inputValue, cursorOffset } = state;

  useInput((input, key) => {
    if (key.escape || (key.ctrl && (input === 'c' || input === 'd'))) {
      onExit();
      return;
    } else if (key.ctrl && input === 'u') {
      setState({
        ...state,
        inputValue: '',
        cursorOffset: 0,
      });
    } else if (key.ctrl && input === 'a') {
      setState({ ...state, cursorOffset: 0 });
    } else if (key.ctrl && input === 'e') {
      setState({ ...state, cursorOffset: input.length });
    } else if (key.leftArrow) {
      if (cursorOffset > 0) {
        setState({ ...state, cursorOffset: cursorOffset - 1 });
      }
    } else if (key.rightArrow) {
      if (cursorOffset < input.length) {
        setState({ ...state, cursorOffset: cursorOffset + 1 });
      }
    } else if (key.return) {
      onSubmit(state);
      return;
    } else {
      if (key.delete || key.backspace) {
        if (cursorOffset > 0) {
          const newInputValue =
            inputValue.slice(0, cursorOffset - 1) +
            inputValue.slice(cursorOffset);

          setState({
            ...state,
            cursorOffset: cursorOffset - 1,
            inputValue: newInputValue,
          });
        }
      } else if (key.downArrow || key.upArrow) {
        // We don't want those keys to print [B[A to the screen
        return;
      } else {
        const newInputValue =
          inputValue.slice(0, cursorOffset) +
          input +
          inputValue.slice(cursorOffset);

        setState({
          ...state,
          cursorOffset: cursorOffset + input.length,
          inputValue: newInputValue,
        });
      }
    }
  });

  const {
    placeholder,
    initialValue,
    onChange,
    label,
    validationError,
  } = inputDescriptor;
  return (
    <Box flexDirection="column">
      <Input
        placeholder={placeholder}
        initialValue={initialValue}
        onChange={onChange}
        label={label}
        validationError={validationError}
        active={true}
        value={inputValue}
        cursorOffset={cursorOffset}
      />
    </Box>
  );
};

export const Input = ({
  placeholder,
  active,
  value,
  validationError,
  onChange,
  cursorOffset,
  label,
}: {
  placeholder?: string;
  active?: boolean;
  value?: string;
  initialValue?: string;
  onChange: (newInput?: string) => void;
  cursorOffset: number;
  validationError?: string | null;
  label?: string;
}) => {
  const notInitialRender = useRef(false);

  // We don't want to call onChange on first render
  // This prevents re-renders on initial load
  useEffect(() => {
    if (notInitialRender.current) {
      onChange(value);
    } else {
      notInitialRender.current = true;
    }
  }, [value]);

  const textWithCursor = (text?: string) => {
    if (!text) {
      return <Text inverse> </Text>;
    }

    if (cursorOffset === text.length) {
      return (
        <Text>
          {text}
          <Text inverse> </Text>
        </Text>
      );
    }

    return (
      <>
        <Text>{text.substr(0, cursorOffset)}</Text>
        <Text inverse>{text.substr(cursorOffset, 1)}</Text>
        <Text>{text.substr(cursorOffset + 1)}</Text>
      </>
    );
  };

  return (
    <Text>
      <Text color="blue" dimColor={!active}>
        {label}
      </Text>
      {<Text dimColor={!active}>{'|'}</Text>}
      {!value && placeholder ? (
        <Text color="dim">
          {active ? textWithCursor(placeholder) : placeholder}
        </Text>
      ) : (
        <Text>
          {active ? textWithCursor(value) : value}
          <Text color="red"> {validationError}</Text>
        </Text>
      )}
    </Text>
  );
};
