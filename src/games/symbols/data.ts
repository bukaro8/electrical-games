export interface SymbolQuestion {
  id: string;
  name: string;
  hint: string;
  explanation: string;
  path?: string;
  circle?: [number, number, number];
  text?: string;
}

// Redrawn from the supplied Unit 203 worksheets. Ambiguous, unlabelled
// symbols are omitted until their worksheet answer key can be confirmed.
export const SYMBOLS: SymbolQuestion[] = [
  { id: 'one-way', name: 'One-way switch', circle: [43, 76, 12], path: 'M51 67 L77 34 L86 40', hint: 'Look for one arm leaving the circle.', explanation: 'The single arm identifies a one-way switch, used to control a circuit from one position.' },
  { id: 'two-way', name: 'Two-way switch', circle: [60, 60, 12], path: 'M68 51 L88 26 L97 32 M52 69 L32 94 L23 88', hint: 'There are two arms on opposite sides of the circle.', explanation: 'A two-way switch can be paired with another two-way switch to control a light from two positions.' },
  { id: 'intermediate', name: 'Intermediate switch', circle: [60, 60, 12], path: 'M51 51 L30 25 L23 30 M69 51 L90 25 L97 30 M51 69 L30 95 L23 90 M69 69 L90 95 L97 90', hint: 'Count the four arms around the central circle.', explanation: 'An intermediate switch is used between two-way switches to add another switching position.' },
  { id: 'pull', name: 'Pull-cord switch', circle: [40, 82, 14], path: 'M49 71 L82 27 L91 34 M82 27 V61 M77 53 L82 62 L87 53', hint: 'The downward arrow suggests how this switch is operated.', explanation: 'The arrow identifies operation by pulling a cord.' },
  { id: 'tube', name: 'Fluorescent light fitting', path: 'M22 60 H98 M22 52 V68 M98 52 V68', hint: 'Its long straight line represents a tubular light source.', explanation: 'The line with short end bars is the worksheet symbol for a fluorescent light fitting.' },
  { id: 'ceiling', name: 'Ceiling light', path: 'M32 32 L88 88 M88 32 L32 88', hint: 'A simple cross marks a lighting point.', explanation: 'The cross marks a ceiling lighting point on an installation plan.' },
  { id: 'wall', name: 'Wall light', path: 'M30 24 V96 M30 34 L88 88 M30 86 L88 32', hint: 'The extra vertical line indicates the mounting surface.', explanation: 'The line beside the lighting cross distinguishes a wall lighting point.' },
  { id: 'socket', name: 'Single switched socket outlet', path: 'M25 94 A35 35 0 0 1 95 94 M60 59 V22 M60 59 L80 27 L99 38', hint: 'Look for a socket arch combined with a switch arm.', explanation: 'The socket outlet arch and switch mark identify a switched socket outlet.' },
  { id: 'double-socket', name: 'Two-gang switched socket outlet', path: 'M25 94 A35 35 0 0 1 95 94 M60 59 V22 M60 59 L80 27 L99 38', text: '2', hint: 'The small number tells you how many outlets it has.', explanation: 'The numeral 2 distinguishes the two-gang switched socket from the single outlet.' },
  { id: 'phone', name: 'Telephone outlet', path: 'M27 91 V57 H83 V91 M55 57 V24', text: 'TP', hint: 'Read the two letters next to the outlet symbol.', explanation: 'TP identifies a telephone connection point.' },
  { id: 'tv', name: 'Television aerial outlet', path: 'M27 91 V57 H83 V91 M55 57 V24', text: 'TV', hint: 'The letters identify the equipment that receives the signal.', explanation: 'TV identifies the television aerial outlet.' },
  { id: 'heat', name: 'Heat detector', path: 'M25 25 H95 V95 H25 Z', circle: [60,60,35], text: 'H', hint: 'The letter refers to the condition this detector senses.', explanation: 'H identifies heat detection on this worksheet.' },
  { id: 'multi-tube', name: 'Multiple-tube fluorescent fitting', path: 'M20 20 H100 V100 H20 Z M30 35 H90 M30 30 V40 M90 30 V40 M30 52 H90 M30 47 V57 M90 47 V57 M30 69 H90 M30 64 V74 M90 64 V74 M30 86 H90 M30 81 V91 M90 81 V91', hint: 'Several tube symbols are grouped inside one enclosure.', explanation: 'The repeated bars represent several fluorescent tubes within one fitting.' },
  { id: 'intake', name: 'Main control / intake point', path: 'M25 25 H95 V95 H25 Z M25 95 L95 25', hint: 'A single diagonal divides the square into two triangles.', explanation: 'This installation-plan symbol marks the main control or intake point.' },
  { id: 'meter', name: 'Electricity energy meter', path: 'M35 18 H85 V102 H35 Z M35 40 H85', text: 'Wh', hint: 'Watt-hours measure energy used over time.', explanation: 'Wh stands for watt-hours, a unit of electrical energy. This is an energy meter.' },
  { id: 'motor', name: 'Electric motor', circle: [60,60,38], text: 'M', hint: 'This device turns electrical energy into movement.', explanation: 'The letter M inside a circle identifies a motor.' },
  { id: 'fan', name: 'Ceiling fan', path: 'M22 22 H98 V98 H22 Z M60 60 C30 25 25 95 60 60 C95 25 90 95 60 60', hint: 'The two curved loops suggest rotating blades.', explanation: 'The blade shape inside a square is labelled ceiling fan on your worksheet.' },
  { id: 'downlight', name: 'Downlight', circle: [49,60,16], path: 'M48 26 A34 34 0 0 0 48 94 M38 49 L60 71 M60 49 L38 71 M76 50 H108 M100 45 L110 50 L100 55 M76 70 H108 M100 65 L110 70 L100 75', hint: 'The arrows show the direction in which the fitting emits light.', explanation: 'The reflector, lamp and directional arrows form the downlight symbol labelled on your worksheet.' },
];

