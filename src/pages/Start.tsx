import logo from '/logo.svg';
import { useGame } from '../context/GameContext';

function Start() {
  const { setPage } = useGame();

  return (
    <div className='start'>
      <h1>Добро пожаловать</h1>
      <img src={logo} alt="" />
      <button className='startBtn' onClick={() => setPage('settings')}>
        Начать
      </button>
      <button className='seeWords' onClick={() => setPage('words')}>
        Посмотреть список слов
      </button>
    </div>
  );
}

export default Start;