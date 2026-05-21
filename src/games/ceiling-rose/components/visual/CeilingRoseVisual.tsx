export function CeilingRoseVisual({ label: _label }: { label?: string }) {
  return (
    <g>
      {/* Outer frame — translucent so wires show through */}
      <rect
        x={-120}
        y={-105}
        width={240}
        height={285}
        rx={12}
        fill="rgba(241,245,249,0.6)"
        stroke="#475569"
        strokeWidth={2}
      />

      {/* Title */}
      <text
        y={-82}
        textAnchor="middle"
        className="text-[13px] font-bold fill-slate-600"
      >
        CEILING ROSE
      </text>

      {/* Block 1 — 2 terminals at y=-50 */}
      <rect
        x={-108}
        y={-70}
        width={216}
        height={42}
        rx={6}
        fill="rgba(254,243,199,0.5)"
        stroke="#d97706"
        strokeWidth={1}
      />
      <text x={0} y={-52} textAnchor="middle" className="text-[10px] fill-amber-700 font-bold pointer-events-none">
        BLOCK 1
      </text>
      <text x={0} y={-40} textAnchor="middle" className="text-[7px] fill-amber-600 pointer-events-none">
        Lamp / Switched Live
      </text>

      {/* Block 2 — 3 terminals at y=25 */}
      <rect
        x={-108}
        y={3}
        width={216}
        height={48}
        rx={6}
        fill="rgba(254,226,226,0.5)"
        stroke="#dc2626"
        strokeWidth={1}
      />
      <text x={0} y={22} textAnchor="middle" className="text-[10px] fill-red-700 font-bold pointer-events-none">
        BLOCK 2
      </text>
      <text x={0} y={34} textAnchor="middle" className="text-[7px] fill-red-600 pointer-events-none">
        Permanent Live
      </text>

      {/* Block 3 — 3 terminals at y=90 */}
      <rect
        x={-108}
        y={68}
        width={216}
        height={48}
        rx={6}
        fill="rgba(219,234,254,0.5)"
        stroke="#2563eb"
        strokeWidth={1}
      />
      <text x={0} y={87} textAnchor="middle" className="text-[10px] fill-blue-700 font-bold pointer-events-none">
        BLOCK 3
      </text>
      <text x={0} y={99} textAnchor="middle" className="text-[7px] fill-blue-600 pointer-events-none">
        Neutral
      </text>

      {/* Earth block (terminal at y=135) */}
      <rect
        x={-45}
        y={115}
        width={90}
        height={40}
        rx={6}
        fill="rgba(220,252,231,0.5)"
        stroke="#16a34a"
        strokeWidth={1}
      />
      <text x={0} y={137} textAnchor="middle" className="text-[8px] fill-green-700 font-semibold pointer-events-none">
        Earth
      </text>
    </g>
  );
}
