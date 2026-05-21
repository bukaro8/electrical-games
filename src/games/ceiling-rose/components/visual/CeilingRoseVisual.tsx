export function CeilingRoseVisual({ label: _label }: { label?: string }) {
  return (
    <g>
      {/* Outer circular body */}
      <circle
        cx={0}
        cy={15}
        r={160}
        fill="rgba(241,245,249,0.68)"
        stroke="#475569"
        strokeWidth={2.5}
      />

      {/* Title */}
      <text
        y={-82}
        textAnchor="middle"
        className="text-[13px] font-bold fill-slate-700 pointer-events-none"
      >
        CEILING ROSE
      </text>

      {/* Block 1 */}
      <rect
        x={-78}
        y={-58}
        width={156}
        height={42}
        rx={10}
        fill="rgba(254,243,199,0.82)"
        stroke="#d97706"
        strokeWidth={1.4}
      />
      <text
        x={0}
        y={-5}
        textAnchor="middle"
        className="text-[7.5px] fill-amber-700 font-semibold pointer-events-none"
      >
        Lamp / Switched Live
      </text>

      {/* Block 2 */}
      <rect
        x={-95}
        y={12}
        width={190}
        height={44}
        rx={10}
        fill="rgba(254,226,226,0.82)"
        stroke="#dc2626"
        strokeWidth={1.4}
      />
      <text
        x={0}
        y={68}
        textAnchor="middle"
        className="text-[7.5px] fill-red-700 font-semibold pointer-events-none"
      >
        Permanent Live
      </text>

      {/* Block 3 */}
      <rect
        x={-95}
        y={82}
        width={190}
        height={44}
        rx={10}
        fill="rgba(219,234,254,0.82)"
        stroke="#2563eb"
        strokeWidth={1.4}
      />
      <text
        x={0}
        y={138}
        textAnchor="middle"
        className="text-[7.5px] fill-blue-700 font-semibold pointer-events-none"
      >
        Neutral
      </text>

      {/* Earth area - slightly overlaps circle */}
      <rect
        x={-36}
        y={130}
        width={72}
        height={32}
        rx={10}
        fill="rgba(220,252,231,0.85)"
        stroke="#16a34a"
        strokeWidth={1.4}
      />
      <text
        x={0}
        y={151}
        textAnchor="middle"
        className="text-[8px] fill-green-700 font-bold pointer-events-none"
      >
        EARTH
      </text>
    </g>
  );
}
