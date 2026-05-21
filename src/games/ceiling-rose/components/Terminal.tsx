import type { Terminal as TerminalType, ConductorColor } from '@engine/types';
import { WIRE_COLORS } from '@engine/types';

interface TerminalProps {
  terminal: TerminalType;
  isActive: boolean;
  isHighlighted: boolean;
  isConnected: boolean;
  isDimmed: boolean;
  onPointerDown: (terminalId: string) => void;
}

const TERMINAL_RADIUS = 18;
const HIT_RADIUS = 24;

export function Terminal({
  terminal,
  isActive,
  isHighlighted,
  isConnected,
  isDimmed,
  onPointerDown,
}: TerminalProps) {
  const fillColor = WIRE_COLORS[terminal.labelColor as ConductorColor] || '#6B7280';
  const strokeColor = isActive
    ? '#22c55e'
    : isConnected
    ? '#16a34a'
    : isHighlighted
    ? '#f59e0b'
    : '#334155';

  return (
    <g
      transform={`translate(${terminal.localX}, ${terminal.localY})`}
      opacity={isDimmed ? 0.3 : 1}
      className="transition-all duration-300"
    >
      {/* Hit area — captures all pointer events */}
      <circle
        r={HIT_RADIUS}
        fill="transparent"
        stroke="none"
        pointerEvents="all"
        onPointerDown={(e) => {
          e.stopPropagation();
          onPointerDown(terminal.id);
        }}
      />

      {/* Outer pulse ring */}
      {(isActive || isHighlighted) && (
        <circle
          r={TERMINAL_RADIUS + 6}
          fill="none"
          stroke={isActive ? '#22c55e' : '#f59e0b'}
          strokeWidth={2}
          strokeDasharray={isActive ? '4 2' : 'none'}
          opacity={0.6}
          className="animate-pulse"
          pointerEvents="none"
        />
      )}

      {/* Connected ring */}
      {isConnected && !isActive && (
        <circle
          r={TERMINAL_RADIUS + 3}
          fill="none"
          stroke="#16a34a"
          strokeWidth={2}
          opacity={0.5}
          pointerEvents="none"
        />
      )}

      {/* Main terminal circle */}
      <circle
        r={TERMINAL_RADIUS}
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth={2.5}
        className="transition-all duration-150"
        pointerEvents="none"
      />

      {/* Inner highlight */}
      <circle
        r={TERMINAL_RADIUS - 5}
        fill="white"
        opacity={0.15}
        pointerEvents="none"
      />

      {/* Terminal label */}
      <text
        textAnchor="middle"
        dominantBaseline="central"
        className="text-[11px] fill-white font-bold pointer-events-none select-none"
      >
        {getShortLabel(terminal.id)}
      </text>
    </g>
  );
}

function getShortLabel(id: string): string {
  if (id.startsWith('rose_')) {
    const parts = id.replace('rose_', '').split('_');
    if (parts[0] === 'cpc') return 'E';
    return `${parts[0]}.${parts[1]}`;
  }
  if (id.startsWith('supply_')) {
    const t = id.replace('supply_', '');
    if (t === 'live') return 'L';
    if (t === 'neutral') return 'N';
    return 'E';
  }
  if (id.startsWith('switch_') || id.startsWith('s1_') || id.startsWith('s2_')) {
    const prefix = id.startsWith('s1_') ? 's1_' : id.startsWith('s2_') ? 's2_' : 'switch_';
    const t = id.replace(prefix, '');
    if (t === 'com') return 'COM';
    if (t === 'cpc') return 'E';
    return t.toUpperCase();
  }
  if (id.startsWith('lamp_')) {
    const t = id.replace('lamp_', '');
    if (t === 'live') return 'L';
    if (t === 'neutral') return 'N';
    return 'E';
  }
  return id.slice(0, 3);
}

export { TERMINAL_RADIUS, HIT_RADIUS };
