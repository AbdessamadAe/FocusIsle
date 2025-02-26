import React, { useRef, useEffect } from 'react'
import guyScene from '../assets/3d/HomeIsland/fall_guy.glb'
import { useGLTF, useAnimations } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

interface GuyProps {
  isWalking?: boolean;
  isMeditating?: boolean;
}

const Guy = ({ isWalking = false, isMeditating = false }: GuyProps) => {
  const { scene, animations } = useGLTF(guyScene);
  const ref = useRef();
  const { actions } = useAnimations(animations, ref);

  // Handle animations based on state
  useEffect(() => {
    // Stop all animations first
    Object.values(actions).forEach(action => action?.stop());

    if (isMeditating) {
      // Use wave animation as meditation for now
      actions['FG_Emote_Wave_A']?.reset().fadeIn(0.5).play();
    } else if (isWalking) {
      actions['FG_Walk_Left_A']?.reset().fadeIn(0.2).play();
    } else {
      // Idle animation
      actions['FG_Emote_Wave_A']?.reset().fadeIn(0.5).play();
    }
  }, [actions, isWalking, isMeditating]);

  return (
    <mesh
      ref={ref}
      position={[0, -1, 0]} // Adjust to match ground plane
      scale={[0.3, 0.3, 0.3]}
      castShadow
    >
      <primitive object={scene} />
    </mesh>
  );
}

export default Guy;

// Preload model
useGLTF.preload(guyScene);