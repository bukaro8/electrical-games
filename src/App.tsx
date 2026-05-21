import { Routes, Route } from 'react-router-dom';
import { GameSelect } from '@components/GameSelect';
import { CeilingRoseGame } from '@games/ceiling-rose/CeilingRoseGame';
import { CeilingRoseV2Game } from '@games/ceiling-rose/CeilingRoseV2Game';

function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Routes>
        <Route path="/" element={<GameSelect />} />
        <Route path="/games/ceiling-rose" element={<CeilingRoseGame />} />
        <Route path="/games/ceiling-rose-v2" element={<CeilingRoseV2Game />} />
      </Routes>
    </div>
  );
}

export default App;