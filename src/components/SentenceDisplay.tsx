// src/components/SentenceDisplay.tsx
import React from 'react';

interface Props {
  text: string;
  typedText: string;
}

const SentenceDisplay: React.FC<Props> = ({ text, typedText }) => {
  const renderText = () => {
    return [...text].map((char, index) => {
      const typedChar = typedText[index];
      let className = '';

      if (typedChar === char) {
        className = 'text-green-600 bg-green-200'; // Correct character (green)
      } else if (typedChar !== undefined) {
        className = 'text-red-600 bg-red-200'; // Incorrect character (red)
      }

      return (
        <span key={index} className={className}>
          {char}
        </span>
      );
    });
  };

  return <div className="mb-4 text-2xl font-mono">{renderText()}</div>;
};

export default SentenceDisplay;
