export function SupplyVisual({ label: _label }: { label?: string }) {
  return (
    <g>
      {/* Main box — translucent */}
      <rect
        x={-55}
        y={-65}
        width={110}
        height={140}
        rx={8}
        fill="rgba(241,245,249,0.6)"
        stroke="#475569"
        strokeWidth={2}
      />

      {/* Label */}
      <text
        y={-40}
        textAnchor="middle"
        className="text-[13px] font-bold fill-slate-600"
      >
        SUPPLY
      </text>
      <text
        y={-14}
        textAnchor="middle"
        className="text-[9px] fill-slate-500"
      >
        Consumer Unit
      </text>

      {/* Terminal labels */}
      <text x={80} y={-42} textAnchor="middle" className="text-[8px] fill-slate-500 font-semibold pointer-events-none">
        Live
      </text>
      <text x={80} y={8} textAnchor="middle" className="text-[8px] fill-slate-500 font-semibold pointer-events-none">
        Neut
      </text>
      <text x={80} y={58} textAnchor="middle" className="text-[8px] fill-slate-500 font-semibold pointer-events-none">
        Earth
      </text>
    </g>
  );
}
