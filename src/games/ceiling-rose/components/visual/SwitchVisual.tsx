interface SwitchVisualProps {
  label?: string;
}

export function SwitchVisual({ label }: SwitchVisualProps) {
  return (
    <g>
      {/* Switch body */}
      <rect
        x={-115}
        y={-78}
        width={230}
        height={155}
        rx={12}
        fill="rgba(241,245,249,0.68)"
        stroke="#475569"
        strokeWidth={2.5}
      />

      {/* Title */}
      <text
        y={-54}
        textAnchor="middle"
        className="text-[13px] font-bold fill-slate-700 pointer-events-none"
      >
        {label || "SWITCH"}
      </text>

      {/* Terminal labels */}
      <text
        x={-65}
        y={-18}
        textAnchor="middle"
        className="text-[8px] fill-slate-500 font-semibold pointer-events-none"
      >
        COM
      </text>
      <text
        x={0}
        y={-18}
        textAnchor="middle"
        className="text-[8px] fill-slate-500 font-semibold pointer-events-none"
      >
        L1
      </text>
      <text
        x={65}
        y={-18}
        textAnchor="middle"
        className="text-[8px] fill-slate-500 font-semibold pointer-events-none"
      >
        L2
      </text>

      {/* 2-way switch mechanism symbol, below terminals */}
      <g transform="translate(0, 12)">
        <circle cx={-65} cy={0} r={2.5} fill="#475569" />
        <circle cx={0} cy={-12} r={2.5} fill="#475569" />
        <circle cx={65} cy={0} r={2.5} fill="#475569" />

        <line
          x1={-65}
          y1={0}
          x2={-28}
          y2={0}
          stroke="#475569"
          strokeWidth={1.3}
        />
        <line
          x1={65}
          y1={0}
          x2={28}
          y2={0}
          stroke="#475569"
          strokeWidth={1.3}
        />
        <line
          x1={0}
          y1={-12}
          x2={0}
          y2={-4}
          stroke="#475569"
          strokeWidth={1.3}
        />

        <line
          x1={-28}
          y1={0}
          x2={0}
          y2={-4}
          stroke="#475569"
          strokeWidth={2}
          strokeLinecap="round"
        />

        <line
          x1={0}
          y1={-4}
          x2={28}
          y2={0}
          stroke="#94a3b8"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeDasharray="3 2"
        />
      </g>

      {/* Earth label */}
      <text
        x={0}
        y={69}
        textAnchor="middle"
        className="text-[8px] fill-slate-500 font-semibold pointer-events-none"
      >
        Earth
      </text>
    </g>
  );
}
