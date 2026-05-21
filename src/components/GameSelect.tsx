import { Link } from 'react-router-dom';
import type { GameEntry } from '@engine/types';

const AVAILABLE_GAMES: GameEntry[] = [
  {
    gameId: 'ceiling-rose-v1',
    title: 'Ceiling Rose — 1-Way Switch',
    description:
      'Practice wiring a UK ceiling rose with a 1-gang 1-way switch using the loop-in method. Includes supply, switch, rose, and lamp connections.',
    difficulty: 'beginner',
    route: '/games/ceiling-rose',
  },
  {
    gameId: 'ceiling-rose-v2',
    title: 'Ceiling Rose — 2-Way Switching',
    description:
      'Wire a ceiling rose with 2-way switching using two switches and 3-core & CPC cable. Includes strapper connections between switches.',
    difficulty: 'intermediate',
    route: '/games/ceiling-rose-v2',
  },
];

const DIFFICULTY_COLORS = {
  beginner: 'bg-green-100 text-green-800 border-green-200',
  intermediate: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  advanced: 'bg-red-100 text-red-800 border-red-200',
};

const DIFFICULTY_LABELS = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

interface GameCardProps {
  game: GameEntry;
}

function GameCard({ game }: GameCardProps) {
  return (
    <Link
      to={game.route}
      className="group block bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-200 overflow-hidden"
    >
      {/* Preview area */}
      <div className="h-40 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
        <svg
          viewBox="0 0 120 80"
          className="w-32 h-24 opacity-60 group-hover:opacity-80 transition-opacity"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Simplified ceiling rose schematic preview */}
          <circle cx="60" cy="20" r="18" stroke="#1E40AF" strokeWidth="2" fill="none" />
          <circle cx="60" cy="20" r="6" fill="#1E40AF" opacity="0.3" />
          <line x1="42" y1="38" x2="30" y2="55" stroke="#8B4513" strokeWidth="1.5" />
          <circle cx="30" cy="55" r="4" stroke="#8B4513" strokeWidth="1.5" fill="none" />
          <line x1="78" y1="38" x2="90" y2="55" stroke="#8B4513" strokeWidth="1.5" />
          <circle cx="90" cy="55" r="4" stroke="#8B4513" strokeWidth="1.5" fill="none" />
          <line x1="60" y1="38" x2="60" y2="55" stroke="#1E40AF" strokeWidth="1.5" />
          <rect x="52" y="55" width="16" height="12" rx="2" stroke="#1E40AF" strokeWidth="1.5" fill="none" />
        </svg>
      </div>

      {/* Card content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="font-semibold text-slate-900 text-lg leading-tight">
            {game.title}
          </h3>
          <span
            className={`
              inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border
              ${DIFFICULTY_COLORS[game.difficulty]}
            `}
          >
            {DIFFICULTY_LABELS[game.difficulty]}
          </span>
        </div>
        <p className="text-sm text-slate-600 mb-4 leading-relaxed">
          {game.description}
        </p>
        <div className="flex items-center gap-2 text-blue-600 font-medium text-sm group-hover:text-blue-700">
          <span>Start Practice</span>
          <svg
            className="w-4 h-4 group-hover:translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </div>
      </div>
    </Link>
  );
}

export function GameSelect() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <svg
              viewBox="0 0 40 40"
              className="w-10 h-10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="20"
                cy="20"
                r="16"
                stroke="#1E40AF"
                strokeWidth="2.5"
                fill="none"
              />
              <circle cx="20" cy="20" r="7" fill="#1E40AF" />
              <line
                x1="20"
                y1="4"
                x2="20"
                y2="13"
                stroke="#8B4513"
                strokeWidth="2.5"
              />
              <line
                x1="20"
                y1="27"
                x2="20"
                y2="36"
                stroke="#8B4513"
                strokeWidth="2.5"
              />
            </svg>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Electrical Practice Games
              </h1>
              <p className="text-sm text-slate-500">
                Interactive wiring practice for UK electrical students
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-slate-700 mb-1">
            Choose a Game
          </h2>
          <p className="text-sm text-slate-500">
            Select a circuit to practice wiring. Drag wires to connect terminals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {AVAILABLE_GAMES.map((game) => (
            <GameCard key={game.gameId} game={game} />
          ))}
        </div>

        {AVAILABLE_GAMES.length === 0 && (
          <div className="text-center py-16">
            <svg
              className="w-16 h-16 mx-auto text-slate-300 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-lg font-medium text-slate-700 mb-1">
              No Games Available
            </h3>
            <p className="text-sm text-slate-500">
              Games will appear here once they are added to the project.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white mt-auto">
        <div className="max-w-5xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <p className="text-sm text-slate-400 text-center">
            Electrical Practice Games — UK wiring practice for students
          </p>
        </div>
      </footer>
    </div>
  );
}