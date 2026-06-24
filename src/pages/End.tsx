import { useGame } from '../context/GameContext';

function End() {
  const { settings, getTeamScore, resetGame, setPage } = useGame();

  const teamResults = settings.teams.map(team => ({
    ...team,
    score: getTeamScore(team.id),
  })).sort((a, b) => b.score - a.score);

  return (
    <div className="end">
      <h1>Конец игры!</h1>
      <div>
        <h2>Результаты:</h2>
        <div className="teams">
          {teamResults.map((team, index) => (
            <div className="team" key={team.id}>
              <span className="teamPlace">{index + 1}.</span>
              <span className="teamName">{team.name}</span>
              <span className="teamCount">{team.score}</span>
            </div>
          ))}
        </div>
        <button onClick={() => { resetGame(); setPage('start'); }}>
          Следующая игра!
        </button>
      </div>
    </div>
  );
}

export default End;