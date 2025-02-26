import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';
import { useGameState } from './GameStateContext';

interface CameraControllerProps {
  target?: Vector3;
  distance?: number;
}

export function CameraController({ target = new Vector3(0, 0, 0), distance = 10 }: CameraControllerProps) {
  const { camera } = useThree();
  const { mode } = useGameState();
  const orbitAngle = useRef(0);
  const currentPosition = useRef(new Vector3());
  const targetPosition = useRef(new Vector3());

  useEffect(() => {
    // Initial camera position
    camera.position.set(distance, distance / 2, distance);
    camera.lookAt(target);
  }, [camera, distance, target]);

  useFrame((_, delta) => {
    if (mode === 'focus') {
      // Slow orbiting camera in focus mode
      orbitAngle.current += delta * 0.1;
      const x = Math.sin(orbitAngle.current) * distance;
      const z = Math.cos(orbitAngle.current) * distance;
      camera.position.set(x, distance / 2, z);
      camera.lookAt(target);
    } else {
      // Follow target smoothly in break mode
      const idealOffset = new Vector3(0, 5, -8);
      idealOffset.applyQuaternion(camera.quaternion);
      idealOffset.add(target);

      targetPosition.current.copy(idealOffset);
      currentPosition.current.copy(camera.position);

      // Smooth interpolation
      const t = Math.min(1.0, delta * 4);
      currentPosition.current.lerp(targetPosition.current, t);
      camera.position.copy(currentPosition.current);
      camera.lookAt(target);
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