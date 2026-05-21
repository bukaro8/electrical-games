export function SupplyVisual({ label: _label }: { label?: string }) {
  return (
    <g>
      {/* Consumer unit enclosure */}
      <rect
        x={-70}
        y={-80}
        width={140}
        height={170}
        rx={12}
        fill="rgba(241,245,249,0.68)"
        stroke="#475569"
        strokeWidth={2.5}
      />

      {/* Title */}
      <text
        y={-56}
        textAnchor="middle"
        className="text-[13px] font-bold fill-slate-700 pointer-events-none"
      >
        SUPPLY
      </text>
      <text
        y={-40}
        textAnchor="middle"
        className="text-[8px] fill-slate-500 pointer-events-none"
      >
        Consumer Unit
      </text>

      {/* Internal guide rail */}
      <line
        x1={-52}
        y1={-20}
        x2={-52}
        y2={68}
        stroke="#64748b"
        strokeWidth={2}
        strokeLinecap="round"
      />

      {/* Live row */}
      <g transform="translate(0, -18)">
        <text
          x={-38}
          y={4}
          textAnchor="middle"
          className="text-[10px] font-bold fill-red-600 pointer-events-none"
        >
          L
        </text>

        <rect
          x={-20}
          y={-16}
          width={14}
          height={32}
          rx={2}
          fill="white"
          stroke="#dc2626"
          strokeWidth={1.4}
        />

        <path
          d="M -16 -12 L -10 -5 L -16 2 L -10 10"
          stroke="#dc2626"
          strokeWidth={1.3}
          fill="none"
          strokeLinecap="round"
        />

        <line
          x1={-52}
          y1={0}
          x2={-24}
          y2={0}
          stroke="#dc2626"
          strokeWidth={1.7}
        />

        <line
          x1={-4}
          y1={0}
          x2={32}
          y2={0}
          stroke="#dc2626"
          strokeWidth={1.7}
        />

        <circle cx={42} cy={0} r={3.5} fill="#dc2626" />
      </g>

      {/* Neutral row */}
      <g transform="translate(0, 25)">
        <text
          x={-38}
          y={4}
          textAnchor="middle"
          className="text-[10px] font-bold fill-blue-600 pointer-events-none"
        >
          N
        </text>

        <line
          x1={-52}
          y1={0}
          x2={-12}
          y2={0}
          stroke="#2563eb"
          strokeWidth={1.7}
        />

        <text
          x={12}
          y={5}
          textAnchor="middle"
          className="text-[14px] font-bold fill-blue-600 pointer-events-none"
        >
          N
        </text>

        <circle cx={42} cy={0} r={3.5} fill="#2563eb" />
      </g>

      {/* Earth row */}
      <g transform="translate(0, 68)">
        <text
          x={-38}
          y={4}
          textAnchor="middle"
          className="text-[10px] font-bold fill-green-600 pointer-events-none"
        >
          E
        </text>

        <line
          x1={-52}
          y1={0}
          x2={-12}
          y2={0}
          stroke="#16a34a"
          strokeWidth={1.7}
        />

        {/* IEC-style earth symbol */}
        <g transform="translate(12, 0)">
          <line
            x1={0}
            y1={-11}
            x2={0}
            y2={9}
            stroke="#16a34a"
            strokeWidth={1.7}
          />
          <line
            x1={-10}
            y1={-3}
            x2={10}
            y2={-3}
            stroke="#16a34a"
            strokeWidth={1.7}
          />
          <line
            x1={-7}
            y1={3}
            x2={7}
            y2={3}
            stroke="#16a34a"
            strokeWidth={1.7}
          />
          <line
            x1={-4}
            y1={9}
            x2={4}
            y2={9}
            stroke="#16a34a"
            strokeWidth={1.7}
          />
        </g>

        <circle cx={42} cy={0} r={3.5} fill="#16a34a" />
      </g>
    </g>
  );
}
