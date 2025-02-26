import React, { useRef, useEffect } from 'react'
import guyScene from '../assets/3d/HomeIsland/fall_guy.glb'
import { useGLTF, useAnimations } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { Color } from 'three'

interface GuyProps {
  isWalking?: boolean;
  isMeditating?: boolean;
  color?: string;
}

// Define animation sets
const FOCUS_ANIMATIONS = [
  'FG_Idle_JumpingJacks_A',
  'FG_Idle_TouchingToes',
  'FG_Idle_TwistingStreches_A',
  'FG_emote_Jester_A',
  'FG_Emote_RobotDance_A'
];

const IDLE_ANIMATIONS = [
  'FG_Idle_A',
  'FG_Emote_ThumbsUp_A',
  'FG_emote_Bow_A',
  'FG_Emote_Wave_A'
];

const WALKING_ANIMATIONS = [
  'FG_Walk_A',
  'FG_Walk_Left_A',
  'FG_Walk_Right_A'
];

const Guy = ({ isWalking = false, isMeditating = false, color = '#4CAF50' }: GuyProps) => {
  const group = useRef();
  const { scene, animations } = useGLTF(guyScene);
  const { actions } = useAnimations(animations, group);
  const [currentAnimation, setCurrentAnimation] = React.useState('');
  const animationTimer = useRef<NodeJS.Timeout | null>(null);

  // Apply color to the model
  useEffect(() => {
    scene.traverse((object: any) => {
      if (object.isMesh && object.material) {
        if (object.material.name === 'Character_Material') {
          object.material.color = new Color(color);
        }
      }
    });
  }, [scene, color]);

  // Function to play a random animation from a set
  const playRandomAnimation = (animationSet: string[]) => {
    // Stop current animation
    if (currentAnimation && actions[currentAnimation]) {
      actions[currentAnimation]?.fadeOut(0.5);
    }

    // Pick and play new animation
    const newAnimation = animationSet[Math.floor(Math.random() * animationSet.length)];
    if (actions[newAnimation]) {
      actions[newAnimation]?.reset().fadeIn(0.5).play();
      setCurrentAnimation(newAnimation);
    }
  };

  // Handle animation state changes
  useEffect(() => {
    // Clear any existing timer
    if (animationTimer.current) {
      clearInterval(animationTimer.current);
    }

    // Stop all current animations
    Object.values(actions).forEach(action => action?.stop());

    if (isMeditating) {
      // Focus mode: cycle through meditation/exercise animations
      playRandomAnimation(FOCUS_ANIMATIONS);
      animationTimer.current = setInterval(() => {
        playRandomAnimation(FOCUS_ANIMATIONS);
      }, 15000); // Change animation every 15 seconds
    } else {
      // Idle mode: cycle through idle animations
      playRandomAnimation(IDLE_ANIMATIONS);
      animationTimer.current = setInterval(() => {
        playRandomAnimation(IDLE_ANIMATIONS);
      }, 10000); // Change animation every 10 seconds
    }

    // Cleanup function
    return () => {
      if (animationTimer.current) {
        clearInterval(animationTimer.current);
      }
    };
  }, [actions, isWalking, isMeditating]);

  // Handle animation transitions
  useEffect(() => {
    return () => {
      // Cleanup animations on unmount
      Object.values(actions).forEach(action => action?.stop());
    };
  }, [actions]);

  // Log for debugging
  useEffect(() => {
    console.log('Scene loaded:', scene);
    console.log('Available animations:', animations);
  }, [scene, animations]);

  return (
    <group ref={group}>
      <primitive 
        object={scene} 
        scale={[0.5, 0.5, 0.5]}
        position={[0, 0, 0]}
        castShadow
        receiveShadow
      />
    </group>
  );
}

export default Guy;

// Preload model
useGLTF.preload(guyScene);