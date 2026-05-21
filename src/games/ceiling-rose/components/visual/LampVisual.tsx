export function LampVisual({ label: _label }: { label?: string }) {
  return (
    <g>
      {/* Bulb */}
      <ellipse
        cx={0}
        cy={-35}
        rx={32}
        ry={38}
        fill="rgba(254,243,199,0.5)"
        stroke="#f59e0b"
        strokeWidth={2}
      />
      {/* Filament */}
      <path
        d="M -14 -35 Q 0 -58 14 -35"
        stroke="#f59e0b"
        strokeWidth={1.5}
        fill="none"
        opacity={0.5}
      />

      {/* Lamp holder */}
      <rect
        x={-22}
        y={6}
        width={44}
        height={20}
        rx={4}
        fill="rgba(226,232,240,0.6)"
        stroke="#475569"
        strokeWidth={1.5}
      />

      {/* Terminal labels */}
      <text x={-70} y={-42} textAnchor="middle" className="text-[8px] fill-slate-500 font-semibold pointer-events-none">
        Live
      </text>
      <text x={-70} y={8} textAnchor="middle" className="text-[8px] fill-slate-500 font-semibold pointer-events-none">
        Neut
      </text>
      <text x={-70} y={58} textAnchor="middle" className="text-[8px] fill-slate-500 font-semibold pointer-events-none">
        Earth
      </text>

      {/* Label */}
      <text
        y={98}
        textAnchor="middle"
        className="text-[11px] font-bold fill-slate-600"
      >
        LAMP
      </text>
    </g>
  );
}
