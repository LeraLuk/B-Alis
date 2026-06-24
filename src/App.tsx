import { GameProvider, useGame } from './context/GameContext';
import Start from './pages/Start';
import Settings from './pages/Settings';
import Hall from './pages/Hall';
import Play from './pages/Play';
import Results from './pages/Results';
import End from './pages/End';
import Words from './pages/Words';

function Router() {
  const { page } = useGame();
  switch (page) {
    case 'start': return <Start />;
    case 'settings': return <Settings />;
    case 'hall': return <Hall />;
    case 'play': return <Play />;
    case 'results': return <Results />;
    case 'end': return <End />;
    case 'words': return <Words />;
    default: return <Start />;
  }
}

function App() {
  return (
    <GameProvider>
      <Router />
    </GameProvider>
  );
}

export default App;