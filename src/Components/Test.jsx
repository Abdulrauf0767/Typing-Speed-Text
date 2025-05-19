import React, { useEffect, useState, useRef } from 'react';

const Test = () => {
  const [paragraph, setParagraph] = useState('');
  const [typedText, setTypedText] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [isRunning, setIsRunning] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);

  const intervalRef = useRef(null);

  const fetchData = async () => {
    try {
      const res = await fetch("/Paragraph.json");
      const data = await res.json();
      const random = data.paragraphs[Math.floor(Math.random() * data.paragraphs.length)];
      setParagraph(random.text);
      setTypedText('');
      setTimeLeft(60);
      setIsRunning(false);
      setWpm(0);
      setAccuracy(100);
      clearInterval(intervalRef.current);
    } catch (error) {
      console.log('data not fetched', error);
    }
  };

  const handleStart = () => {
    fetchData();
  };
  const handleRestart = () => {
    setParagraph('');
    setAccuracy('');
    setWpm(0) ;
    setIsRunning(false);
    setTimeLeft(60) ;
    setTypedText('')
  }
    useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    }
    if (timeLeft === 0) {
      clearInterval(intervalRef.current);
      calculateResults();
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, timeLeft]);

  const handleTyping = (e) => {
    const value = e.target.value;
    if (!isRunning) {
      setIsRunning(true);
    }
    setTypedText(value);
  };

  const calculateResults = () => {
    const wordsTyped = typedText.trim().split(/\s+/).length;
    const correctChars = typedText.split('').filter((char, idx) => char === paragraph[idx]).length;
    const accuracyValue = ((correctChars / typedText.length) * 100).toFixed(0);
    setWpm(wordsTyped);
    setAccuracy(typedText.length === 0 ? 0 : accuracyValue);
  };

  const renderColoredText = () => {
    return paragraph.split('').map((char, i) => {
      let color = '';
      if (i < typedText.length) {
        color = char === typedText[i] ? 'text-white' : 'text-red-500';
      }
      return (
        <span key={i} className={color}>
          {char}
        </span>
      );
    });
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white px-4 py-8 flex flex-col items-center">
      <h1 className="text-3xl md:text-5xl font-bold text-[#67c947] mb-10 text-center">Typing Speed Test</h1>
      <div className="w-full max-w-4xl bg-[#1d1d1d] rounded-lg shadow-lg p-6 md:p-10">
        <div className="mb-6 text-lg md:text-xl leading-relaxed text-gray-300 break-words">
          {renderColoredText()}
        </div>
        <textarea
          value={typedText}
          onChange={handleTyping}
          disabled={timeLeft === 0 || !paragraph}
          className="w-full h-40 md:h-48 p-4 rounded-md text-[#67c947] bg-gray-800 border border-gray-600 outline-none resize-none text-base md:text-lg"
          placeholder="Start typing here..."
        />
        <div className="mt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <button
            onClick={handleStart}
            className="px-6 py-3 rounded-md bg-[#67c947] text-black font-semibold hover:bg-[#4fa634] transition"
          >
            Start Test
          </button>
          <button
            onClick={handleRestart}
            className="px-6 py-3 rounded-md bg-[#67c947] text-black font-semibold hover:bg-[#4fa634] transition"
          >
            Restart
          </button>
          <div className="flex gap-6 text-sm md:text-base text-gray-400">
            <span>Time: {timeLeft}s</span>
            <span>WPM: {wpm}</span>
            <span>Accuracy: {accuracy}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Test;
