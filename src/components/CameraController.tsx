import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { Vector3, MathUtils } from 'three';
import { useGameState } from './GameStateContext';

interface CameraControllerProps {
  target?: Vector3;
  distance?: number;
}

export function CameraController({ target = new Vector3(0, 0, 0), distance = 10 }: CameraControllerProps) {
  const { camera } = useThree();
  const { mode } = useGameState();
  
  // Camera state
  const orbitAngle = useRef(0);
  const verticalAngle = useRef(0);
  const currentPosition = useRef(new Vector3());
  const targetPosition = useRef(new Vector3());
  const currentLookAt = useRef(new Vector3());
  const currentDistance = useRef(distance);
  
  // Animation parameters
  const dampingFactor = useRef(0.05);
  const orbitSpeed = useRef(0.15);
  const verticalSpeed = useRef(0.1);
  const distanceRange = useRef({ min: distance * 0.8, max: distance * 1.2 });
  const heightRange = useRef({ min: distance * 0.3, max: distance * 0.6 });

  useEffect(() => {
    // Initial camera setup
    camera.position.set(distance, distance / 2, distance);
    camera.lookAt(target);
    currentPosition.current.copy(camera.position);
    currentLookAt.current.copy(target);
    
    // Reset animation parameters when mode changes
    orbitAngle.current = Math.atan2(
      camera.position.x - target.x,
      camera.position.z - target.z
    );
    verticalAngle.current = 0;
    currentDistance.current = distance;
  }, [camera, distance, target, mode]);

  useFrame((_, delta) => {
    if (mode === 'focus') {
      // Simple orbiting in focus mode
      orbitAngle.current += delta * 0.1;
      const x = Math.sin(orbitAngle.current) * distance;
      const z = Math.cos(orbitAngle.current) * distance;
      targetPosition.current.set(x, distance / 2, z);
      
      currentPosition.current.lerp(targetPosition.current, dampingFactor.current);
      camera.position.copy(currentPosition.current);
      camera.lookAt(target);
    } else {
      // Cinematic camera in break mode
      
      // Update orbital position
      orbitAngle.current += delta * orbitSpeed.current;
      verticalAngle.current += delta * verticalSpeed.current;
      
      // Calculate dynamic height using sine wave
      const heightOffset = MathUtils.lerp(
        heightRange.current.min,
        heightRange.current.max,
        (Math.sin(verticalAngle.current) + 1) * 0.5
      );
      
      // Calculate dynamic distance using cosine wave
      const dynamicDistance = MathUtils.lerp(
        distanceRange.current.min,
        distanceRange.current.max,
        (Math.cos(verticalAngle.current * 0.5) + 1) * 0.5
      );
      
      // Calculate target camera position
      const x = Math.sin(orbitAngle.current) * dynamicDistance;
      const z = Math.cos(orbitAngle.current) * dynamicDistance;
      targetPosition.current.set(x, heightOffset, z);
      targetPosition.current.add(target); // Offset from character position
      
      // Smooth camera movement
      currentPosition.current.lerp(targetPosition.current, dampingFactor.current);
      camera.position.copy(currentPosition.current);
      
      // Smooth look-at target
      currentLookAt.current.lerp(target, dampingFactor.current);
      
      // Add slight vertical offset to look-at point for better composition
      const lookAtOffset = new Vector3(0, heightOffset * 0.2, 0);
      camera.lookAt(currentLookAt.current.clone().add(lookAtOffset));
      
      // Ensure camera maintains minimum distance from target
      const distanceToTarget = camera.position.distanceTo(target);
      if (distanceToTarget < distanceRange.current.min) {
        const direction = camera.position.clone().sub(target).normalize();
        camera.position.copy(
          target.clone().add(direction.multiplyScalar(distanceRange.current.min))
        );
      }
    }
  });

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [camera]);

  return null;
} 