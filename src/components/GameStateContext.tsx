import React, { createContext, useContext, useState, useEffect } from 'react';
import { useFocusSession } from './FocusSessionContext';

type GameMode = 'focus' | 'break';

interface GameState {
  mode: GameMode;
  setMode: (mode: GameMode) => void;
}

const GameStateContext = createContext<GameState | undefined>(undefined);

export function GameStateProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<GameMode>('focus');
  const { currentSession } = useFocusSession();

  // Automatically switch mode based on session status
  useEffect(() => {
    if (currentSession?.status === 'break') {
      setMode('break');
    } else if (currentSession?.status === 'focus') {
      setMode('focus');
    }
  }, [currentSession?.status]);

  return (
    <GameStateContext.Provider value={{ mode, setMode }}>
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