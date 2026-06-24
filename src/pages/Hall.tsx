import { useGame } from '../context/GameContext';

function Hall() {
  const { getCurrentTeam, startRound, gameState } = useGame();
  const team = getCurrentTeam();

  return (
    <div className="hall">
      <h1>Готовы?</h1>
      <div>
        <h2>{team?.name || 'Команда'}</h2>
        <p style={{ fontSize: '20px', opacity: 0.7 }}>Раунд {gameState.currentRound}</p>
        <button onClick={startRound}>Начать раунд!</button>
      </div>
    </div>
  );
}

export default Hall;