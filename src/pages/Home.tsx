import React, { Suspense, useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Loader } from '../components/Loader'
import Island from '../models/island'
import Sky from '../models/Sky'
import Bird from '../models/Bird'
import Guy from '../models/Guy'
import { Environment } from '@react-three/drei'
import Floor from '../models/Floor'

export const Home = () => {
  const [isRotating, setIsRotating] = useState(false);

  const adjustIslandForScreen = () => {
    let screenScale = null;
    let screenPosition = [0, -6.5, -43];
    let rotation = [0.1, 4.7, 0];

    if (window.innerWidth < 768) {
      screenScale = [0.9, 0.9, 0.9];
    }
    else {
      screenScale = [2, 2, 2];
    }
    return [ screenScale, screenPosition, rotation ];
  }

  const [isLandScale, isLandPosition, isLandRotation] = adjustIslandForScreen();

  return (
    <div className='w-full h-screen relative'>
      <Canvas className={`w-full h-screen bg-transparent ${isRotating ? 'cursor-grabbing' : 'cursor-grab'}`} camera={{ near: 0.1  , far: 1000, position: [0, 5, 10] }} shadows>
        <directionalLight intensity={2} position={[1,1,1]} castShadow />
        <ambientLight intensity={0.5} />
        <hemisphereLight skyColor="b1e1ff" groundColor="#000000" intensity={1} />
        <Environment preset="sunset" />
        <Suspense fallback={<Loader />}>
          <Island
            isLandScale={isLandScale}
            isLandPosition={isLandPosition}
            isLandRotation={isLandRotation}
            isRotating={isRotating}
            setIsRotating={setIsRotating}
          />
          <Sky 
          isRotating={isRotating}
          />
          <Bird />
          <Guy
            isRotating={isRotating}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}
