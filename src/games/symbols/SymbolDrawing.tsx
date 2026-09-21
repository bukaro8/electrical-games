import type { SymbolQuestion } from './data';

export function SymbolDrawing({ symbol, named = false }: { symbol: SymbolQuestion; named?: boolean }) {
  const outlet = symbol.id === 'phone' || symbol.id === 'tv';
  return (
    <svg viewBox="0 0 120 120" role="img" aria-label={named ? symbol.name : 'Electrical symbol to identify'} className="w-full h-full text-slate-800" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinejoin="round">
      {symbol.path && <path d={symbol.path} />}
      {symbol.circle && <circle cx={symbol.circle[0]} cy={symbol.circle[1]} r={symbol.circle[2]} />}
      {symbol.text && <text x={outlet ? 99 : symbol.id === 'double-socket' ? 88 : 60} y={outlet ? 91 : symbol.id === 'double-socket' ? 58 : symbol.id === 'meter' ? 78 : 70} textAnchor="middle" fill="currentColor" stroke="none" fontFamily="Arial, sans-serif" fontSize={outlet || symbol.id === 'double-socket' ? 15 : 27}>{symbol.text}</text>}
    </svg>
  );
}
