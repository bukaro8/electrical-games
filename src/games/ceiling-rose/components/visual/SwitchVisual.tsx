interface SwitchVisualProps {
  label?: string;
}

export function SwitchVisual({ label }: SwitchVisualProps) {
  return (
    <g>
      {/* Switch body — translucent */}
      <rect
        x={-95}
        y={-65}
        width={190}
        height={125}
        rx={8}
        fill="rgba(241,245,249,0.6)"
        stroke="#475569"
        strokeWidth={2}
      />

      {/* Title */}
      <text
        y={-42}
        textAnchor="middle"
        className="text-[13px] font-bold fill-slate-600"
      >
        {label || 'SWITCH'}
      </text>

      {/* 2-way switch mechanism symbol */}
      <g transform="translate(0, -20)">
        {/* Terminal connection dots */}
        <circle cx={-55} cy={12} r={2.5} fill="#475569" />
        <circle cx={0} cy={0} r={2.5} fill="#475569" />
        <circle cx={55} cy={12} r={2.5} fill="#475569" />

        {/* Lines from terminals to mechanism */}
        <line x1={-55} y1={12} x2={-20} y2={12} stroke="#475569" strokeWidth={1.2} />
        <line x1={55} y1={12} x2={20} y2={12} stroke="#475569" strokeWidth={1.2} />
        <line x1={0} y1={0} x2={0} y2={7} stroke="#475569" strokeWidth={1.2} />

        {/* Switch arm connecting COM to L1 (solid - active) */}
        <line
          x1={-20} y1={12} x2={0} y2={7}
          stroke="#475569" strokeWidth={2} strokeLinecap="round"
        />

        {/* Alternate connection COM to L2 (dashed) */}
        <line
          x1={0} y1={7} x2={20} y2={12}
          stroke="#94a3b8" strokeWidth={1.5} strokeLinecap="round"
          strokeDasharray="3 2"
        />
      </g>

      {/* Terminal labels for reference */}
      <text
        x={-60} y={-2}
        textAnchor="middle"
        className="text-[8px] fill-slate-500 font-semibold pointer-events-none"
      >
        COM
      </text>
      <text
        x={0} y={-2}
        textAnchor="middle"
        className="text-[8px] fill-slate-500 font-semibold pointer-events-none"
      >
        L1
      </text>
      <text
        x={60} y={-2}
        textAnchor="middle"
        className="text-[8px] fill-slate-500 font-semibold pointer-events-none"
      >
        L2
      </text>
      <text
        x={0} y={62}
        textAnchor="middle"
        className="text-[8px] fill-slate-500 font-semibold pointer-events-none"
      >
        Earth
      </text>
    </g>
  );
}
