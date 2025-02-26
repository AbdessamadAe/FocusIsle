import { createContext, useContext, useState, ReactNode } from 'react';

export type GameMode = 'focus' | 'break';

interface GameState {
  mode: GameMode;
  isLoading: boolean;
  setMode: (mode: GameMode) => void;
  setIsLoading: (loading: boolean) => void;
}

const GameStateContext = createContext<GameState | undefined>(undefined);

export function GameStateProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<GameMode>('focus');
  const [isLoading, setIsLoading] = useState(true);

  return (
    <GameStateContext.Provider
      value={{
        mode,
        isLoading,
        setMode,
        setIsLoading,
      }}
    >
      {children}
    </GameStateContext.Provider>
  );
}

export function useGameState() {
  const context = useContext(GameStateContext);
  if (context === undefined) {
    throw new Error('useGameState must be used within a GameStateProvider');
  }
  return context;
} 