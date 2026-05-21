// SVG visual for a 1-gang 2-way light switch (V2)
export function Switch2WayVisual({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Switch body */}
      <rect
        x={-40}
        y={-30}
        width={80}
        height={60}
        rx={6}
        fill="#f8fafc"
        stroke="#334155"
        strokeWidth={2}
      />
      {/* Switch plate */}
      <rect
        x={-28}
        y={-18}
        width={56}
        height={36}
        rx={4}
        fill="#e2e8f0"
        stroke="#475569"
        strokeWidth={1.5}
      />
      {/* Toggle indicators */}
      <rect x={-18} y={-8} width={12} height={16} rx={2} fill="#94a3b8" />
      <rect x={6} y={-8} width={12} height={16} rx={2} fill="#94a3b8" />
      {/* 2-way label */}
      <text
        y={28}
        textAnchor="middle"
        className="text-[10px] fill-slate-500 font-medium"
      >
        2-WAY
      </text>
    </g>
  );
}