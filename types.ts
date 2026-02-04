
export interface Participant {
  id: string;
  name: string;
  isHost: boolean;
  joinedAt: number;
}

export interface GameState {
  sessionId: string;
  numbers: number[];
  currentNumber: number | null;
  participants: Participant[];
  status: 'lobby' | 'playing' | 'ended';
  lastRao?: string;
}

export interface UserContextType {
  currentUser: Participant | null;
  setCurrentUser: (user: Participant | null) => void;
}
