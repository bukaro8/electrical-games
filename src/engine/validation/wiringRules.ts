import type {
  Connection,
  GameConfig,
  WireValidationResult,
  CorrectConnection,
} from '../types';

function findWireCoreLabel(config: GameConfig, wireCoreId: string): string {
  for (const group of config.cableGroups) {
    const core = group.cores.find((c) => c.id === wireCoreId);
    if (core) return core.label;
  }
  return wireCoreId;
}

function findTerminal(config: GameConfig, terminalId: string) {
  for (const component of config.components) {
    const terminal = component.terminals.find((t) => t.id === terminalId);
    if (terminal) return terminal;
  }
  return null;
}

function connectionsMatch(
  userFrom: string,
  userTo: string,
  correct: CorrectConnection
): boolean {
  return (
    (userFrom === correct.from && userTo === correct.to) ||
    (userFrom === correct.to && userTo === correct.from)
  );
}

export function validateWireCore(
  connection: Connection,
  config: GameConfig
): WireValidationResult {
  const fromTerminal = findTerminal(config, connection.from);
  const toTerminal = findTerminal(config, connection.to || '');

  const correctConn = config.correctConnections.find((c) =>
    connectionsMatch(connection.from, connection.to || '', c)
  );

  if (!correctConn) {
    const isOptional = config.optionalConnections?.some((c) =>
      connectionsMatch(connection.from, connection.to || '', c)
    );

    return {
      connection,
      isCorrect: isOptional || false,
      correctWireCoreId: '',
      correctWireLabel: isOptional ? 'Optional' : 'Not expected',
      feedbackMessage: isOptional
        ? 'This connection is optional.'
        : 'This connection is not part of the expected circuit.',
      fromTerminal: fromTerminal!,
      toTerminal: toTerminal!,
    };
  }

  const isCorrect = connection.wireCoreId === correctConn.wireCoreId;
  const correctWireLabel = findWireCoreLabel(config, correctConn.wireCoreId);
  const usedWireLabel = findWireCoreLabel(config, connection.wireCoreId);

  return {
    connection,
    isCorrect,
    correctWireCoreId: correctConn.wireCoreId,
    correctWireLabel,
    feedbackMessage: isCorrect
      ? ''
      : `Wrong wire core. You used ${usedWireLabel} but this connection requires ${correctWireLabel}.`,
    fromTerminal: fromTerminal!,
    toTerminal: toTerminal!,
  };
}

export function getRequiredTerminalIds(
  correctConnections: CorrectConnection[]
): Set<string> {
  const terminals = new Set<string>();
  for (const conn of correctConnections) {
    terminals.add(conn.from);
    terminals.add(conn.to);
  }
  return terminals;
}

export function getConnectedTerminalIds(
  connections: Connection[]
): Set<string> {
  const terminals = new Set<string>();
  for (const conn of connections) {
    if (conn.status === 'placed') {
      terminals.add(conn.from);
      if (conn.to) terminals.add(conn.to);
    }
  }
  return terminals;
}

export function normalizeConnectionKey(from: string, to: string): string {
  return [from, to].sort().join('::');
}

export function getCorrectConnectionKeys(
  correctConnections: CorrectConnection[]
): Set<string> {
  return new Set(
    correctConnections.map((c) => normalizeConnectionKey(c.from, c.to))
  );
}

export function getUserConnectionKeys(connections: Connection[]): Set<string> {
  return new Set(
    connections
      .filter((c) => c.status === 'placed')
      .map((c) => normalizeConnectionKey(c.from, c.to || ''))
  );
}