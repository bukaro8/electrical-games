import type { Connection, Component, WireCore, ConductorColor } from '@engine/types';
import { WIRE_COLORS } from '@engine/types';

interface WireLayerProps {
  connections: Connection[];
  components: Component[];
  pendingMouseX: number;
  pendingMouseY: number;
  wireCores: WireCore[];
  onRemoveConnection: (connectionId: string) => void;
}

function getTerminalPosition(
  componentId: string,
  terminalId: string,
  components: Component[]
): { x: number; y: number } | null {
  for (const comp of components) {
    if (comp.id !== componentId) continue;
    for (const term of comp.terminals) {
      if (term.id === terminalId) {
        return {
          x: comp.positionX + term.localX,
          y: comp.positionY + term.localY,
        };
      }
    }
  }
  return null;
}

function getWireColor(wireCoreId: string, wireCores: WireCore[]): string {
  const core = wireCores.find((c) => c.id === wireCoreId);
  return core ? WIRE_COLORS[core.color as ConductorColor] : '#6B7280';
}

// Create a smooth bezier curve path between two points
function createWirePath(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): string {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const controlOffset = Math.min(Math.max(dist * 0.4, 50), 120);

  if (Math.abs(dx) > Math.abs(dy)) {
    // Horizontal-ish — curve vertically
    const cy1 = dy > 0 ? y1 + controlOffset : y1 - controlOffset;
    const cy2 = dy > 0 ? y2 - controlOffset : y2 + controlOffset;
    return `M ${x1} ${y1} C ${x1} ${cy1}, ${x2} ${cy2}, ${x2} ${y2}`;
  } else {
    // Vertical-ish — curve horizontally
    const cx1 = dx > 0 ? x1 + controlOffset : x1 - controlOffset;
    const cx2 = dx > 0 ? x2 - controlOffset : x2 + controlOffset;
    return `M ${x1} ${y1} C ${cx1} ${y1}, ${cx2} ${y2}, ${x2} ${y2}`;
  }
}

export function WireLayer({
  connections,
  components,
  pendingMouseX,
  pendingMouseY,
  wireCores,
  onRemoveConnection,
}: WireLayerProps) {
  return (
    <g className="wire-layer">
      {/* Placed connections */}
      {connections
        .filter((c) => c.status === 'placed')
        .map((connection) => {
          const fromPos = getTerminalPosition(
            components.find((c) =>
              c.terminals.some((t) => t.id === connection.from)
            )?.id || '',
            connection.from,
            components
          );
          const toPos = connection.to
            ? getTerminalPosition(
                components.find((c) =>
                  c.terminals.some((t) => t.id === connection.to)
                )?.id || '',
                connection.to,
                components
              )
            : null;

          if (!fromPos || !toPos) return null;

          const wireColor = getWireColor(connection.wireCoreId, wireCores);
          const path = createWirePath(fromPos.x, fromPos.y, toPos.x, toPos.y);

          return (
            <g
              key={connection.id}
              onClick={() => onRemoveConnection(connection.id)}
              className="cursor-pointer group"
            >
              {/* Wire shadow */}
              <path
                d={path}
                stroke="rgba(0,0,0,0.15)"
                strokeWidth={5}
                fill="none"
                transform="translate(1, 1)"
                strokeLinecap="round"
              />
              {/* Main wire */}
              <path
                d={path}
                stroke={wireColor}
                strokeWidth={4}
                fill="none"
                strokeLinecap="round"
                className="transition-all duration-200 group-hover:stroke-[5]"
              />
              {/* Hover highlight */}
              <path
                d={path}
                stroke="transparent"
                strokeWidth={12}
                fill="none"
                className="group-hover:stroke-blue-400/30"
              />
              {/* End caps */}
              <circle
                cx={fromPos.x}
                cy={fromPos.y}
                r={5}
                fill={wireColor}
                stroke="white"
                strokeWidth={1}
              />
              <circle
                cx={toPos.x}
                cy={toPos.y}
                r={5}
                fill={wireColor}
                stroke="white"
                strokeWidth={1}
              />
            </g>
          );
        })}

      {/* Pending connection (wire following cursor) */}
      {connections
        .filter((c) => c.status === 'pending')
        .map((connection) => {
          const fromPos = getTerminalPosition(
            components.find((c) =>
              c.terminals.some((t) => t.id === connection.from)
            )?.id || '',
            connection.from,
            components
          );

          if (!fromPos) return null;

          const wireColor = getWireColor(connection.wireCoreId, wireCores);
          const path = createWirePath(
            fromPos.x,
            fromPos.y,
            pendingMouseX,
            pendingMouseY
          );

          return (
            <g key={connection.id}>
              {/* Dashed preview wire */}
              <path
                d={path}
                stroke={wireColor}
                strokeWidth={3}
                fill="none"
                strokeLinecap="round"
                strokeDasharray="8 4"
                opacity={0.8}
              />
              {/* End cap at source */}
              <circle
                cx={fromPos.x}
                cy={fromPos.y}
                r={5}
                fill={wireColor}
                stroke="white"
                strokeWidth={1}
              />
              {/* Moving end cap */}
              <circle
                cx={pendingMouseX}
                cy={pendingMouseY}
                r={5}
                fill={wireColor}
                stroke="white"
                strokeWidth={1}
              />
            </g>
          );
        })}
    </g>
  );
}