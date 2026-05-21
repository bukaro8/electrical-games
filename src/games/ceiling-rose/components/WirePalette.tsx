import { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import type { CableGroup, WireCore, ConductorColor } from '@engine/types';

interface WirePaletteProps {
  cableGroups: CableGroup[];
  selectedWireCoreId: string | null;
  onSelect: (wireCoreId: string) => void;
}

const WIRE_COLOR_MAP: Record<ConductorColor, string> = {
  brown: '#8B4513',
  blue: '#1E40AF',
  'green/yellow': '#16A34A',
  grey: '#6B7280',
  black: '#111827',
  red: '#DC2626',
  white: '#F9FAFB',
};

function getColorHex(color: ConductorColor): string {
  return WIRE_COLOR_MAP[color] || '#6B7280';
}

interface DraggableWireCoreProps {
  core: WireCore;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

function DraggableWireCore({ core, isSelected, onSelect }: DraggableWireCoreProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: core.id,
    data: { type: 'wireCore', wireCore: core },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={() => onSelect(core.id)}
      className={`
        flex items-center gap-2 px-3 py-2 rounded-lg cursor-grab active:cursor-grabbing
        transition-all duration-150 border-2
        ${isSelected
          ? 'bg-blue-50 border-blue-400 ring-2 ring-blue-200'
          : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
        }
        ${isDragging ? 'opacity-50 scale-95' : 'opacity-100'}
      `}
    >
      <div
        className="w-4 h-4 rounded-full border border-black/20"
        style={{ backgroundColor: getColorHex(core.color) }}
      />
      <span className={`text-sm font-medium ${isSelected ? 'text-blue-700' : 'text-slate-700'}`}>
        {core.label}
      </span>
      <svg className="w-4 h-4 text-slate-400 ml-auto" fill="currentColor" viewBox="0 0 20 20">
        <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 12zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 18z" />
      </svg>
    </div>
  );
}

interface CableGroupItemProps {
  group: CableGroup;
  selectedWireCoreId: string | null;
  onSelect: (wireCoreId: string) => void;
}

function CableGroupItem({ group, selectedWireCoreId, onSelect }: CableGroupItemProps) {
  const [isExpanded, setIsExpanded] = useState(group.expandByDefault);

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-3 bg-slate-100 hover:bg-slate-200 transition-colors"
      >
        <span className="font-semibold text-slate-800 text-sm">{group.name}</span>
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {group.cores.slice(0, 3).map((core) => (
              <div
                key={core.id}
                className="w-3 h-3 rounded-full border border-black/20"
                style={{ backgroundColor: getColorHex(core.color) }}
              />
            ))}
          </div>
          <svg
            className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {isExpanded && (
        <div className="p-2 space-y-1 bg-white">
          {group.cores.map((core) => (
            <DraggableWireCore
              key={core.id}
              core={core}
              isSelected={selectedWireCoreId === core.id}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function WirePalette({ cableGroups, selectedWireCoreId, onSelect }: WirePaletteProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4">
      <h3 className="font-semibold text-slate-700 mb-3 text-sm uppercase tracking-wide">
        Cable Cores
      </h3>
      <p className="text-xs text-slate-500 mb-3">
        Drag a wire core to a terminal, or click to select then click terminals.
      </p>
      <div className="space-y-2">
        {cableGroups.map((group) => (
          <CableGroupItem
            key={group.id}
            group={group}
            selectedWireCoreId={selectedWireCoreId}
            onSelect={onSelect}
          />
        ))}
      </div>
      {selectedWireCoreId && (
        <div className="mt-3 p-2 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs text-blue-700 font-medium">
            Core selected — click a source terminal to start.
          </p>
        </div>
      )}
    </div>
  );
}
