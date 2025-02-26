import React from 'react';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, Vector3 } from 'three';
import { useGameState } from './GameStateContext';
import { Html } from '@react-three/drei';
import Guy from '../models/Guy';

// Character variations for different users
const CHARACTER_COLORS = [
  '#4CAF50', // Green
  '#2196F3', // Blue
  '#FFC107', // Yellow
  '#9C27B0', // Purple
  '#FF5722'  // Orange
];

interface CharacterProps {
  position?: [number, number, number];
  scale?: number;
  onPositionUpdate?: (position: Vector3) => void;
  userName?: string;
  isCurrentUser?: boolean;
  userId?: string;
}

export function Character({ 
  position = [0, 0, 0], 
  scale = 1,
  onPositionUpdate,
  userName = "Anonymous",
  isCurrentUser = false,
  userId = "0"
}: CharacterProps) {
  const group = useRef<Group>(null);
  const { mode } = useGameState();

  // Get consistent color based on userId
  const getCharacterColor = () => {
    const colorIndex = Math.abs(userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0));
    return CHARACTER_COLORS[colorIndex % CHARACTER_COLORS.length];
  };

  // Simple position update for multiplayer sync
  useFrame(() => {
    if (group.current && onPositionUpdate) {
      onPositionUpdate(group.current.position);
    }
  });

  return (
    <group ref={group} position={position}>
      <group scale={[scale, scale, scale]} position={[0, 0, 0]}>
        <Guy 
          isWalking={false}
          isMeditating={mode === 'focus'}
          color={getCharacterColor()}
        />
        {/* User name label */}
        <Html position={[0, 3.5, 0]} center>
          <div style={{
            background: isCurrentUser ? '#4CAF50' : getCharacterColor(),
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '14px',
            whiteSpace: 'nowrap',
            fontFamily: 'Arial, sans-serif',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span>{userName}</span>
            {isCurrentUser && (
              <span style={{
                background: 'rgba(255,255,255,0.2)',
                padding: '2px 6px',
                borderRadius: '3px',
                fontSize: '12px'
              }}>
                You
              </span>
            )}
          </div>
        </Html>
      </group>
    </group>
  );
} 