// src/components/StatsPanel.tsx
import React from 'react';

interface Props {
  typedText: string;
  timeElapsed: number;
  correctChars: number;
  totalTypedChars: number;
  isTestComplete: boolean;
}

const StatsPanel: React.FC<Props> = ({
  typedText,
  timeElapsed,
  correctChars,
  totalTypedChars,
  isTestComplete,
}) => {
  const getAccuracyColour = (accuracy: number, forBackground: boolean) => {
    const clamped = Math.min(100, Math.max(0, accuracy));

    // RGB for Tailwind red-500, yellow-500, green-500. for background use 50 variants
    const red = forBackground ? [254, 242, 242] : [239, 68, 68];
    const yellow = forBackground ? [254, 252, 232] : [234, 179, 8];
    const green = forBackground ? [240, 253, 244] : [34, 197, 94];

    let r: number, g: number, b: number;

    if (clamped < 50) {
      // Interpolate red → yellow
      const t = clamped / 50;
      r = red[0] + t * (yellow[0] - red[0]);
      g = red[1] + t * (yellow[1] - red[1]);
      b = red[2] + t * (yellow[2] - red[2]);
    } else {
      // Interpolate yellow → green
      const t = (clamped - 50) / 50;
      r = yellow[0] + t * (green[0] - yellow[0]);
      g = yellow[1] + t * (green[1] - yellow[1]);
      b = yellow[2] + t * (green[2] - yellow[2]);
    }

    return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
  };

  const wpm = timeElapsed
    ? Math.round(typedText.length / 5 / (timeElapsed / 60))
    : 0;

  const accuracy = totalTypedChars
    ? Math.round((correctChars / totalTypedChars) * 100)
    : 0;

  const accuracyColor = timeElapsed
    ? getAccuracyColour(accuracy, false)
    : 'rgb(34, 197, 94)'; // green-500
  const accuracyBgColor = timeElapsed
    ? getAccuracyColour(accuracy, true)
    : 'rgb(240, 253, 244)'; // green-50

  return (
    <div className="stats-panel">
      <div className="text-center">
        <p className="text-gray-500 text-sm uppercase tracking-wide">
          Words Per Minute
        </p>
        <p
          className={`text-3xl font-semibold text-indigo-600 bg-indigo-50 p-2 rounded-lg shadow-md ${
            isTestComplete ? 'animate-pulse' : ''
          }`}
        >
          {wpm}
        </p>
      </div>

      <div className="text-center">
        <p className="text-gray-500 text-sm uppercase tracking-wide">
          Accuracy
        </p>
        <p
          className={`text-3xl font-semibold text-green-600 bg-green-50 p-2 rounded-lg transition-colors duration-500 ${
            isTestComplete ? 'animate-pulse' : ''
          }`}
          style={{
            color: accuracyColor,
            backgroundColor: accuracyBgColor,
          }}
        >
          {accuracy}%
        </p>
      </div>

      <div className="text-center">
        <p className="text-gray-500 text-sm uppercase tracking-wide">
          Time Elapsed
        </p>
        <p
          className={`text-4xl font-mono bg-black text-green-400 py-2 rounded-lg shadow-md" ${
            isTestComplete ? 'animate-pulse' : ''
          }`}
        >
          {timeElapsed.toFixed(2)}s
        </p>
      </div>
    </div>
  );
};

export default StatsPanel;
