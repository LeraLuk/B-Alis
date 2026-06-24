import { useState, useEffect, useRef, useCallback } from 'react';
import { useGame } from '../context/GameContext';
import type { RoundWord } from '../types';

function Play() {
  const { settings, endRound, getShuffledWords } = useGame();
  const [timeLeft, setTimeLeft] = useState(settings.roundTime);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [roundWords, setRoundWords] = useState<RoundWord[]>([]);
  const [words] = useState(() => getShuffledWords(settings.wordsPerPlayer));
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isEnding = useRef(false);
  const roundWordsRef = useRef<RoundWord[]>([]);
  const currentWordIndexRef = useRef(0);

  // Синхронизируем ref'ы
  useEffect(() => { roundWordsRef.current = roundWords; }, [roundWords]);
  useEffect(() => { currentWordIndexRef.current = currentWordIndex; }, [currentWordIndex]);

  const currentWord = words[currentWordIndex];

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          if (!isEnding.current) {
            isEnding.current = true;
            const remaining = words.slice(currentWordIndexRef.current).map(w => ({
              wordId: w.id,
              text: w.text,
              guessed: false,
            }));
            endRound([...roundWordsRef.current, ...remaining]);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Запускаем таймер только при монтировании

  const handleGuess = useCallback(() => {
    if (!currentWord || isEnding.current) return;
    const rw: RoundWord = {
      wordId: currentWord.id,
      text: currentWord.text,
      guessed: true,
    };
    const newRoundWords = [...roundWords, rw];
    setRoundWords(newRoundWords);

    if (currentWordIndex + 1 >= words.length) {
      isEnding.current = true;
      if (timerRef.current) clearInterval(timerRef.current);
      endRound(newRoundWords);
    } else {
      setCurrentWordIndex(prev => prev + 1);
    }
  }, [currentWord, currentWordIndex, roundWords, words.length, endRound]);

  const handleSkip = useCallback(() => {
    if (!currentWord || !settings.allowSkip || isEnding.current) return;
    const rw: RoundWord = {
      wordId: currentWord.id,
      text: currentWord.text,
      guessed: false,
    };
    const newRoundWords = [...roundWords, rw];
    setRoundWords(newRoundWords);

    if (currentWordIndex + 1 >= words.length) {
      isEnding.current = true;
      if (timerRef.current) clearInterval(timerRef.current);
      endRound(newRoundWords);
    } else {
      setCurrentWordIndex(prev => prev + 1);
    }
  }, [currentWord, currentWordIndex, roundWords, words.length, settings.allowSkip, endRound]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="play">
      <h1>Играем!</h1>
      <div>
        <div className="timer">{formatTime(timeLeft)}</div>
        <h2>{currentWord?.text || '...'}</h2>
        <button className="yes" onClick={handleGuess}>Угадали!</button>
        <button
          className="no"
          onClick={handleSkip}
          style={{ opacity: settings.allowSkip ? 1 : 0.3 }}
          disabled={!settings.allowSkip}
        >
          Пропуск!
        </button>
      </div>
    </div>
  );
}

export default Play;