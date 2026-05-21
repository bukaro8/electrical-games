import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
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

export function CeilingRoseGame() {
  const store = useMemo(() => createGameStore(), []);
  const state = store();

  const [config, setConfig] = useState<GameConfig | null>(null);
  const [sourceTerminalId, setSourceTerminalId] = useState<string | null>(null);
  const [mode, setMode] = useState<GameMode>('learn');
  const [lampOn, setLampOn] = useState(false);

  const sourceRef = useRef<{ terminalId: string; wireCoreId: string } | null>(null);

  useEffect(() => {
    fetch('/games/ceiling-rose/data/ceiling-rose-v1.json')
      .then((res) => {
        if (!res.ok) throw new Error('Config not found');
        return res.json();
      })
      .then((data) => {
        setConfig(data);
        store.getState().loadConfig(data);
      })
      .catch((err) => {
        console.error('Failed to load game config:', err);
      });
  }, []);

  const handleTerminalPointerDown = useCallback(
    (terminalId: string) => {
      const sourceState = sourceRef.current;

      if (sourceState === null) {
        const wireCoreId = store.getState().selectedWireCoreId;
        if (wireCoreId === null) return;
        sourceRef.current = { terminalId, wireCoreId };
        setSourceTerminalId(terminalId);
      } else {
        if (terminalId === sourceState.terminalId) return;
        store.getState().addConnection(sourceState.terminalId, terminalId, sourceState.wireCoreId);
        store.getState().clearSelectedWireCore();
        sourceRef.current = null;
        setSourceTerminalId(null);
      }
    },
    []
  );

  const handleCancel = useCallback(() => {
    sourceRef.current = null;
    setSourceTerminalId(null);
    store.getState().clearSelectedWireCore();
  }, []);

  const handleRemoveConnection = useCallback(
    (connectionId: string) => {
      store.getState().removeConnection(connectionId);
    },
    []
  );

  const handleReset = useCallback(() => {
    sourceRef.current = null;
    setSourceTerminalId(null);
    setLampOn(false);
    store.getState().reset();
  }, []);

  const handleTestCircuit = useCallback(() => {
    const s = store.getState();
    const result = s.testCircuit();
    const placed = s.connections.filter(c => c.status === 'placed');

    if (result.status === 'correct') {
      setLampOn(true);
      confetti({
        particleCount: 40,
        spread: 70,
        origin: { y: 0.55 },
        colors: ['#22c55e', '#3b82f6', '#f59e0b', '#f97316'],
        gravity: 0.6,
        startVelocity: 25,
        decay: 0.92,
      });
      setTimeout(() => {
        alert('Correct ✅');
      }, 200);
      return;
    }

    const messages: string[] = [];

    if (result.status === 'incomplete') {
      // Check each correct connection
      if (s.config) {
        for (const correct of s.config.correctConnections) {
          const userHas = placed.some(c =>
            (c.from === correct.from && c.to === correct.to) ||
            (c.from === correct.to && c.to === correct.from)
          );
          if (!userHas) {
            const a = getTerminalDisplayName(correct.from);
            let b = getTerminalDisplayName(correct.to);
            // For V1: L1 or L2 is acceptable
            if (correct.to === 'switch_l1' || correct.from === 'switch_l1') {
              b = 'Switch L1 or L2';
            }
            // Earth continuity
            if (correct.wireCoreId === 'green_yellow_cpc') {
              messages.push('Earth continuity is incomplete.');
            } else {
              messages.push(`${a} is not connected to ${b}.`);
            }
          }
        }
      }
    } else {
      // incorrect — has wrong connections
      for (const incorrect of result.incorrectConnections) {
        const msg = incorrect.feedbackMessage;
        if (msg) messages.push(msg);
      }
      // Also check missing
      if (s.config) {
        for (const correct of s.config.correctConnections) {
          const userHas = placed.some(c =>
            (c.from === correct.from && c.to === correct.to) ||
            (c.from === correct.to && c.to === correct.from)
          );
          if (!userHas) {
            const a = getTerminalDisplayName(correct.from);
            let b = getTerminalDisplayName(correct.to);
            if (correct.to === 'switch_l1' || correct.from === 'switch_l1') {
              b = 'Switch L1 or L2';
            }
            if (correct.wireCoreId === 'green_yellow_cpc') {
              messages.push('Earth continuity is incomplete.');
            } else {
              messages.push(`${a} is not connected to ${b}.`);
            }
          }
        }
      }
    }

    // Extra connections
    for (const extra of result.extraConnections) {
      const name = getTerminalDisplayName(extra);
      if (!messages.some(m => m.includes(name))) {
        messages.push(`${name} is connected but not required for this circuit.`);
      }
    }

    const unique = [...new Set(messages)];
    alert('❌ Incorrect wiring\n\n' + unique.join('\n'));
  }, []);

function getTerminalDisplayName(id: string): string {
  if (id.startsWith('supply_')) {
    const name = id.replace('supply_', '');
    if (name === 'live') return 'Supply Live';
    if (name === 'neutral') return 'Supply Neutral';
    return 'Supply Earth';
  }
  if (id.startsWith('rose_')) {
    const parts = id.replace('rose_', '').split('_');
    if (parts[0] === 'cpc') return 'Ceiling Rose Earth';
    return `Ceiling Rose ${parts[0]}.${parts[1]}`;
  }
  if (id.startsWith('switch_')) {
    const name = id.replace('switch_', '');
    if (name === 'cpc') return 'Switch Earth';
    if (name === 'com') return 'Switch COM';
    return `Switch ${name.toUpperCase()}`;
  }
  if (id.startsWith('lamp_')) {
    const name = id.replace('lamp_', '');
    if (name === 'live') return 'Lamp Live';
    if (name === 'neutral') return 'Lamp Neutral';
    return 'Lamp Earth';
  }
  return id;
}

  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-slate-500">Loading game...</p>
        </div>
      </div>
    );
  }

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
              store.getState().selectWireCore(wireCoreId);
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
                Wire a 1-way switched ceiling rose.
              </p>
              <p className="text-xs text-slate-400 mt-2">
                Connect Supply, Ceiling Rose, Switch, and Lamp correctly, then press Test.
              </p>
            </div>
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
