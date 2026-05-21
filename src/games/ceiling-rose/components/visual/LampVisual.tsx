export function LampVisual({ label: _label, on }: { label?: string; on?: boolean }) {
  const isOn = on === true;

  const glassFill = isOn ? '#fef3c7' : 'rgba(226,232,240,0.45)';
  const glassStroke = isOn ? '#f59e0b' : '#94a3b8';
  const filamentGlow = isOn ? '#fbbf24' : '#94a3b8';
  const filamentOpacity = isOn ? 0.95 : 0.35;

  return (
    <g>
      <defs>
        <radialGradient id="bulbGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fef3c7" stopOpacity={isOn ? 0.5 : 0} />
          <stop offset="40%" stopColor="#fde68a" stopOpacity={isOn ? 0.2 : 0} />
          <stop offset="100%" stopColor="#fde68a" stopOpacity={0} />
        </radialGradient>
      </defs>

      {/* Glow aura */}
      <circle cx={0} cy={-38} r={65} fill="url(#bulbGlow)" className={isOn ? 'animate-pulse' : ''} />

      {/* Glass envelope */}
      <path
        d="M -28 -50 C -38 -78 -22 -100 0 -100 C 22 -100 38 -78 28 -50 C 24 -38 22 -28 20 -18 L -20 -18 C -22 -28 -24 -38 -28 -50 Z"
        fill={glassFill}
        stroke={glassStroke}
        strokeWidth={1.5}
      />

      {/* Filament support wires */}
      <line x1={-6} y1={-18} x2={-6} y2={-70} stroke={filamentGlow} strokeWidth={0.8} opacity={filamentOpacity} />
      <line x1={6} y1={-18} x2={6} y2={-70} stroke={filamentGlow} strokeWidth={0.8} opacity={filamentOpacity} />

      {/* Filament coil */}
      <path
        d="M -6 -70 L -4 -65 L 0 -68 L 4 -65 L 6 -70 L 4 -75 L 0 -72 L -4 -75 Z"
        stroke={filamentGlow}
        strokeWidth={isOn ? 1.8 : 1.2}
        fill="none"
        opacity={filamentOpacity}
      />
      <path
        d="M -6 -70 L -4 -76 L 0 -73 L 4 -76 L 6 -70"
        stroke={filamentGlow}
        strokeWidth={isOn ? 1.5 : 0.8}
        fill="none"
        opacity={isOn ? 0.7 : 0.25}
      />

      {/* Screw cap */}
      <rect x={-16} y={-18} width={32} height={8} rx={2} fill="rgba(156,163,175,0.7)" stroke="#64748b" strokeWidth={1} />
      <rect x={-18} y={-10} width={36} height={7} rx={1} fill="rgba(209,213,219,0.7)" stroke="#64748b" strokeWidth={1} />
      <rect x={-18} y={-3} width={36} height={7} rx={1} fill="rgba(209,213,219,0.7)" stroke="#64748b" strokeWidth={1} />
      <rect x={-18} y={4} width={36} height={7} rx={1} fill="rgba(209,213,219,0.7)" stroke="#64748b" strokeWidth={1} />
      <rect x={-16} y={11} width={32} height={8} rx={2} fill="rgba(156,163,175,0.7)" stroke="#64748b" strokeWidth={1} />

      {/* Glass highlight / reflection */}
      <ellipse cx={-10} cy={-75} rx={6} ry={10} fill="white" opacity={isOn ? 0.15 : 0.2} transform="rotate(-15 -10 -75)" />

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
      <text y={98} textAnchor="middle" className="text-[11px] font-bold fill-slate-600">
        LAMP
      </text>
    </g>
  );
}
