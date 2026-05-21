import type {
  Connection,
  GameConfig,
  CircuitValidationResult,
} from '../types';
import {
  validateWireCore,
  getCorrectConnectionKeys,
  getUserConnectionKeys,
  getRequiredTerminalIds,
  getConnectedTerminalIds,
} from './wiringRules';

function buildFeedback(
  incorrectConnections: any[],
  missingTerminals: string[],
  feedbackMessages: { correct: string; incomplete: string; incorrect: string }
): string {
  if (incorrectConnections.length === 0 && missingTerminals.length === 0) {
    return feedbackMessages.correct;
  }

  if (missingTerminals.length > 0) {
    return feedbackMessages.incomplete;
  }

  return feedbackMessages.incorrect;
}

export function validateCircuit(
  connections: Connection[],
  config: GameConfig
): CircuitValidationResult {
  const placedConnections = connections.filter((c) => c.status === 'placed');

  // Validate each individual connection
  const results = placedConnections.map((c) => validateWireCore(c, config));
  const incorrectConnections = results.filter((r) => !r.isCorrect);
  const correctCount = results.filter((r) => r.isCorrect).length;

  // Find missing terminals (not yet connected)
  const requiredTerminals = getRequiredTerminalIds(config.correctConnections);
  const connectedTerminals = getConnectedTerminalIds(placedConnections);

  const missingTerminals: string[] = [];
  for (const terminalId of requiredTerminals) {
    if (!connectedTerminals.has(terminalId)) {
      missingTerminals.push(terminalId);
    }
  }

  // Find extra connections (user made connections that aren't in the correct list)
  const correctKeys = getCorrectConnectionKeys(config.correctConnections);
  const userKeys = getUserConnectionKeys(placedConnections);

  const extraConnections: string[] = [];
  for (const key of userKeys) {
    if (!correctKeys.has(key)) {
      const [from, to] = key.split('::');
      extraConnections.push(from);
      extraConnections.push(to);
    }
  }

  // Calculate score
  const basePerWire = 10;
  const bonusForNoErrors = 20;
  const penaltyPerWrong = 5;
  const score = Math.max(
    0,
    correctCount * basePerWire -
      incorrectConnections.length * penaltyPerWrong +
      (incorrectConnections.length === 0 ? bonusForNoErrors : 0)
  );

  // Determine status
  const status: 'correct' | 'incomplete' | 'incorrect' =
    incorrectConnections.length === 0 && missingTerminals.length === 0
      ? 'correct'
      : missingTerminals.length > 0 && incorrectConnections.length === 0
      ? 'incomplete'
      : 'incorrect';

  return {
    status,
    correctCount,
    incorrectConnections,
    missingTerminals,
    extraConnections: [...new Set(extraConnections)],
    score,
    feedback: buildFeedback(
      incorrectConnections,
      missingTerminals,
      config.feedback
    ),
  };
}