import type { Instruction } from '@engine/types';

interface InstructionPanelProps {
  instructions: Instruction[];
  currentStep: number;
  onStepChange: (step: number) => void;
}

export function InstructionPanel({ instructions, currentStep, onStepChange }: InstructionPanelProps) {
  const current = instructions[currentStep];

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-slate-700 text-sm uppercase tracking-wide">
          Instructions
        </h3>
        <span className="text-xs text-slate-500">
          Step {currentStep + 1} of {instructions.length}
        </span>
      </div>

      {/* Current step */}
      <div className="mb-4">
        <p className="text-slate-800 text-sm leading-relaxed">{current?.text}</p>
      </div>

      {/* Step indicator dots */}
      <div className="flex items-center gap-1.5">
        {instructions.map((_, index) => (
          <button
            key={index}
            onClick={() => onStepChange(index)}
            className={`
              w-2.5 h-2.5 rounded-full transition-all duration-200
              ${index === currentStep
                ? 'bg-blue-600 w-6'
                : index < currentStep
                ? 'bg-blue-400 hover:bg-blue-500'
                : 'bg-slate-300 hover:bg-slate-400'
              }
            `}
            aria-label={`Go to step ${index + 1}`}
          />
        ))}
      </div>

      {/* Previous / Next buttons */}
      <div className="flex gap-2 mt-4">
        <button
          onClick={() => onStepChange(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
          className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-sm rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </button>
        <button
          onClick={() => onStepChange(Math.min(instructions.length - 1, currentStep + 1))}
          disabled={currentStep === instructions.length - 1}
          className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-sm rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Next
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}