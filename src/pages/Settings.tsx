import { useState } from 'react';
import { useGame } from '../context/GameContext';
import type { Team } from '../types';

function generateId() {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

function Settings() {
  const { settings, updateSettings, startGame, setPage } = useGame();
  const [newPlayerName, setNewPlayerName] = useState('');
  const [teamInputs, setTeamInputs] = useState<Record<string, string>>(() => {
    const map: Record<string, string> = {};
    settings.teams.forEach(t => { map[t.id] = t.name; });
    return map;
  });

  const handleWordsPerPlayerChange = (val: string) => {
    const num = parseInt(val);
    if (!isNaN(num) && num >= 3 && num <= 10) {
      updateSettings({ wordsPerPlayer: num });
    }
  };

  const handleRoundTimeChange = (val: string) => {
    const num = parseInt(val);
    if (!isNaN(num) && num >= 20 && num <= 120) {
      updateSettings({ roundTime: num });
    }
  };

  const addPlayer = () => {
    if (!newPlayerName.trim()) return;
    const newPlayer = {
      id: generateId(),
      name: newPlayerName.trim(),
    };
    updateSettings({ players: [...settings.players, newPlayer] });
    setNewPlayerName('');
  };

  const removePlayer = (id: string) => {
    const newTeams = settings.teams.map(t => ({
      ...t,
      playerIds: t.playerIds.filter(pid => pid !== id),
    }));
    updateSettings({
      players: settings.players.filter(p => p.id !== id),
      teams: newTeams,
    });
  };

  const addTeam = () => {
    if (settings.teams.length >= 6) return;
    const newTeam: Team = {
      id: generateId(),
      name: `Команда ${settings.teams.length + 1}`,
      playerIds: [],
    };
    setTeamInputs(prev => ({ ...prev, [newTeam.id]: newTeam.name }));
    updateSettings({ teams: [...settings.teams, newTeam] });
  };

  const removeTeam = (id: string) => {
    if (settings.teams.length <= 2) return;
    updateSettings({ teams: settings.teams.filter(t => t.id !== id) });
  };

  const addPlayerToTeam = (playerId: string, teamId: string) => {
    const newTeams = settings.teams.map(t => {
      if (t.id === teamId) {
        if (t.playerIds.includes(playerId)) return t;
        return { ...t, playerIds: [...t.playerIds, playerId] };
      }
      return { ...t, playerIds: t.playerIds.filter(pid => pid !== playerId) };
    });
    updateSettings({ teams: newTeams });
  };

  const removePlayerFromTeam = (playerId: string, teamId: string) => {
    const newTeams = settings.teams.map(t => {
      if (t.id === teamId) {
        return { ...t, playerIds: t.playerIds.filter(pid => pid !== playerId) };
      }
      return t;
    });
    updateSettings({ teams: newTeams });
  };

  const handleTeamNameChange = (teamId: string, name: string) => {
    setTeamInputs(prev => ({ ...prev, [teamId]: name }));
  };

  const saveTeamName = (teamId: string) => {
    const newTeams = settings.teams.map(t => {
      if (t.id === teamId) return { ...t, name: teamInputs[teamId] || t.name };
      return t;
    });
    updateSettings({ teams: newTeams });
  };

  const canStart = settings.teams.every(t => t.playerIds.length > 0) && settings.players.length >= 2;

  return (
    <div className="settings">
      <h1>Настройки партии</h1>
      <div>
        <div className="setting">
          <span>Слов на игрока:</span>
          <div>
            <input
              type="text"
              value={settings.wordsPerPlayer}
              onChange={e => handleWordsPerPlayerChange(e.target.value)}
            />
            <span>3-10</span>
          </div>
        </div>

        <div className="setting">
          <span>Время хода (сек):</span>
          <div>
            <input
              type="text"
              value={settings.roundTime}
              onChange={e => handleRoundTimeChange(e.target.value)}
            />
            <span>20-120</span>
          </div>
        </div>

        <div className="setting check">
          <label>
            <input
              type="checkbox"
              checked={settings.allowSkip}
              onChange={e => updateSettings({ allowSkip: e.target.checked })}
            />
            <span></span>
            <span>Разрешить пропуск слов</span>
          </label>
        </div>

        <div className="setting addTeams">
          <span>Количество команд:</span>
          <div>
            <button onClick={() => {
              if (settings.teams.length > 2) {
                const lastTeam = settings.teams[settings.teams.length - 1];
                removeTeam(lastTeam.id);
              }
            }}>
              <img src="/minus.svg" alt="" />
            </button>
            <div>{settings.teams.length}</div>
            <button onClick={addTeam}>
              <img src="/add.svg" alt="" />
            </button>
          </div>
        </div>

        <div className="setting playerAdd">
          <span>Игроки:</span>
          <div className="nameAdd">
            <input
              type="text"
              placeholder="Введите имя игрока"
              value={newPlayerName}
              onChange={e => setNewPlayerName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addPlayer()}
            />
            <button onClick={addPlayer}></button>
          </div>
          <div className="players">
            {settings.players.map(player => (
              <div className="player" key={player.id}>
                <span>{player.name}</span>
                <button className="del" onClick={() => removePlayer(player.id)}></button>
              </div>
            ))}
          </div>
        </div>

        <div className="setting teams">
          {settings.teams.map(team => (
            <div className="team" key={team.id}>
              <button className="teamDel" onClick={() => removeTeam(team.id)}></button>
              <label>
                <input
                  type="text"
                  placeholder="Введите название команды"
                  value={teamInputs[team.id] || team.name}
                  onChange={e => handleTeamNameChange(team.id, e.target.value)}
                  onBlur={() => saveTeamName(team.id)}
                  onKeyDown={e => e.key === 'Enter' && saveTeamName(team.id)}
                />
                <span></span>
              </label>
              <div className="teamPlayers">
                {team.playerIds.map(pid => {
                  const player = settings.players.find(p => p.id === pid);
                  if (!player) return null;
                  return (
                    <div className="teamPlayer" key={pid}>
                      <span>{player.name}</span>
                      <button className="teamPlayerDel" onClick={() => removePlayerFromTeam(pid, team.id)}></button>
                    </div>
                  );
                })}
                {settings.players
                  .filter(p => !team.playerIds.includes(p.id))
                  .map(player => (
                    <button
                      key={player.id}
                      className="teamPlayer"
                      style={{ background: 'var(--color2)', border: 'var(--border)', borderRadius: 'var(--border-radius)', padding: '5px 10px', cursor: 'pointer' }}
                      onClick={() => addPlayerToTeam(player.id, team.id)}
                    >
                      + {player.name}
                    </button>
                  ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
          <button
            className='settingStartGame'
            onClick={() => setPage('start')}
            style={{ backgroundColor: 'var(--color1)', fontSize: '20px' }}
          >
            ← Назад
          </button>
          <button
            className='settingStartGame'
            onClick={startGame}
            disabled={!canStart}
            style={{ opacity: canStart ? 1 : 0.5 }}
          >
            Начать игру!
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings;