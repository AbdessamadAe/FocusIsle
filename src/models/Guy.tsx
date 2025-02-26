import React, {useRef, useEffect} from 'react'
import guyScene from '../assets/3d/HomeIsland/fall_guy.glb'
import { useGLTF, useAnimations } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

const Guy = ({ isRotating }) => {
    const { scene, animations } = useGLTF(guyScene)
    const ref = useRef();
    const {actions} = useAnimations(animations, ref)
    
    // Add movement state
    const movement = useRef({
        forward: false,
        backward: false,
        left: false,
        right: false,
        speed: 0.1
    });

    useEffect(() => {
        const handleKeyDown = (e) => {
            switch(e.key.toLowerCase()) {
                case 'w': movement.current.forward = true; break;
                case 's': movement.current.backward = true; break;
                case 'a': movement.current.left = true; break;
                case 'd': movement.current.right = true; break;
            }
        };

        const handleKeyUp = (e) => {
            switch(e.key.toLowerCase()) {
                case 'w': movement.current.forward = false; break;
                case 's': movement.current.backward = false; break;
                case 'a': movement.current.left = false; break;
                case 'd': movement.current.right = false; break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    useFrame(() => {
        if (!ref.current) return;

        // Handle movement
        if (movement.current.forward) ref.current.position.z -= movement.current.speed;
        if (movement.current.backward) ref.current.position.z += movement.current.speed;
        if (movement.current.left) ref.current.position.x -= movement.current.speed;
        if (movement.current.right) ref.current.position.x += movement.current.speed;

        // Play walking animation if moving
        const isMoving = Object.values(movement.current).some(v => v === true);
        if (isMoving) {
            actions['FG_Walk_Left_A']?.reset().fadeIn(0.5).play();
        } else {
            actions['FG_Emote_Wave_A']?.reset().fadeIn(0.5).play();
        }
    });

    return (
        <mesh 
            ref={ref} 
            position={[0, 0, 0]} 
            scale={[0.2, 0.2, 0.2]} 
            rotation={[0, -Math.PI / 2, 0]}
            castShadow
        >
            <primitive object={scene} />
        </mesh>
    )
}

export default Guy