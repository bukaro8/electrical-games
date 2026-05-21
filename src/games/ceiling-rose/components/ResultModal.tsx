import { Button } from '@components/Button';
import type { CircuitValidationResult } from '@engine/types';

interface ResultModalProps {
  result: CircuitValidationResult;
  onClose: () => void;
  onRetry: () => void;
}

export function ResultModal({ result, onClose, onRetry }: ResultModalProps) {
  const isCorrect = result.status === 'correct';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
        <div className={`mx-auto mb-4 w-16 h-16 rounded-full flex items-center justify-center ${isCorrect ? 'bg-green-100' : 'bg-red-100'}`}>
          {isCorrect ? (
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </div>

        <h2 className={`text-xl font-bold text-center mb-2 ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
          {isCorrect ? 'Circuit Correct!' : 'Circuit Incorrect'}
        </h2>

        <div className="text-center mb-4">
          <div className="text-4xl font-bold text-slate-900">{result.score}</div>
          <div className="text-sm text-slate-500">points</div>
        </div>

        <div className={`p-4 rounded-xl mb-4 ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <p className={`text-sm ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
            {result.feedback}
          </p>
        </div>

        {!isCorrect && result.incorrectConnections.length > 0 && (
          <div className="mb-4 space-y-2">
            <h4 className="text-sm font-semibold text-slate-600">Issues found:</h4>
            {result.incorrectConnections.map((issue) => (
              <div key={issue.connection.id} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">
                  <span className="font-medium">
                    {issue.fromTerminal.label} → {issue.toTerminal.label}
                  </span>
                  <br />
                  {issue.feedbackMessage}
                </p>
              </div>
            ))}
            {result.missingTerminals.length > 0 && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-700">
                  <span className="font-medium">Missing connections: </span>
                  {result.missingTerminals.join(', ')}
                </p>
              </div>
            )}
          </div>
        )}

        <div className="flex gap-3">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Keep Working
          </Button>
          <Button variant="primary" onClick={onRetry} className="flex-1">
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
}