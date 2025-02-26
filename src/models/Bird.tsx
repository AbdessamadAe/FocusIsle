import React, {useRef, useEffect} from 'react'
import birdScence from '../assets/3d/HomeIsland/bird.glb'
import { useGLTF, useAnimations } from '@react-three/drei'

const Bird = () => {
    const { scene, animations } = useGLTF(birdScence)
    const ref = useRef();
    const {actions} = useAnimations(animations, ref)
    console.log(actions)

    useEffect(() => {
        if(true) {
            actions['Take 001']?.play();
        }
    }, [actions])
    return (
        <mesh ref={ref} position={[-5, 2, 1]} scale={[0.003, 0.003, 0.003]}>
            <primitive object={scene} />
        </mesh>
    )
}

export default Bird