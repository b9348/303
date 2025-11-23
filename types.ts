
export interface Choice {
  id: string;
  text: string;
  nextSceneId: string;
  requiredItem?: string; // Item needed to see/choose this
  hideIfItem?: string; // Hide if item is in inventory
  requiredSanity?: number; // Minimum sanity to choose this
  sanityCost?: number; // Cost to sanity
  getItem?: string; // Item gained
  requiredFlag?: string; // Show only if flag is true
  hideIfFlag?: string; // Hide if flag is true
  effect?: (state: GameState) => Partial<GameState>; // Custom effect
  type?: 'normal' | 'danger' | 'investigate' | 'end';
}

export interface Scene {
  id: string;
  title?: string; // Added for gallery
  text: string;
  choices: Choice[];
  backgroundStyle?: string; // CSS class for background nuance
  soundCue?: string; // Text description of sound
  visualEffect?: 'shake' | 'glitch' | 'flicker' | 'none';
  imagePrompt?: string; // For placeholder image visualization
  endingType?: 'bad' | 'good' | 'true';
  effect?: (state: GameState) => Partial<GameState>; // Custom effect on scene enter
}

export interface GameState {
  currentSceneId: string;
  sanity: number; // 0-100
  inventory: string[];
  flags: Record<string, boolean>;
  history: string[]; // Log of scene IDs visited
  isGameOver: boolean;
}

export const getInitialState = (): GameState => ({
  currentSceneId: 'start',
  sanity: 100,
  inventory: [],
  flags: {},
  history: [],
  isGameOver: false,
});
