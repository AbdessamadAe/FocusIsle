import React from 'react'

const Floor = () => {
    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
            <planeGeometry args={[50, 50]} />
            <meshStandardMaterial color="#454545" />
        </mesh>
    )
}

export default Floor
