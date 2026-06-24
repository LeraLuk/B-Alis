import { useState } from 'react';
import { useGame } from '../context/GameContext';

function Results() {
  const { gameState, nextRound, getCurrentTeam } = useGame();
  const lastResult = gameState.results[gameState.results.length - 1];
  const [words, setWords] = useState(lastResult?.words || []);
  const team = getCurrentTeam();

  const handleToggle = (index: number) => {
    const newWords = [...words];
    newWords[index] = { ...newWords[index], guessed: !newWords[index].guessed };
    setWords(newWords);
  };

  const guessedCount = words.filter(w => w.guessed).length;

  const handleNext = () => {
    // Обновляем результат с исправленными словами
    const newResults = [...gameState.results];
    newResults[newResults.length - 1] = {
      ...lastResult,
      words,
      score: guessedCount,
    };
    // Обновляем gameState через nextRound
    nextRound();
  };

  return (
    <div className="results">
      <h1>Результаты</h1>
      <div>
        <h2>{team?.name} — Угадали: {guessedCount}</h2>
        <div className="words">
          {words.map((word, i) => (
            <div className="word" key={i}>
              <span>{word.text}</span>
              <label className="yesOrNo">
                <input
                  type="checkbox"
                  checked={word.guessed}
                  onChange={() => handleToggle(i)}
                />
                <span className="yes"></span>
                <span className="no"></span>
              </label>
            </div>
          ))}
        </div>
        <button onClick={handleNext}>Следующий раунд</button>
      </div>
    </div>
  );
}

export default Results;