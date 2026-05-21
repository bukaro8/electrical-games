import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { GameConfig, GameState, Connection, CircuitValidationResult } from '../types';
import { validateCircuit } from '../validation/circuitValidation';

function generateId(): string {
  return Math.random().toString(36).slice(2, 11);
}

export interface GameStore extends GameState {
  loadConfig: (config: GameConfig) => void;
  selectWireCore: (wireCoreId: string | null) => void;
  clearSelectedWireCore: () => void;
  selectActiveTerminal: (terminalId: string | null) => void;
  addConnection: (from: string, to: string, wireCoreId: string) => void;
  removeConnection: (connectionId: string) => void;
  advanceStep: () => void;
  goToStep: (step: number) => void;
  testCircuit: () => CircuitValidationResult;
  reset: () => void;
}

const initialState: GameState = {
  config: null,
  connections: [],
  selectedWireCoreId: null,
  activeTerminalId: null,
  currentStep: 0,
  score: 0,
  attempts: 0,
  gameStatus: 'idle',
  lastValidationResult: null,
};

export function createGameStore() {
  return create<GameStore>()(
    devtools(
      (set, get) => ({
        ...initialState,

        loadConfig: (config) => {
          set({
            config,
            connections: [],
            selectedWireCoreId: null,
            activeTerminalId: null,
            currentStep: 0,
            score: 0,
            attempts: 0,
            gameStatus: 'building',
            lastValidationResult: null,
          });
        },

        selectWireCore: (wireCoreId) => {
          set({ selectedWireCoreId: wireCoreId });
        },

        clearSelectedWireCore: () => {
          set({ selectedWireCoreId: null });
        },

        selectActiveTerminal: (terminalId) => {
          set({ activeTerminalId: terminalId });
        },

        addConnection: (from, to, wireCoreId) => {
          const connection: Connection = {
            id: generateId(),
            from,
            to,
            wireCoreId,
            status: 'placed',
          };
          set((state) => ({
            connections: [...state.connections, connection],
          }));
        },

        removeConnection: (connectionId) => {
          set((state) => ({
            connections: state.connections.filter((c) => c.id !== connectionId),
          }));
        },

        advanceStep: () => {
          const { currentStep, config } = get();
          if (!config) return;
          if (currentStep < config.instructions.length - 1) {
            set({ currentStep: currentStep + 1 });
          }
        },

        goToStep: (step) => {
          const { config } = get();
          if (!config) return;
          if (step >= 0 && step < config.instructions.length) {
            set({ currentStep: step });
          }
        },

        testCircuit: () => {
          const { connections, config } = get();
          if (!config) {
            return {
              status: 'incorrect' as const,
              correctCount: 0,
              incorrectConnections: [],
              missingTerminals: [],
              extraConnections: [],
              score: 0,
              feedback: 'No game configuration loaded.',
            };
          }

          const result = validateCircuit(connections, config);

          set((state) => ({
            attempts: state.attempts + 1,
            score: result.score,
            gameStatus: result.status === 'correct' ? 'complete' : 'building',
            lastValidationResult: result,
          }));

          return result;
        },

        reset: () => {
          set((state) => ({
            ...initialState,
            config: state.config,
          }));
        },
      }),
      { name: 'game-store' }
    )
  );
}
