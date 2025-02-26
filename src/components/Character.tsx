import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Group, Vector3 } from 'three';
import { useGameState } from './GameStateContext';
import Guy from '../models/Guy';

interface CharacterProps {
  position?: [number, number, number];
  scale?: number;
  onPositionUpdate?: (position: Vector3) => void;
}

export function Character({ 
  position = [0, 0, 0], 
  scale = 1,
  onPositionUpdate 
}: CharacterProps) {
  const group = useRef<Group>(null);
  const { mode } = useGameState();
  const { camera } = useThree();
  
  // Movement state
  const velocity = useRef(new Vector3());
  const direction = useRef(new Vector3());
  const isGrounded = useRef(true);
  
  // Handle keyboard controls in break mode
  useEffect(() => {
    if (mode !== 'break') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const speed = 5;
      switch (e.code) {
        case 'KeyW':
          direction.current.z = -speed;
          break;
        case 'KeyS':
          direction.current.z = speed;
          break;
        case 'KeyA':
          direction.current.x = -speed;
          break;
        case 'KeyD':
          direction.current.x = speed;
          break;
        case 'Space':
          if (isGrounded.current) {
            velocity.current.y = 5;
            isGrounded.current = false;
          }
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW':
        case 'KeyS':
          direction.current.z = 0;
          break;
        case 'KeyA':
        case 'KeyD':
          direction.current.x = 0;
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [mode]);

  // Update character physics and position
  useFrame((_, delta) => {
    if (!group.current) return;

    if (mode === 'break') {
      // Apply gravity
      if (!isGrounded.current) {
        velocity.current.y -= 9.8 * delta;
      }

      // Update position
      const moveDirection = direction.current.clone();
      moveDirection.applyQuaternion(camera.quaternion);
      moveDirection.y = 0;
      moveDirection.normalize();

      group.current.position.addScaledVector(moveDirection, delta * 5);
      group.current.position.y += velocity.current.y * delta;

      // Ground collision check (simple)
      if (group.current.position.y <= 0) {
        group.current.position.y = 0;
        velocity.current.y = 0;
        isGrounded.current = true;
      }

      // Rotate character to face movement direction
      if (moveDirection.length() > 0.1) {
        const targetRotation = Math.atan2(moveDirection.x, moveDirection.z);
        group.current.rotation.y = targetRotation;
      }

      // Notify position update
      onPositionUpdate?.(group.current.position);
    }
  });

  return (
    <group ref={group} position={position} scale={[scale, scale, scale]}>
      <Guy 
        isWalking={mode === 'break' && direction.current.length() > 0}
        isMeditating={mode === 'focus'}
      />
    </group>
  );
} 