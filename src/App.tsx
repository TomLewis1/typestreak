// src/App.tsx
import React, { useState, useEffect, useRef } from 'react';
import SentenceDisplay from './components/SentenceDisplay';
import TypingBox from './components/TypingBox';
import StatsPanel from './components/StatsPanel';
import './App.css';
import tsLogo from './assets/ts.png'; // adjust path as needed

const App: React.FC = () => {
  const [targetText, setTargetText] = useState<string>('Loading...');
  const [typedText, setTypedText] = useState<string>('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isTestComplete, setIsTestComplete] = useState<boolean>(false);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [correctChars, setCorrectChars] = useState<number>(0);
  const [totalTypedChars, setTotalTypedChars] = useState<number>(0);
  const hasFetched = useRef(false); // To ensure we only fetch once

  const fetchRandomSentence = async () => {
    try {
      const response = await fetch(
        'https://en.wikipedia.org/api/rest_v1/page/random/summary'
      );
      const data = await response.json();
      const sentence = data.extract.split('. ')[0] + '.'; // Get first sentence
      setTargetText(sentence);
    } catch (error) {
      console.error('Failed to fetch sentence:', error);
      setTargetText('Failed to load sentence. Please try again.');
    }
  };

  useEffect(() => {
    if (!hasFetched.current) {
      fetchRandomSentence();
      hasFetched.current = true;
    }
  }, []);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (!isTestComplete && startTime) {
      interval = setInterval(() => {
        const now = Date.now();
        const elapsed = (now - startTime) / 1000; // convert to seconds
        setTimeElapsed(parseFloat(elapsed.toFixed(2))); // include milliseconds
      }, 10); // update every 10ms
    }

    return () => clearInterval(interval);
  }, [isTestComplete, startTime]);

  const restartTest = () => {
    fetchRandomSentence();
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
      <img src={tsLogo} alt="Logo" className="w-16 h-16 inline-block mr-2" />
      <h1 className="text-5xl font-bold text-center text-indigo-800 drop-shadow-md mb-8">
        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">
          TypeStreak
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
