const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');

// Compile the actual engine modules in memory using the project's TypeScript dependency.
require.extensions['.ts'] = (module, filename) => {
  const { outputText } = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  });
  module._compile(outputText, filename);
};
const { validateCircuit } = require('../src/engine/validation/circuitValidation.ts');
const { createGameStore } = require('../src/engine/store/useGameStore.ts');
const configs = ['v1', 'v2'].map(v => require(`../src/games/ceiling-rose/data/ceiling-rose-${v}.json`));
const wires = config => config.correctConnections.map((c, i) => ({ ...c, id: String(i), status: 'placed' }));

for (const config of configs) {
  test(`${config.gameId}: complete circuit passes in either direction`, () => {
    for (const connections of [wires(config), wires(config).map(c => ({ ...c, from: c.to, to: c.from }))]) {
      const result = validateCircuit(connections, config);
      assert.equal(result.status, 'correct');
      assert.equal(result.score, config.correctConnections.length * 10 + 20);
    }
  });
  test(`${config.gameId}: removing ANY required wire prevents success`, () => {
    wires(config).forEach((wire, index) => {
      const result = validateCircuit(wires(config).filter((_, i) => i !== index), config);
      assert.equal(result.status, 'incomplete', `${wire.from} -> ${wire.to}`);
      assert.deepEqual(result.missingConnections, [config.correctConnections[index]]);
    });
  });
  test(`${config.gameId}: duplicates cannot improve score`, () => {
    const connections = wires(config);
    const duplicate = { ...connections[0], id: 'duplicate', from: connections[0].to, to: connections[0].from };
    const result = validateCircuit([...connections, duplicate], config);
    assert.equal(result.status, 'incorrect');
    assert.equal(result.correctCount, connections.length);
    assert.ok(result.score < validateCircuit(connections, config).score);
  });
  test(`${config.gameId}: wrong core and extra wires fail; empty circuit scores zero`, () => {
    const connections = wires(config);
    assert.equal(validateCircuit([{ ...connections[0], wireCoreId: 'blue_neutral' }, ...connections.slice(1)], config).status, 'incorrect');
    assert.equal(validateCircuit([...connections, { ...connections[0], id: 'extra', to: 'lamp_neutral' }], config).status, 'incorrect');
    assert.equal(validateCircuit([], config).score, 0);
  });
  test(`${config.gameId}: store rejects duplicates and invalid endpoints, clears success after edits`, () => {
    const store = createGameStore();
    store.getState().loadConfig(config);
    for (const c of wires(config)) store.getState().addConnection(c.from, c.to, c.wireCoreId);
    const first = wires(config)[0];
    store.getState().addConnection(first.to, first.from, first.wireCoreId);
    store.getState().addConnection(first.from, first.from, first.wireCoreId);
    store.getState().addConnection('unknown', first.from, first.wireCoreId);
    assert.equal(store.getState().connections.length, config.correctConnections.length);
    assert.equal(store.getState().testCircuit().status, 'correct');
    store.getState().removeConnection(store.getState().connections[0].id);
    assert.equal(store.getState().gameStatus, 'building');
    assert.equal(store.getState().lastValidationResult, null);
    assert.equal(store.getState().score, 0);
    assert.equal(store.getState().testCircuit().status, 'incomplete');
    store.getState().addConnection(first.from, first.to, first.wireCoreId);
    store.getState().testCircuit();
    store.getState().addConnection('supply_live', 'lamp_neutral', first.wireCoreId);
    assert.equal(store.getState().gameStatus, 'building');
    assert.equal(store.getState().lastValidationResult, null);
    store.getState().reset();
    assert.equal(store.getState().connections.length, 0);
    assert.equal(store.getState().gameStatus, 'building');
  });
}
test('optional wires require the correct core and are not reported as extras', () => {
  const config = { ...configs[0], optionalConnections: [{ from: 'rose_cpc', to: 'lamp_cpc', wireCoreId: 'green_yellow_cpc' }] };
  const optional = { ...config.optionalConnections[0], id: 'optional', status: 'placed' };
  assert.equal(validateCircuit(wires(config), config).status, 'correct');
  const result = validateCircuit([...wires(config), optional], config);
  assert.equal(result.status, 'correct');
  assert.deepEqual(result.extraConnections, []);
  assert.equal(validateCircuit([...wires(config), { ...optional, wireCoreId: 'brown_live' }], config).status, 'incorrect');
});

const { SYMBOLS, makeRound, answerPoints, shuffle } = require('../src/games/symbols/data.ts');
test('symbol rounds contain each question once and four distinct choices with one correct answer', () => {
  assert.equal(new Set(SYMBOLS.map(s => s.id)).size, SYMBOLS.length);
  assert.equal(new Set(SYMBOLS.map(s => s.name)).size, SYMBOLS.length);
  for (let i = 0; i < 20; i++) {
    const round = makeRound();
    assert.equal(round.length, SYMBOLS.length);
    assert.equal(new Set(round.map(r => r.question.id)).size, SYMBOLS.length);
    for (const { question, options } of round) {
      assert.equal(options.length, 4);
      assert.equal(new Set(options.map(o => o.id)).size, 4);
      assert.equal(options.filter(o => o.id === question.id).length, 1);
      assert.ok(question.hint && question.explanation);
    }
  }
});
test('symbol scoring rewards independent answers and cannot reward reveals or errors', () => {
  assert.equal(answerPoints(true, false), 10);
  assert.equal(answerPoints(true, true), 5);
  assert.equal(answerPoints(false, false), 0);
  assert.equal(answerPoints(false, true), 0);
  assert.equal(answerPoints(true, false, true), 0);
  assert.equal(answerPoints(true, true, true), 0);
});
test('review rounds keep only missed questions, still with four options; shuffle preserves input', () => {
  const subset = SYMBOLS.slice(0, 1);
  const round = makeRound(subset);
  assert.equal(round.length, 1);
  assert.equal(round[0].question.id, subset[0].id);
  assert.equal(round[0].options.length, 4);
  const original = [1, 2, 3];
  assert.deepEqual(shuffle(original, () => 0), [2, 3, 1]);
  assert.deepEqual(original, [1, 2, 3]);
});

test('level 2 uses three curated lookalikes for every symbol and for review rounds', () => {
  const { SIMILAR_SYMBOLS } = require('../src/games/symbols/data.ts');
  for (const { question, options } of makeRound(SYMBOLS, 2)) {
    assert.equal(options.length, 4);
    assert.equal(new Set(options.map(o => o.id)).size, 4);
    assert.deepEqual(options.filter(o => o.id !== question.id).map(o => o.id).sort(), [...SIMILAR_SYMBOLS[question.id]].sort());
    assert.equal(options.filter(o => o.id === question.id).length, 1);
  }
  const review = makeRound([SYMBOLS[0]], 2);
  assert.equal(review.length, 1);
  assert.deepEqual(review[0].options.map(o => o.id).sort(), ['one-way', 'two-way', 'intermediate', 'pull'].sort());
});
