import { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stats } from '@react-three/drei';
import { Vector3 } from 'three';
import { Character } from './Character';
import { IslandEnvironment } from './IslandEnvironment';
import { CameraController } from './CameraController';
import { GameStateProvider, useGameState } from './GameStateContext';
import { FocusSessionProvider, useFocusSession } from './FocusSessionContext';
import { Dashboard } from './Dashboard';
import { Loader } from './Loader';
import { SessionChat } from './SessionChat';

function Scene() {
  const { mode } = useGameState();
  const { users, currentUser, currentSession, updateUserPosition } = useFocusSession();
  const [characterPosition, setCharacterPosition] = useState(new Vector3(0, 0, 0));

  const handleCharacterPositionUpdate = (position: Vector3) => {
    setCharacterPosition(position.clone());
    if (currentUser) {
      updateUserPosition(currentUser.id, position);
    }
  };

  return (
    <>
      <CameraController   
        target={characterPosition}
        distance={mode === 'focus' ? 12 : 8}
      />
      
      <IslandEnvironment position={[0, 0, 0]} scale={1} />
      
      {/* Render all users */}
      {users.map(user => (
        <Character
          key={user.id}
          position={[user.position.x, 0, user.position.z]}
          scale={0.8}
          userName={user.name}
          isCurrentUser={currentUser?.id === user.id}
          userId={user.id}
          onPositionUpdate={currentUser?.id === user.id ? handleCharacterPositionUpdate : undefined}
        />
      ))}
    </>
  );
}

function FocusView() {
  const { mode } = useGameState();
  const { currentSession } = useFocusSession();
  const showChat = mode === 'break' && currentSession?.status === 'break';

  return (
    <>
      <Canvas
        shadows
        camera={{ position: [10, 5, 10], fov: 45 }}
        performance={{ min: 0.5 }}
      >
        <Suspense fallback={<Loader />}>
          <Scene />
        </Suspense>
        
        {process.env.NODE_ENV === 'development' && <Stats />}
      </Canvas>
      <SessionChat visible={showChat} />
    </>
  );
}

function SessionInfo() {
  const { currentSession } = useFocusSession();
  const { mode } = useGameState();
  
  if (!currentSession) return null;

  const timeRemaining = Math.max(0, currentSession.endTime.getTime() - Date.now());
  const minutes = Math.floor(timeRemaining / 60000);
  const seconds = Math.floor((timeRemaining % 60000) / 1000);

  return (
    <div style={{
      position: 'absolute',
      top: '20px',
      left: '20px',
      padding: '15px',
      borderRadius: '10px',
      background: 'rgba(255, 255, 255, 0.95)',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      backdropFilter: 'blur(5px)'
    }}>
      <h3 style={{ 
        margin: '0 0 10px 0', 
        color: '#333',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        {mode === 'focus' ? '🎯 Focus Time' : '☕ Break Time'}
        {mode === 'break' && (
          <span style={{
            fontSize: '0.8em',
            background: '#e3f2fd',
            padding: '4px 8px',
            borderRadius: '12px',
            color: '#1976d2'
          }}>
            Chat available
          </span>
        )}
      </h3>
      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#4CAF50' }}>
        {minutes}:{seconds.toString().padStart(2, '0')}
      </div>
      <div style={{ marginTop: '10px', color: '#666' }}>
        {currentSession.users.length} users in session
      </div>
    </div>
  );
}

function LeaveSessionButton() {
  const { leaveSession } = useFocusSession();
  
  return (
    <button
      style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        padding: '10px 20px',
        borderRadius: '8px',
        border: 'none',
        backgroundColor: '#f44336',
        color: 'white',
        cursor: 'pointer',
        fontSize: '16px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        transition: 'all 0.3s ease'
      }}
      onClick={leaveSession}
    >
      👋 Leave Session
    </button>
  );
}

function AppContent() {
  const [showDashboard, setShowDashboard] = useState(true);
  const { currentUser, joinSession } = useFocusSession();

  useEffect(() => {
    if (!currentUser) {
      setShowDashboard(true);
    }
  }, [currentUser]);

  return (
    <>
      {showDashboard ? (
        <Dashboard onJoinClick={() => {
          const name = prompt('Enter your name:');
          if (name) {
            joinSession(name);
            setShowDashboard(false);
          }
        }} />
      ) : (
        <>
          <FocusView />
          <SessionInfo />
          <LeaveSessionButton />
        </>
      )}
    </>
  );
}

export function MainScene() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#E6F3E9' }}>
      <FocusSessionProvider>
        <GameStateProvider>
          <AppContent />
        </GameStateProvider>
      </FocusSessionProvider>
    </div>
  );
} 