import { useState, useCallback, useEffect } from 'react';
import type { GameConfig, Connection } from '@engine/types';
import { Terminal } from './Terminal';
import { WireLayer } from './WireLayer';
import {
  CeilingRoseVisual,
  SwitchVisual,
  LampVisual,
  SupplyVisual,
} from './visual';

const VISUAL_MAP: Record<string, React.FC<{ label?: string; on?: boolean }>> = {
  ceiling_rose: CeilingRoseVisual,
  switch_2way: SwitchVisual,
  switch_1way: SwitchVisual,
  lamp: LampVisual,
  supply: SupplyVisual,
};

interface CanvasProps {
  config: GameConfig;
  connections: Connection[];
  selectedWireCoreId: string | null;
  sourceTerminalId: string | null;
  currentStep: number;
  mode: 'learn' | 'practice';
  lampOn: boolean;
  onTerminalPointerDown: (terminalId: string) => void;
  onRemoveConnection: (connectionId: string) => void;
  onCancel: () => void;
}

export function Canvas({
  config,
  connections,
  selectedWireCoreId,
  sourceTerminalId,
  currentStep,
  mode,
  lampOn,
  onTerminalPointerDown,
  onRemoveConnection,
  onCancel,
}: CanvasProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const hasPending = sourceTerminalId !== null;

  const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const vb = svg.viewBox.baseVal;
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * vb.width,
      y: ((e.clientY - rect.top) / rect.height) * vb.height,
    });
  }, []);

  const handleSvgClick = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (e.target === e.currentTarget && (hasPending || selectedWireCoreId)) {
        onCancel();
      }
    },
    [hasPending, selectedWireCoreId, onCancel]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && (hasPending || selectedWireCoreId)) {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasPending, selectedWireCoreId, onCancel]);

  const isLearn = mode === 'learn';

  const allWireCores = config.cableGroups.flatMap((g) => g.cores);
  const currentInstruction = config.instructions[currentStep];
  const highlightedTerminals = isLearn ? (currentInstruction?.highlightTerminals || []) : [];

  const connectedTerminalIds = new Set<string>();
  for (const conn of connections) {
    if (conn.status === 'placed') {
      connectedTerminalIds.add(conn.from);
      if (conn.to) connectedTerminalIds.add(conn.to);
    }
  }

  // Build set of dimmed terminals: only in learn mode
  const allTerminalIds = config.components.flatMap(c => c.terminals.map(t => t.id));
  const dimmedTerminalIds = new Set<string>();
  if (isLearn && highlightedTerminals.length > 0) {
    for (const id of allTerminalIds) {
      if (!highlightedTerminals.includes(id) && !connectedTerminalIds.has(id)) {
        dimmedTerminalIds.add(id);
      }
    }
  }

  return (
    <div className="relative flex-1 bg-slate-100 rounded-xl border border-slate-200 overflow-hidden">
      <svg
        viewBox="0 0 1200 750"
        className="w-full h-full"
        onMouseMove={handleMouseMove}
        onClick={handleSvgClick}
        style={{ touchAction: 'none' }}
      >
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e2e8f0" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* 1. Component visuals (behind everything) */}
        {config.components.map((component) => {
          const VisualComponent = VISUAL_MAP[component.componentType];
          return (
            <g
              key={component.id}
              transform={`translate(${component.positionX}, ${component.positionY})`}
            >
              <g pointerEvents="none">
                {VisualComponent && (
                  <VisualComponent
                    label={component.label}
                    on={component.componentType === 'lamp' ? lampOn : undefined}
                  />
                )}
              </g>
            </g>
          );
        })}

        {/* 2. WireLayer (middle — wires visible but behind terminals) */}
        <WireLayer
          connections={connections}
          components={config.components}
          pendingMouseX={mousePos.x}
          pendingMouseY={mousePos.y}
          wireCores={allWireCores}
          onRemoveConnection={onRemoveConnection}
        />

        {/* 3. Terminals (on top — always clickable) */}
        {config.components.map((component) => (
          <g
            key={component.id + '-terminals'}
            transform={`translate(${component.positionX}, ${component.positionY})`}
          >
            {component.terminals.map((terminal) => (
              <Terminal
                key={terminal.id}
                terminal={terminal}
                isActive={sourceTerminalId === terminal.id}
                isHighlighted={highlightedTerminals.includes(terminal.id)}
                isConnected={connectedTerminalIds.has(terminal.id)}
                isDimmed={dimmedTerminalIds.has(terminal.id)}
                onPointerDown={onTerminalPointerDown}
              />
            ))}
          </g>
        ))}
      </svg>

      <div className="absolute bottom-0 left-0 right-0 bg-white/80 backdrop-blur border-t border-slate-200 px-4 py-2 flex items-center justify-between">
        <div className="text-xs text-slate-500">
          {hasPending
            ? 'Click a different terminal to complete. Press ESC or click empty area to cancel.'
            : selectedWireCoreId
            ? 'Click a source terminal to start a connection.'
            : 'Select a wire core, then click a source terminal.'}
        </div>
        <div className="text-xs text-slate-400">
          {connections.filter((c) => c.status === 'placed').length} wires placed
        </div>
      </div>
    </div>
  );
}
