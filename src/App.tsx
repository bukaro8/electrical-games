import { SymbolQuiz } from './games/symbols/SymbolQuiz';
import { Routes, Route } from 'react-router-dom';
import { GameSelect } from '@components/GameSelect';
import { CeilingRoseGame } from '@games/ceiling-rose/CeilingRoseGame';
import type { GameConfig } from '@engine/types';
import v1 from './games/ceiling-rose/data/ceiling-rose-v1.json';
import v2 from './games/ceiling-rose/data/ceiling-rose-v2.json';

function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Routes>
        <Route path="/games/symbols" element={<SymbolQuiz />} />
        <Route path="/" element={<GameSelect />} />
        <Route path="/games/ceiling-rose" element={<CeilingRoseGame key="v1" config={v1 as GameConfig} />} />
        <Route path="/games/ceiling-rose-v2" element={<CeilingRoseGame key="v2" config={v2 as GameConfig} />} />
      </Routes>
    </div>
  );
}

export default App;