export function shuffle<T>(items: readonly T[], random = Math.random): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
// Closest available worksheet symbols, selected by outline and distinguishing marks.
export const SIMILAR_SYMBOLS: Record<string, string[]> = {
  'one-way': ['two-way', 'intermediate', 'pull'],
  'two-way': ['one-way', 'intermediate', 'pull'],
  intermediate: ['two-way', 'one-way', 'pull'],
  pull: ['one-way', 'two-way', 'intermediate'],
  socket: ['double-socket', 'phone', 'tv'],
  'double-socket': ['socket', 'phone', 'tv'],
  phone: ['tv', 'socket', 'double-socket'],
  tv: ['phone', 'socket', 'double-socket'],
  ceiling: ['wall', 'downlight', 'tube'],
  wall: ['ceiling', 'downlight', 'tube'],
  downlight: ['ceiling', 'wall', 'motor'],
  tube: ['multi-tube', 'ceiling', 'wall'],
  'multi-tube': ['tube', 'intake', 'meter'],
  intake: ['multi-tube', 'fan', 'heat'],
  heat: ['motor', 'fan', 'meter'],
  motor: ['heat', 'downlight', 'fan'],
  fan: ['heat', 'intake', 'motor'],
  meter: ['heat', 'intake', 'multi-tube'],
};
export function makeRound(questions = SYMBOLS, level: 1 | 2 = 1) {
  return shuffle(questions).map(question => ({ question, options: shuffle([
    question, ...(level === 2
      ? SIMILAR_SYMBOLS[question.id].map(id => SYMBOLS.find(s => s.id === id)!)
      : shuffle(SYMBOLS.filter(s => s.id !== question.id)).slice(0, 3)),
  ]) }));
}
export function answerPoints(correct: boolean, hintUsed: boolean, revealed = false) {
  return !correct || revealed ? 0 : hintUsed ? 5 : 10;
}
