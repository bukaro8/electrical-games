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

      {/* Terminal labels for reference */}
      <text x={-60} y={-2} textAnchor="middle" className="text-[8px] fill-slate-500 font-semibold pointer-events-none">
        COM
      </text>
      <text x={0} y={-2} textAnchor="middle" className="text-[8px] fill-slate-500 font-semibold pointer-events-none">
        L1
      </text>
      <text x={60} y={-2} textAnchor="middle" className="text-[8px] fill-slate-500 font-semibold pointer-events-none">
        L2
      </text>
      <text x={0} y={62} textAnchor="middle" className="text-[8px] fill-slate-500 font-semibold pointer-events-none">
        Earth
      </text>
    </g>
  );
}
