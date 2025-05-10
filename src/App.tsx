// src/App.tsx
import React, { useState, useEffect } from 'react';
import SentenceDisplay from './components/SentenceDisplay';
import TypingBox from './components/TypingBox';
import StatsPanel from './components/StatsPanel';
import './App.css';

const App: React.FC = () => {
  const sentences = [
    'The quick brown fox jumps over the lazy dog.',
    'React is a powerful JavaScript library for building user interfaces.',
    'JavaScript is one of the most popular programming languages.',
  ];

  const [targetText, setTargetText] = useState<string>(sentences[0]);
  const [typedText, setTypedText] = useState<string>('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isTestComplete, setIsTestComplete] = useState<boolean>(false);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [correctChars, setCorrectChars] = useState<number>(0);
  const [totalTypedChars, setTotalTypedChars] = useState<number>(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (!isTestComplete && startTime) {
      interval = setInterval(() => {
        const now = Date.now();
        const elapsed = (now - startTime) / 1000; // convert to seconds
        setTimeElapsed(parseFloat(elapsed.toFixed(2))); // include milliseconds
      }, 100); // update every 100ms
    }

    return () => clearInterval(interval);
  }, [isTestComplete, startTime]);

  const restartTest = () => {
    setTargetText(sentences[Math.floor(Math.random() * sentences.length)]);
    setTypedText('');
    setStartTime(null);
    setIsTestComplete(false);
    setTimeElapsed(0);
    setCorrectChars(0);
    setTotalTypedChars(0);
  };

  const handleTypedTextChange = (text: string) => {
    setTypedText(text);
    setCorrectChars(countCorrectChars(text));
    setTotalTypedChars(text.length);

    if (!startTime && text !== '') {
      setStartTime(Date.now());
    }

    // End the test when the correct number of characters are typed
    if (text.length === targetText.length) {
      setIsTestComplete(true);
    }
  };

  const countCorrectChars = (text: string) => {
    let correctCount = 0;
    for (let i = 0; i < text.length; i++) {
      if (text[i] === targetText[i]) {
        correctCount++;
      }
    }
    return correctCount;
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 text-white">
      <h1 className="text-5xl font-bold text-center text-indigo-800 drop-shadow-md mb-8">
        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">
          TypeMasher
        </span>
      </h1>

      <SentenceDisplay text={targetText} typedText={typedText} />
      <TypingBox
        targetText={targetText}
        typedText={typedText}
        setTypedText={handleTypedTextChange}
        startTime={startTime}
        setStartTime={setStartTime}
        isTestComplete={isTestComplete}
        setIsTestComplete={setIsTestComplete}
      />
      <StatsPanel
        typedText={typedText}
        timeElapsed={timeElapsed}
        correctChars={correctChars}
        totalTypedChars={totalTypedChars}
        isTestComplete={isTestComplete}
      />
      {isTestComplete && (
        <button
          onClick={restartTest}
          className="text-3xl font-semibold mt-6 px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium text-lg rounded-xl shadow-lg hover:from-indigo-600 hover:to-purple-700 active:scale-95 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-all duration-300"
        >
          🔁 Restart
        </button>
      )}
    </main>
  );
};

export default App;
