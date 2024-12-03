"use client";
import * as React from "react";
import { useImperativeHandle } from "react";
import { cn } from "../lib/utils";

interface UseAutosizeTextAreaProps {
  textAreaRef: HTMLTextAreaElement | null;
  minHeight?: number;
  maxHeight?: number;
  triggerAutoSize: string;
}

export const useAutosizeTextArea = ({ textAreaRef, triggerAutoSize, maxHeight = Number.MAX_SAFE_INTEGER, minHeight = 0 }: UseAutosizeTextAreaProps) => {
  const [init, setInit] = React.useState(true);
  React.useEffect(() => {
    const offsetBorder = 2;
    if (textAreaRef) {
      if (init) {
        textAreaRef.style.minHeight = `${minHeight + offsetBorder}px`;
        if (maxHeight > minHeight) {
          textAreaRef.style.maxHeight = `${maxHeight}px`;
        }
        setInit(false);
      }
      textAreaRef.style.height = `${minHeight + offsetBorder}px`;
      const scrollHeight = textAreaRef.scrollHeight;
      if (scrollHeight > maxHeight) {
        textAreaRef.style.height = `${maxHeight}px`;
      } else {
        textAreaRef.style.height = `${scrollHeight + offsetBorder}px`;
      }
    }
  }, [textAreaRef, triggerAutoSize]);
};

export type AutosizeTextAreaRef = {
  textArea: HTMLTextAreaElement;
  maxHeight: number;
  minHeight: number;
};

type AutosizeTextAreaProps = {
  maxHeight?: number;
  minHeight?: number;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const AutosizeTextarea = React.forwardRef<AutosizeTextAreaRef, AutosizeTextAreaProps>(
  ({ maxHeight = Number.MAX_SAFE_INTEGER, minHeight = 40, className, onChange, onKeyDown, value, ...props }: AutosizeTextAreaProps, ref: React.Ref<AutosizeTextAreaRef>) => {
    const textAreaRef = React.useRef<HTMLTextAreaElement | null>(null);
    const [triggerAutoSize, setTriggerAutoSize] = React.useState("");
    const [history, setHistory] = React.useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = React.useState(-1);

    useAutosizeTextArea({
      textAreaRef: textAreaRef.current,
      triggerAutoSize: triggerAutoSize,
      maxHeight,
      minHeight
    });

    useImperativeHandle(ref, () => ({
      textArea: textAreaRef.current as HTMLTextAreaElement,
      focus: () => textAreaRef.current?.focus(),
      maxHeight,
      minHeight
    }));

    React.useEffect(() => {
      setTriggerAutoSize(value as string);
    }, [props?.defaultValue, value]);

    // Function to handle undo/redo history
    const updateHistory = (newValue: string) => {
      const updatedHistory = [...history.slice(0, historyIndex + 1), newValue];
      setHistory(updatedHistory);
      setHistoryIndex(updatedHistory.length - 1);
    };

    // Handle key down event (including undo/redo)
    function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
      const textArea = textAreaRef.current;

      // Ctrl + B: Wrap text with ** **.
      if (event.keyCode === 66 && event.ctrlKey) {
        event.preventDefault();
        if (textArea) {
          const selection = textArea.value.substring(textArea.selectionStart, textArea.selectionEnd);

          if (selection) {
            const beforeSelection = textArea.value.slice(0, textArea.selectionStart);
            const afterSelection = textArea.value.slice(textArea.selectionEnd);

            const updatedValue = `${beforeSelection}**${selection}**${afterSelection}`;
            textArea.value = updatedValue;
            setTriggerAutoSize(updatedValue);
            updateHistory(updatedValue);

            if (onChange) {
              const syntheticEvent = {
                target: { value: updatedValue }
              } as unknown as React.ChangeEvent<HTMLTextAreaElement>;
              onChange(syntheticEvent);
            }
          }
        }
      }

      // Ctrl + Z: Undo.
      if (event.keyCode === 90 && event.ctrlKey) {
        event.preventDefault();
        if (historyIndex > 0) {
          const previousValue = history[historyIndex - 1];
          setHistoryIndex(historyIndex - 1);
          if (textArea) {
            textArea.value = previousValue;
            setTriggerAutoSize(previousValue);

            if (onChange) {
              const syntheticEvent = {
                target: { value: previousValue }
              } as unknown as React.ChangeEvent<HTMLTextAreaElement>;
              onChange(syntheticEvent);
            }
          }
        }
      }

      // Ctrl + Y: Redo.
      if (event.keyCode === 89 && event.ctrlKey) {
        event.preventDefault();
        if (historyIndex < history.length - 1) {
          const nextValue = history[historyIndex + 1];
          setHistoryIndex(historyIndex + 1);
          if (textArea) {
            textArea.value = nextValue;
            setTriggerAutoSize(nextValue);

            if (onChange) {
              const syntheticEvent = {
                target: { value: nextValue }
              } as unknown as React.ChangeEvent<HTMLTextAreaElement>;
              onChange(syntheticEvent);
            }
          }
        }
      }

      onKeyDown?.(event);
    }

    // Save initial value to history
    React.useEffect(() => {
      if (value !== undefined) {
        updateHistory(value as string);
      }
    }, []);

    return (
      <textarea
        {...props}
        value={value}
        ref={textAreaRef}
        draggable={false}
        data-gramm="false"
        className={cn(
          "flex w-full overflow-y-hidden max-h-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        onKeyDown={handleKeyDown}
        onChange={(e) => {
          const newValue = e.target.value;
          updateHistory(newValue);
          setTriggerAutoSize(newValue);
          onChange?.(e);
        }}
      />
    );
  }
);

AutosizeTextarea.displayName = "AutosizeTextarea";
