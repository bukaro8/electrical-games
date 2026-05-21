import type { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import { Button } from './Button';

interface GameShellProps {
  title: string;
  subtitle?: string;
  score?: number;
  attempts?: number;
  step?: number;
  totalSteps?: number;
  onReset?: () => void;
  onTest?: () => void;
  children: ReactNode;
}

export function GameShell({
  title,
  subtitle,
  score,
  attempts,
  step,
  totalSteps,
  onReset,
  onTest,
  children,
}: GameShellProps) {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Logo */}
              <div className="flex items-center gap-2">
                <svg
                  viewBox="0 0 32 32"
                  className="w-8 h-8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="16"
                    cy="16"
                    r="12"
                    stroke="#1E40AF"
                    strokeWidth="2"
                    fill="none"
                  />
                  <circle cx="16" cy="16" r="5" fill="#1E40AF" />
                  <line
                    x1="16"
                    y1="4"
                    x2="16"
                    y2="11"
                    stroke="#8B4513"
                    strokeWidth="2"
                  />
                  <line
                    x1="16"
                    y1="21"
                    x2="16"
                    y2="28"
                    stroke="#8B4513"
                    strokeWidth="2"
                  />
                </svg>
                <span className="font-bold text-lg text-slate-900 hidden sm:inline">
                  Electrical Practice
                </span>
              </div>
              <div className="h-6 w-px bg-slate-200 hidden sm:block" />
              <div>
                <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
                {subtitle && (
                  <p className="text-sm text-slate-500">{subtitle}</p>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4">
              {score !== undefined && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-700">{score}</div>
                  <div className="text-xs text-slate-500 uppercase tracking-wide">
                    Score
                  </div>
                </div>
              )}
              {attempts !== undefined && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-600">
                    {attempts}
                  </div>
                  <div className="text-xs text-slate-500 uppercase tracking-wide">
                    Attempts
                  </div>
                </div>
              )}
              {step !== undefined && totalSteps !== undefined && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-600">
                    {step}/{totalSteps}
                  </div>
                  <div className="text-xs text-slate-500 uppercase tracking-wide">
                    Step
                  </div>
                </div>
              )}
              {onTest && (
                <Button variant="primary" size="sm" onClick={onTest}>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Test
                </Button>
              )}
              {onReset && (
                <Button variant="ghost" size="sm" onClick={onReset}>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Reset
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  );
}

// For when the game has its own layout (uses Outlet)
export function GameShellLayout() {
  return <Outlet />;
}
