export function SupplyVisual({ label: _label }: { label?: string }) {
  return (
    <g>
      {/* Consumer unit enclosure */}
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
      <text y={-40} textAnchor="middle" className="text-[13px] font-bold fill-slate-600">
        SUPPLY
      </text>
      <text y={-14} textAnchor="middle" className="text-[9px] fill-slate-500">
        Consumer Unit
      </text>

      {/* DIN rail / busbar */}
      <line x1={-42} y1={-20} x2={-42} y2={62} stroke="#64748b" strokeWidth={2} strokeLinecap="round" />

      {/* Live circuit: MCB with overload symbol */}
      <line x1={-42} y1={-45} x2={-18} y2={-45} stroke="#dc2626" strokeWidth={1.5} />
      <rect x={-20} y={-50} width={13} height={18} rx={2} fill="white" stroke="#dc2626" strokeWidth={1} />
      <path d="M -16 -50 L -12 -45 L -16 -40 L -12 -35" stroke="#dc2626" strokeWidth={1.2} fill="none" strokeLinecap="round" />
      <line x1={-7} y1={-45} x2={15} y2={-45} stroke="#dc2626" strokeWidth={1.5} />
      {/* Live test point dot */}
      <circle cx={25} cy={-45} r={3} fill="#dc2626" />

      {/* Neutral: N symbol with busbar connection */}
      <line x1={-42} y1={5} x2={-8} y2={5} stroke="#2563eb" strokeWidth={1.5} />
      <text x={8} y={9} textAnchor="middle" className="text-[12px] font-bold fill-blue-600">N</text>
      <circle cx={25} cy={5} r={3} fill="#2563eb" />

      {/* Earth: IEC earth symbol */}
      <line x1={-42} y1={55} x2={-8} y2={55} stroke="#16a34a" strokeWidth={1.5} />
      <g transform="translate(8, 55)">
        <line x1={0} y1={-8} x2={0} y2={8} stroke="#16a34a" strokeWidth={1.5} />
        <line x1={-8} y1={-2} x2={8} y2={-2} stroke="#16a34a" strokeWidth={1.5} />
        <line x1={-5} y1={3} x2={5} y2={3} stroke="#16a34a" strokeWidth={1.5} />
        <line x1={-3} y1={8} x2={3} y2={8} stroke="#16a34a" strokeWidth={1.5} />
      </g>
      <circle cx={25} cy={55} r={3} fill="#16a34a" />

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
