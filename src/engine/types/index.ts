// ============================================================
// CORE TYPES — Shared across all games (V1 and future games)
// ============================================================

// UK electrical wire conductor colours
export type ConductorColor =
  | 'brown'
  | 'blue'
  | 'green/yellow'
  | 'grey'
  | 'black'
  | 'red'
  | 'white';

// Electrical role of a terminal
export type PortType =
  | 'live'          // permanent live (brown)
  | 'neutral'       // neutral (blue)
  | 'switched_live' // switched live, e.g. from switch L1 (blue sleeved brown)
  | 'earth'         // earth terminal
  | 'cpc'           // circuit protective conductor (green/yellow)
  | 'com'           // switch common terminal
  | 'L1'            // switch L1 terminal (strapper)
  | 'L2'            // switch L2 terminal (strapper)
  | 'lamp_l'        // lamp live terminal
  | 'lamp_n'        // lamp neutral terminal
  | 'spare';        // unused/spare terminal

// Type of physical component in a circuit
export type ComponentType =
  | 'supply'        // consumer unit / power source
  | 'ceiling_rose'  // ceiling rose / light fitting
  | 'switch_1way'   // 1-gang 1-way light switch
  | 'switch_2way'   // 1-gang 2-way light switch
  | 'lamp'          // lamp holder / luminaire
  | 'junction_box'  // junction box
  | 'socket';       // ring main socket (future games)

// ============================================================
// TERMINAL
// A single connection point on a component
// ============================================================
export interface Terminal {
  id: string;
  label: string;
  labelColor: ConductorColor;
  portType: PortType;
  localX: number;
  localY: number;
}

// ============================================================
// COMPONENT
// A physical device in the circuit (switch, rose, lamp, etc.)
// ============================================================
export interface Component {
  id: string;
  componentType: ComponentType;
  label: string;
  positionX: number;
  positionY: number;
  terminals: Terminal[];
}

// ============================================================
// WIRE CORE
// A single conductor in the palette — the draggable item
// ============================================================
export interface WireCore {
  id: string;
  color: ConductorColor;
  label: string;
  defaultPortRole: PortType;
  compatiblePorts: PortType[];
}

// ============================================================
// CABLE GROUP
// A cable type that groups cores (e.g. Twin & Earth, 3-Core & Earth)
// ============================================================
export interface CableGroup {
  id: string;
  name: string;
  expandByDefault: boolean;
  cores: WireCore[];
}

// ============================================================
// CONNECTION
// A placed wire connecting two terminals
// ============================================================
export interface Connection {
  id: string;
  from: string;           // source terminal id
  to: string | null;      // null = pending (wire in progress)
  wireCoreId: string;     // which wire core was selected
  status: 'pending' | 'placed';
}

// ============================================================
// CORRECT CONNECTION
// The expected answer for a single wire in the circuit
// ============================================================
export interface CorrectConnection {
  from: string;
  to: string;
  wireCoreId: string;
}

// ============================================================
// INSTRUCTION STEP
// Step-by-step guidance for the learner
// ============================================================
export interface Instruction {
  step: number;
  text: string;
  highlightTerminals: string[];
}

// ============================================================
// FEEDBACK MESSAGES
// Human-readable feedback after testing
// ============================================================
export interface FeedbackMessages {
  correct: string;
  incomplete: string;
  incorrect: string;
}

// ============================================================
// GAME CONFIG
// The complete configuration for a game level (JSON file)
// ============================================================
export interface GameConfig {
  gameId: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  components: Component[];
  cableGroups: CableGroup[];
  correctConnections: CorrectConnection[];
  optionalConnections?: CorrectConnection[];
  instructions: Instruction[];
  feedback: FeedbackMessages;
}

// ============================================================
// GAME CATALOG ENTRY
// Metadata for the home screen game selection
// ============================================================
export interface GameEntry {
  gameId: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  thumbnail?: string;
  route: string;
}

// ============================================================
// VALIDATION TYPES
// Results from the circuit validation engine
// ============================================================
export interface WireValidationResult {
  connection: Connection;
  isCorrect: boolean;
  correctWireCoreId: string;
  correctWireLabel: string;
  feedbackMessage: string;
  fromTerminal: Terminal;
  toTerminal: Terminal;
}

export interface CircuitValidationResult {
  status: 'correct' | 'incomplete' | 'incorrect';
  correctCount: number;
  incorrectConnections: WireValidationResult[];
  missingTerminals: string[];
  extraConnections: string[];
  score: number;
  feedback: string;
}

// ============================================================
// GAME STATE
// The full state of a game in progress
// ============================================================
export interface GameState {
  config: GameConfig | null;
  connections: Connection[];
  selectedWireCoreId: string | null;
  activeTerminalId: string | null;
  currentStep: number;
  score: number;
  attempts: number;
  gameStatus: 'idle' | 'building' | 'checking' | 'complete';
  lastValidationResult: CircuitValidationResult | null;
}

// ============================================================
// WIRE COLOR MAP
// Maps conductor colors to CSS hex values for SVG rendering
// ============================================================
export const WIRE_COLORS: Record<ConductorColor, string> = {
  brown: '#8B4513',
  blue: '#1E40AF',
  'green/yellow': '#16A34A',
  grey: '#6B7280',
  black: '#111827',
  red: '#DC2626',
  white: '#F9FAFB',
};

export const WIRE_COLOR_LABELS: Record<ConductorColor, string> = {
  brown: 'Brown',
  blue: 'Blue',
  'green/yellow': 'Green/Yellow',
  grey: 'Grey',
  black: 'Black',
  red: 'Red',
  white: 'White',
};

// ============================================================
// PORT TYPE LABELS
// Human-readable labels for electrical roles
// ============================================================
export const PORT_TYPE_LABELS: Record<PortType, string> = {
  live: 'Live',
  neutral: 'Neutral',
  switched_live: 'Switched Live',
  earth: 'Earth',
  cpc: 'CPC (Earth)',
  com: 'COM',
  L1: 'L1',
  L2: 'L2',
  lamp_l: 'Lamp Live',
  lamp_n: 'Lamp Neutral',
  spare: 'Spare',
};