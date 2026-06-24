import { useState } from 'react';
import { useGame } from '../context/GameContext';

function Words() {
  const { words, addWord, removeWord, resetWords, setPage } = useGame();
  const [newWord, setNewWord] = useState('');
  const [filter, setFilter] = useState<'all' | 'default' | 'custom'>('all');

  const filteredWords = words.filter(w => {
    if (filter === 'default') return !w.isCustom;
    if (filter === 'custom') return w.isCustom;
    return true;
  });

  const handleAdd = () => {
    if (!newWord.trim()) return;
    addWord(newWord.trim());
    setNewWord('');
  };

  return (
    <div className="settings" style={{ margin: '30px auto' }}>
      <h1>Словарь слов</h1>
      <div>
        <div className="setting" style={{ width: '100%' }}>
          <span>Всего слов: {words.length}</span>
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button
              onClick={() => setFilter('all')}
              style={{
                padding: '8px 16px',
                borderRadius: 'var(--border-radius)',
                border: 'var(--border)',
                background: filter === 'all' ? 'var(--color1)' : 'var(--color3)',
                cursor: 'pointer',
                fontSize: '16px',
              }}
            >
              Все
            </button>
            <button
              onClick={() => setFilter('default')}
              style={{
                padding: '8px 16px',
                borderRadius: 'var(--border-radius)',
                border: 'var(--border)',
                background: filter === 'default' ? 'var(--color1)' : 'var(--color3)',
                cursor: 'pointer',
                fontSize: '16px',
              }}
            >
              Базовые
            </button>
            <button
              onClick={() => setFilter('custom')}
              style={{
                padding: '8px 16px',
                borderRadius: 'var(--border-radius)',
                border: 'var(--border)',
                background: filter === 'custom' ? 'var(--color1)' : 'var(--color3)',
                cursor: 'pointer',
                fontSize: '16px',
              }}
            >
              Мои
            </button>
          </div>
        </div>

        <div className="setting playerAdd" style={{ width: '100%' }}>
          <span>Добавить слово:</span>
          <div className="nameAdd">
            <input
              type="text"
              placeholder="Введите новое слово"
              value={newWord}
              onChange={e => setNewWord(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
            />
            <button onClick={handleAdd}></button>
          </div>
        </div>

        <div className="setting" style={{ width: '100%' }}>
          <span>Список слов:</span>
          <div className="players" style={{ maxHeight: '300px', overflowY: 'auto', padding: '10px', background: 'var(--color2)', borderRadius: 'var(--border-radius)', border: 'var(--border)' }}>
            {filteredWords.length === 0 ? (
              <span style={{ opacity: 0.5 }}>Нет слов</span>
            ) : (
              filteredWords.map(word => (
                <div className="player" key={word.id} style={{ width: 'fit-content', justifyContent: 'space-between', whiteSpace: 'nowrap' }}>
                  <span>{word.text}</span>
                  <button className="del" onClick={() => removeWord(word.id)}></button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="setting" style={{ width: '100%', flexDirection: 'row', gap: '10px' }}>
          <button
            className='settingStartGame'
            onClick={() => {
              if (confirm('Все пользовательские слова будут удалены. Восстановить базовый набор?')) {
                resetWords();
              }
            }}
            style={{ height: '50px', fontSize: '18px', background: 'var(--red)' }}
          >
            Сбросить слова
          </button>
          <button
            className='settingStartGame'
            onClick={() => setPage('start')}
            style={{ height: '50px', fontSize: '18px' }}
          >
            Назад
          </button>
        </div>
      </div>
    </div>
  );
}

export default Words;