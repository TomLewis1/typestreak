// src/components/TypingBox.tsx
import React from 'react';
import type { ChangeEvent } from 'react';

interface Props {
  targetText: string;
  typedText: string;
  setTypedText: (text: string) => void; // <-- Not Dispatch<SetStateAction<string>>
  startTime: number | null;
  setStartTime: React.Dispatch<React.SetStateAction<number | null>>;
  isTestComplete: boolean;
  setIsTestComplete: React.Dispatch<React.SetStateAction<boolean>>;
}

const TypingBox: React.FC<Props> = ({
  targetText,
  typedText,
  setTypedText,
  startTime,
  setStartTime,
  isTestComplete,
  setIsTestComplete,
}) => {
  // Prevent pasting into the text box
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
  };

  // Prevent copying from the text box
  const handleCopy = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
  };

  const handleContextMenu = (e: React.MouseEvent<HTMLInputElement>) => {
    e.preventDefault(); // Prevent right-click menu
  };

  // Handle text input and start timer if it's the first input
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setTypedText(input);

    if (!startTime && input !== '') {
      setStartTime(Date.now());
    }

    if (input === targetText) {
      setIsTestComplete(true);
    }
  };

  return (
    <input
      type="text"
      value={typedText}
      onChange={handleChange}
      onPaste={handlePaste}
      onCopy={handleCopy}
      onContextMenu={handleContextMenu} // Disable right-click menu
      disabled={isTestComplete}
      placeholder="Start typing here"
      className="w-full py-3 px-4 mt-4 bg-gray-800 border-2 border-gray-700 text-white text-lg rounded-md focus:outline-none"
    />
  );
};

export default TypingBox;
