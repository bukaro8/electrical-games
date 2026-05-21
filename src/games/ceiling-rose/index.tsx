import { Routes, Route } from 'react-router-dom';
import { CeilingRoseGame } from './CeilingRoseGame';

export function CeilingRoseIndex() {
  return (
    <Routes>
      <Route index element={<CeilingRoseGame />} />
    </Routes>
  );
}