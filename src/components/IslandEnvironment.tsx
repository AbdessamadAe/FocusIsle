import { useRef } from 'react';
import { Mesh } from 'three';
import { useGameState } from './GameStateContext';
import Island from '../models/island';
import Sky from '../models/Sky';

interface IslandEnvironmentProps {
  position?: [number, number, number];
  scale?: number;
}

export function IslandEnvironment({
  position = [0, 0, 0],
  scale = 1
}: IslandEnvironmentProps) {
  const islandRef = useRef<Mesh>(null);
  const { mode } = useGameState();

  return (
    <group position={position} scale={[scale, scale, scale]}>
      {/* Island model */}
      <Island scale={0.5} position={[0, -1, 0]} />
      
      {/* Sky */}
      <Sky scale={50} />

      {/* Ground plane */}
      <mesh
        position={[0, -1.1, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[100, 100, 1]}
        receiveShadow
      >
        <planeGeometry />
        <meshStandardMaterial
          color="#0a5"
          opacity={0.3}
          transparent
          roughness={1}
        />
      </mesh>

      {/* Ambient light - brighter during break mode */}
      <ambientLight intensity={mode === 'break' ? 0.8 : 0.5} />

      {/* Main directional light */}
      <directionalLight
        position={[10, 10, 5]}
        intensity={1.5}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.1}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />

      {/* Fill light */}
      <directionalLight
        position={[-5, 5, -5]}
        intensity={0.5}
        color={mode === 'focus' ? '#b8c4ff' : '#ffd700'}
      />

      {/* Environment elements */}
      <fog attach="fog" args={['#b8c4ff', 15, 25]} />
    </group>
  );
} 