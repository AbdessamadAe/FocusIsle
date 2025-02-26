import { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stats } from '@react-three/drei';
import { Vector3 } from 'three';
import { Character } from './Character';
import { IslandEnvironment } from './IslandEnvironment';
import { CameraController } from './CameraController';
import { GameStateProvider, useGameState } from './GameStateContext';
import { Loader } from './Loader';

function Scene() {
  const { mode, setIsLoading } = useGameState();
  const [characterPosition, setCharacterPosition] = useState(new Vector3(0, 0, 0));

  const handleCharacterPositionUpdate = (position: Vector3) => {
    setCharacterPosition(position.clone());
  };

  return (
    <>
      <CameraController   
        target={characterPosition}
        distance={mode === 'focus' ? 15 : 8}
      />
      
      <IslandEnvironment position={[0, -2, 0]} scale={2} />
      
      <Character
        position={[0, 0, 0]}
        scale={1}
        onPositionUpdate={handleCharacterPositionUpdate}
      />
    </>
  );
}

function ModeToggleButton() {
  const { mode, setMode } = useGameState();
  
  return (
    <button
      style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        padding: '10px 20px',
        borderRadius: '8px',
        border: 'none',
        backgroundColor: '#4CAF50',
        color: 'white',
        cursor: 'pointer',
        fontSize: '16px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
      }}
      onClick={() => setMode(mode === 'focus' ? 'break' : 'focus')}
    >
      {mode === 'focus' ? '🧘 Focus Mode' : '🕹️ Break Mode'}
    </button>
  );
}

export function MainScene() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <GameStateProvider>
        <Canvas
          shadows
          camera={{ position: [10, 5, 10], fov: 50 }}
          performance={{ min: 0.5 }}
        >
          <Suspense fallback={<Loader />}>
            <Scene />
          </Suspense>
          
          {/* Performance monitoring in development */}
          {process.env.NODE_ENV === 'development' && <Stats />}
        </Canvas>

        <ModeToggleButton />
      </GameStateProvider>
    </div>
  );
} 