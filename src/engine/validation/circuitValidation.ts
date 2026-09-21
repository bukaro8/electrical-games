import type { Connection, GameConfig, CircuitValidationResult } from '../types';
import { validateWireCore, normalizeConnectionKey } from './wiringRules';

export function validateCircuit(connections: Connection[], config: GameConfig): CircuitValidationResult {
  const placed = connections.filter(c => c.status === 'placed');
  const seen = new Set<string>();
  const results = placed.map(connection => {
    const result = validateWireCore(connection, config);
    const key = normalizeConnectionKey(connection.from, connection.to || '');
    if (seen.has(key)) {
      return { ...result, isCorrect: false, feedbackMessage: 'Duplicate connection. Remove the extra wire.' };
    }
    seen.add(key);
    return result;
  });
  const incorrectConnections = results.filter(r => !r.isCorrect);
  const correctCount = results.filter(r => r.isCorrect).length;
  const missingConnections = config.correctConnections.filter(expected => !placed.some(c =>
    normalizeConnectionKey(c.from, c.to || '') === normalizeConnectionKey(expected.from, expected.to)
    && c.wireCoreId === expected.wireCoreId
  ));
  const missingTerminals = [...new Set(missingConnections.flatMap(c => [c.from, c.to]))];
  const allowed = new Set([...config.correctConnections, ...(config.optionalConnections || [])]
    .map(c => normalizeConnectionKey(c.from, c.to)));
  const extraConnections = [...new Set(placed.filter(c => !allowed.has(normalizeConnectionKey(c.from, c.to || '')))
    .flatMap(c => c.to ? [c.from, c.to] : [c.from]))];
  const status = incorrectConnections.length ? 'incorrect' : missingConnections.length ? 'incomplete' : 'correct';
  const score = Math.max(0, correctCount * 10 - incorrectConnections.length * 5 + (status === 'correct' ? 20 : 0));
  return { status, correctCount, incorrectConnections, missingConnections, missingTerminals,
    extraConnections, score, feedback: config.feedback[status] };
}
