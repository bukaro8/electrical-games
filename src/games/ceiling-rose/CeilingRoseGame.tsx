import { useState, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { GameShell } from '@components/GameShell';
import {
  Canvas,
  WirePalette,
  InstructionPanel,
} from './components';
import type { GameConfig } from '@engine/types';
import { createGameStore } from '@engine/store/useGameStore';

type GameMode = 'learn' | 'practice';

export function CeilingRoseGame({ config }: { config: GameConfig }) {
  const store = useMemo(() => {
    const instance = createGameStore();
    instance.getState().loadConfig(config);
    return instance;
  }, [config]);
  const state = store();
  const [sourceTerminalId, setSourceTerminalId] = useState<string | null>(null);
  const [mode, setMode] = useState<GameMode>('learn');
  const lampOn = state.gameStatus === 'complete';

  const handleCancel = useCallback(() => {
    setSourceTerminalId(null);
    store.getState().clearSelectedWireCore();
  }, [store]);

  const handleTerminalPointerDown = (terminalId: string) => {
    if (!state.selectedWireCoreId) return;
    if (!sourceTerminalId) {
      setSourceTerminalId(terminalId);
    } else if (terminalId !== sourceTerminalId) {
      state.addConnection(sourceTerminalId, terminalId, state.selectedWireCoreId);
      handleCancel();
    }
  };
  const handleRemoveConnection = state.removeConnection;
  const handleReset = () => {
    handleCancel();
    state.reset();
  };

  const handleTestCircuit = () => {
    const result = state.testCircuit();
    if (result.status === 'correct') {
      confetti({ particleCount: 40, spread: 70, origin: { y: 0.55 } });
    }
    const terminalName = (id: string) => {
      const component = config.components.find(c => c.terminals.some(t => t.id === id));
      return `${component?.label || ''} ${component?.terminals.find(t => t.id === id)?.label || id}`;
    };
    const messages = [result.feedback,
      ...result.incorrectConnections.map(c => `${terminalName(c.connection.from)} → ${terminalName(c.connection.to || '')}: ${c.feedbackMessage}`),
      ...result.missingConnections.map(c => `Missing: ${terminalName(c.from)} → ${terminalName(c.to)}.`),
    ];
    alert(messages.join('\n'));
  };

  const isLearn = mode === 'learn';

  return (
    <GameShell
      title={config.title}
      subtitle={isLearn ? config.description : undefined}
      score={state.score}
      attempts={state.attempts}
      step={isLearn ? state.currentStep + 1 : undefined}
      totalSteps={isLearn ? config.instructions.length : undefined}
      onReset={handleReset}
      onTest={handleTestCircuit}
    >
      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
        <div className="w-full lg:w-72 p-4 flex flex-col gap-4 border-b lg:border-b-0 lg:border-r border-slate-200 bg-white overflow-y-auto">
          {/* Mode toggle */}
          <div className="flex rounded-lg overflow-hidden border border-slate-300">
            <button
              onClick={() => setMode('learn')}
              className={`flex-1 py-2 text-sm font-medium transition-colors ${
                isLearn
                  ? 'bg-blue-700 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-100'
              }`}
            >
              Learn
            </button>
            <button
              onClick={() => setMode('practice')}
              className={`flex-1 py-2 text-sm font-medium transition-colors ${
                !isLearn
                  ? 'bg-blue-700 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-100'
              }`}
            >
              Practice
            </button>
          </div>

          <WirePalette
            cableGroups={config.cableGroups}
            selectedWireCoreId={state.selectedWireCoreId}
            onSelect={(wireCoreId) => {
              setSourceTerminalId(null);
              state.selectWireCore(wireCoreId);
            }}
          />

          {isLearn ? (
            <InstructionPanel
              instructions={config.instructions}
              currentStep={state.currentStep}
              onStepChange={(step) => store.getState().goToStep(step)}
            />
          ) : (
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4">
              <h3 className="font-semibold text-slate-700 mb-2 text-sm uppercase tracking-wide">
                Task
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {config.description}
              </p>
              <p className="text-xs text-slate-400 mt-2">
                Complete the connections, then press Test.
              </p>
            </div>
          )}

          {isLearn && config.cableGroups.some(g => g.id === 'three_core_cpc') && (
            <p className="text-xs text-amber-800 bg-amber-50 rounded-xl p-3">
              Black and grey should be sleeved brown in a real installation because they are live conductors.
            </p>
          )}

          <div className="mt-auto pt-4 border-t border-slate-200">
            <p className="text-xs text-slate-500 text-center">
              Select a wire, then click a terminal. Click another terminal to complete.
            </p>
            <p className="text-xs text-slate-400 text-center mt-1">
              Click a placed wire to remove it.
            </p>
          </div>
        </div>

        <div className="flex-1 p-4 min-h-[500px]">
          <Canvas
            config={config}
            connections={state.connections}
            selectedWireCoreId={state.selectedWireCoreId}
            sourceTerminalId={sourceTerminalId}
            currentStep={state.currentStep}
            mode={mode}
            lampOn={lampOn}
            onTerminalPointerDown={handleTerminalPointerDown}
            onRemoveConnection={handleRemoveConnection}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </GameShell>
  );
}
