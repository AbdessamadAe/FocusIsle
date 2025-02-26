import React, { useRef, useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import { events, useFrame, useThree } from '@react-three/fiber'
import IslandScence from '../assets/3d/HomeIsland/low_poly_circle_island.glb'
import { a } from '@react-spring/three'

const Island = ({ isRotating, setIsRotating, ...props }) => {
    const { nodes, materials } = useGLTF(IslandScence);
    const islandRef = useRef();
    const { gl, viewport } = useThree();

    const lastX = useRef(0);
    // Use a ref for rotation speed
    const rotationSpeed = useRef(0);
    // Define a damping factor to control rotation damping
    const dampingFactor = 0.97;

    // Handle pointer (mouse or touch) down event
    const handlePointerDown = (event) => {
        event.stopPropagation();
        event.preventDefault();
        setIsRotating(true);

        // Calculate the clientX based on whether it's a touch event or a mouse event
        const clientX = event.touches ? event.touches[0].clientX : event.clientX;

        // Store the current clientX position for reference
        lastX.current = clientX;
    };

    // Handle pointer (mouse or touch) up event
    const handlePointerUp = (event) => {
        event.stopPropagation();
        event.preventDefault();
        setIsRotating(false);
    };

    const handlePointerMove = (event) => {
        event.stopPropagation();
        event.preventDefault();
    
        if (!isRotating) return; // Ensure rotation is enabled
    
        const clientX = event.touches ? event.touches[0].clientX : event.clientX;
        const delta = (clientX - lastX.current) / viewport.width;
    
        // Apply rotation continuously
        islandRef.current.rotation.y += delta * 0.03 * Math.PI;
        rotationSpeed.current = delta * 0.03 * Math.PI; // Keep updating speed
    
        lastX.current = clientX; // Update last position
    };
    

    // Handle keydown events
    const handleKeyDown = (event) => {
        if (event.key === "ArrowLeft") {
            if (!isRotating) setIsRotating(true);

            islandRef.current.rotation.y += 0.005 * Math.PI;
            rotationSpeed.current = 0.007;
        } else if (event.key === "ArrowRight") {
            if (!isRotating) setIsRotating(true);

            islandRef.current.rotation.y -= 0.005 * Math.PI;
            rotationSpeed.current = -0.007;
        }
    };

    // Handle keyup events
    const handleKeyUp = (event) => {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            setIsRotating(false);
        }
    };

    // Touch events for mobile devices
    const handleTouchStart = (e) => {
        e.stopPropagation();
        e.preventDefault();
        setIsRotating(true);

        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        lastX.current = clientX;
    }

    const handleTouchEnd = (e) => {
        e.stopPropagation();
        e.preventDefault();
        setIsRotating(false);
    }

    const handleTouchMove = (e) => {
        e.stopPropagation();
        e.preventDefault();

        if (isRotating) {
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const delta = (clientX - lastX.current) / viewport.width;

            islandRef.current.rotation.y += delta * 0.01 * Math.PI;
            lastX.current = clientX;
            rotationSpeed.current = delta * 0.01 * Math.PI;
        }
    }

    // useEffect(() => {
    //     // Add event listeners for pointer and keyboard events
    //     const canvas = gl.domElement;
    //     canvas.addEventListener("pointerdown", handlePointerDown);
    //     canvas.addEventListener("pointerup", handlePointerUp);
    //     canvas.addEventListener("pointermove", handlePointerMove);
    //     window.addEventListener("keydown", handleKeyDown);
    //     window.addEventListener("keyup", handleKeyUp);
    //     canvas.addEventListener("touchstart", handleTouchStart);
    //     canvas.addEventListener("touchend", handleTouchEnd);
    //     canvas.addEventListener("touchmove", handleTouchMove);

    //     // Remove event listeners when component unmounts
    //     return () => {
    //         canvas.removeEventListener("pointerdown", handlePointerDown);
    //         canvas.removeEventListener("pointerup", handlePointerUp);
    //         canvas.removeEventListener("pointermove", handlePointerMove);
    //         window.removeEventListener("keydown", handleKeyDown);
    //         window.removeEventListener("keyup", handleKeyUp);
    //         canvas.removeEventListener("touchstart", handleTouchStart);
    //         canvas.removeEventListener("touchend", handleTouchEnd);
    //         canvas.removeEventListener("touchmove", handleTouchMove);
    //     };
    // }, [gl, handlePointerDown, handlePointerUp, handlePointerMove]);

    // // This function is called on each frame update
    // useFrame(() => {
    //     if (isRotating) {
    //         islandRef.current.rotation.y += rotationSpeed.current; // Apply speed in real-time
    //     } else {
    //         // Apply damping when not rotating
    //         rotationSpeed.current *= dampingFactor;
    //         if (Math.abs(rotationSpeed.current) < 0.0001) rotationSpeed.current = 0;
    //         islandRef.current.rotation.y += rotationSpeed.current;
    //     }
    // });
    

    return (
        <a.group {...props} ref={islandRef}>
                    <mesh
                        geometry={nodes.cloud3_cloud_0.geometry}
                        material={materials.cloud}
                    />
                    <mesh
                        geometry={nodes.cloud3_cloud1_0.geometry}
                        material={materials.cloud1}
                    />
                    <mesh
                        geometry={nodes.polySurface4_whiye_0.geometry}
                        material={materials.whiye}
                    />
                    <mesh
                        geometry={nodes.polySurface4_green2_0.geometry}
                        material={materials.green2}
                    />
                    <mesh
                        geometry={nodes.polySurface4_green3_0.geometry}
                        material={materials.green3}
                    />
                    <mesh
                        geometry={nodes.polySurface4_green1_0.geometry}
                        material={materials.green1}
                    />
                    <mesh
                        geometry={nodes.polySurface4_Orange1_0.geometry}
                        material={materials.Orange1}
                    />
                    <mesh
                        geometry={nodes.polySurface4_orange2_0.geometry}
                        material={materials.orange2}
                    />
                    <mesh
                        geometry={nodes.polySurface4_orange3_0.geometry}
                        material={materials.orange3}
                    />
                    <mesh
                        geometry={nodes.polySurface4_quack_0.geometry}
                        material={materials.quack}
                    />
                    <mesh
                        geometry={nodes.polySurface4_dukkie_0.geometry}
                        material={materials.dukkie}
                    />
                    <mesh
                        geometry={nodes.polySurface4_lightgre_0.geometry}
                        material={materials.lightgre}
                    />
                    <mesh
                        geometry={nodes.polySurface4_lightgreen_0.geometry}
                        material={materials.lightgreen}
                    />
                    <mesh
                        geometry={nodes.polySurface4_rock1_0.geometry}
                        material={materials.rock1}
                    />
                    <mesh
                        geometry={nodes.polySurface4_rock_0.geometry}
                        material={materials.rock}
                    />
                    <mesh
                        geometry={nodes.polySurface4_rock2_0.geometry}
                        material={materials.rock2}
                    />
                    <mesh
                        geometry={nodes.polySurface4_lambert38_0.geometry}
                        material={materials.lambert38}
                    />
                    <mesh
                        geometry={nodes.polySurface4_greli_0.geometry}
                        material={materials.greli}
                    />
                    <mesh
                        geometry={nodes.polySurface4_water_0.geometry}
                        material={materials.water}
                    />
                    <mesh
                        geometry={nodes.polySurface4_lambert39dsafadsfdsa_0.geometry}
                        material={materials.lambert39dsafadsfdsa}
                    />
                    <mesh
                        geometry={nodes.polySurface4_lambert18_0.geometry}
                        material={materials.lambert18}
                    />
                    <mesh
                        geometry={nodes.polySurface4_lambert20_0.geometry}
                        material={materials.lambert20}
                    />
                    <mesh
                        geometry={nodes.polySurface4_GREEN_0.geometry}
                        material={materials.GREEN}
                    />
                    <mesh
                        geometry={nodes.polySurface4_gaz7_0.geometry}
                        material={materials.gaz7}
                    />
                    <mesh
                        geometry={nodes.polySurface4_gaz2_0.geometry}
                        material={materials.gaz2}
                    />
                    <mesh
                        geometry={nodes.polySurface4_gaz1_0.geometry}
                        material={materials.gaz1}
                    />
                    <mesh
                        geometry={nodes.polySurface4_gaz4_0.geometry}
                        material={materials.gaz4}
                    />
                    <mesh
                        geometry={nodes.polySurface4_gaz6_0.geometry}
                        material={materials.gaz6}
                    />
                    <mesh
                        geometry={nodes.polySurface4_gaz3_0.geometry}
                        material={materials.gaz3}
                    />
                    <mesh
                        geometry={nodes.polySurface4_gaz8_0.geometry}
                        material={materials.gaz8}
                    />
                    <mesh
                        geometry={nodes.polySurface4_Glass_0.geometry}
                        material={materials.Glass}
                    />
                    <mesh
                        geometry={nodes.polySurface8_whiye_0.geometry}
                        material={materials.whiye}
                    />
                    <mesh
                        geometry={nodes.polySurface11_whiye_0.geometry}
                        material={materials.whiye}
                    />
                    <mesh
                        geometry={nodes.polySurface10_whiye_0.geometry}
                        material={materials.whiye}
                    />
                    <mesh
                        geometry={nodes.polySurface9_whiye_0.geometry}
                        material={materials.whiye}
                    />
                    <mesh
                        geometry={nodes.polySurface12_whiye_0.geometry}
                        material={materials.whiye}
                    />
                    <mesh
                        geometry={nodes.polySurface7_whiye_0.geometry}
                        material={materials.whiye}
                    />
                    <mesh
                        geometry={nodes.polySurface5_whiye_0.geometry}
                        material={materials.whiye}
                    />
                    <mesh
                        geometry={nodes.polySurface6_whiye_0.geometry}
                        material={materials.whiye}
                    />
                    <mesh
                        geometry={nodes.polySurface3_whiye_0.geometry}
                        material={materials.whiye}
                    />
                    <mesh
                        geometry={nodes.polySurface13_whiye_0.geometry}
                        material={materials.whiye}
                    />
                    <mesh
                        geometry={nodes.polySurface14_whiye_0.geometry}
                        material={materials.whiye}
                    />
                    <mesh
                        geometry={nodes.polySurface15_whiye_0.geometry}
                        material={materials.whiye}
                    />
                    <mesh
                        geometry={nodes.polySurface16_whiye_0.geometry}
                        material={materials.whiye}
                    />
                    <mesh
                        geometry={nodes.polySurface17_whiye_0.geometry}
                        material={materials.whiye}
                    />
                    <mesh
                        geometry={nodes.polySurface18_whiye_0.geometry}
                        material={materials.whiye}
                    />
                    <mesh
                        geometry={nodes.polySurface19_whiye_0.geometry}
                        material={materials.whiye}
                    />
                    <mesh
                        geometry={nodes.polySurface20_whiye_0.geometry}
                        material={materials.whiye}
                    />
                    <mesh
                        geometry={nodes.polySurface21_whiye_0.geometry}
                        material={materials.whiye}
                    />
                    <mesh
                        geometry={nodes.polySurface22_whiye_0.geometry}
                        material={materials.whiye}
                    />
                    <mesh
                        geometry={nodes.polySurface23_whiye_0.geometry}
                        material={materials.whiye}
                    />
                    <mesh
                        geometry={nodes.polySurface24_whiye_0.geometry}
                        material={materials.whiye}
                    />
                    <mesh
                        geometry={nodes.polySurface25_whiye_0.geometry}
                        material={materials.whiye}
                    />
                    <mesh
                        geometry={nodes.polySurface26_whiye_0.geometry}
                        material={materials.whiye}
                    />
                    <mesh
                        geometry={nodes.polySurface27_whiye_0.geometry}
                        material={materials.whiye}
                    />
                    <mesh
                        geometry={nodes.polySurface28_whiye_0.geometry}
                        material={materials.whiye}
                    />
                    <mesh
                        geometry={nodes.polySurface29_whiye_0.geometry}
                        material={materials.whiye}
                    />
                    <mesh
                        geometry={nodes.polySurface30_whiye_0.geometry}
                        material={materials.whiye}
                    />
                    <mesh
                        geometry={nodes.polySurface31_whiye_0.geometry}
                        material={materials.whiye}
                    />
                    <mesh
                        geometry={nodes.polySurface32_whiye_0.geometry}
                        material={materials.whiye}
                    />
                    <mesh
                        geometry={nodes.polySurface33_whiye_0.geometry}
                        material={materials.whiye}
                    />
                    <mesh
                        geometry={nodes.polySurface34_whiye_0.geometry}
                        material={materials.whiye}
                    />
                    <mesh
                        geometry={nodes.polySurface35_whiye_0.geometry}
                        material={materials.whiye}
                    />
                    <mesh
                        geometry={nodes.polySurface36_whiye_0.geometry}
                        material={materials.whiye}
                    />
                    <mesh
                        geometry={nodes.polySurface37_whiye_0.geometry}
                        material={materials.whiye}
                    />
                    <mesh
                        geometry={nodes.polySurface38_whiye_0.geometry}
                        material={materials.whiye}
                    />
                    <mesh
                        geometry={nodes.polySurface39_whiye_0.geometry}
                        material={materials.whiye}
                    />
                    <mesh
                        geometry={nodes.polySurface40_whiye_0.geometry}
                        material={materials.whiye}
                    />
                    <mesh
                        geometry={nodes.polySurface41_whiye_0.geometry}
                        material={materials.whiye}
                    />
                    <mesh
                        geometry={nodes.polySurface42_whiye_0.geometry}
                        material={materials.whiye}
                    />
                    <mesh
                        geometry={nodes.polySurface43_whiye_0.geometry}
                        material={materials.whiye}
                    />
                    <mesh
                        geometry={nodes.polySurface44_whiye_0.geometry}
                        material={materials.whiye}
                    />
                    <mesh
                        geometry={nodes.polySurface45_whiye_0.geometry}
                        material={materials.whiye}
                    />
                    <mesh
                        geometry={nodes.polySurface46_whiye_0.geometry}
                        material={materials.whiye}
                    />
                    <mesh
                        geometry={nodes.polySurface47_whiye_0.geometry}
                        material={materials.whiye}
                    />
                    <mesh
                        geometry={nodes.polySurface48_whiye_0.geometry}
                        material={materials.whiye}
                    />
                    <mesh
                        geometry={nodes.chick_quack_0.geometry}
                        material={materials.quack}
                    />
                    <mesh
                        geometry={nodes.chick_dukkie_0.geometry}
                        material={materials.dukkie}
                    />
                    <mesh
                        geometry={nodes.chick3_quack_0.geometry}
                        material={materials.quack}
                    />
                    <mesh
                        geometry={nodes.chick3_dukkie_0.geometry}
                        material={materials.dukkie}
                    />
                    <mesh
                        geometry={nodes.chick1_quack_0.geometry}
                        material={materials.quack}
                    />
                    <mesh
                        geometry={nodes.chick1_dukkie_0.geometry}
                        material={materials.dukkie}
                    />
                    <mesh
                        geometry={nodes.duck3_pSphere16_wing_0.geometry}
                        material={materials.wing}
                    />
                    <mesh
                        geometry={nodes.duck3_pSphere16_quack_0.geometry}
                        material={materials.quack}
                    />
                    <mesh
                        geometry={nodes.duck3_pSphere16_duck2_0.geometry}
                        material={materials.duck2}
                    />
                    <mesh
                        geometry={nodes.duck3_pSphere16_duck1_0.geometry}
                        material={materials.duck1}
                    />
                    <mesh
                        geometry={nodes.duck3_pSphere13_wing_0.geometry}
                        material={materials.wing}
                    />
                    <mesh
                        geometry={nodes.duck3_pSphere13_quack_0.geometry}
                        material={materials.quack}
                    />
                    <mesh
                        geometry={nodes.duck3_pSphere13_duck2_0.geometry}
                        material={materials.duck2}
                    />
                    <mesh
                        geometry={nodes.duck3_pSphere13_duck1_0.geometry}
                        material={materials.duck1}
                    />
                    <mesh
                        geometry={nodes.duck3_pSphere13_lambert25_0.geometry}
                        material={materials.lambert25}
                    />
                    <mesh
                        geometry={nodes.duck3_pSphere14_wing_0.geometry}
                        material={materials.wing}
                    />
                    <mesh
                        geometry={nodes.duck3_pSphere14_quack_0.geometry}
                        material={materials.quack}
                    />
                    <mesh
                        geometry={nodes.duck3_pSphere14_duck2_0.geometry}
                        material={materials.duck2}
                    />
                    <mesh
                        geometry={nodes.duck3_pSphere14_duck1_0.geometry}
                        material={materials.duck1}
                    />
                    <mesh
                        geometry={nodes.duck3_pSphere17_wing_0.geometry}
                        material={materials.wing}
                    />
                    <mesh
                        geometry={nodes.duck3_pSphere17_quack_0.geometry}
                        material={materials.quack}
                    />
                    <mesh
                        geometry={nodes.duck3_pSphere17_duck2_0.geometry}
                        material={materials.duck2}
                    />
                    <mesh
                        geometry={nodes.duck3_pSphere17_duck1_0.geometry}
                        material={materials.duck1}
                    />
                    <mesh
                        geometry={nodes.duck3_pSphere17_lambert25_0.geometry}
                        material={materials.lambert25}
                    />
                    <mesh
                        geometry={nodes.walk_duck2_0.geometry}
                        material={materials.duck2}
                    />
                    <mesh
                        geometry={nodes.walk_quack_0.geometry}
                        material={materials.quack}
                    />
                    <mesh
                        geometry={nodes.walk_duck1_0.geometry}
                        material={materials.duck1}
                    />
                    <mesh
                        geometry={nodes.walk_lambert25_0.geometry}
                        material={materials.lambert25}
                    />
                    <mesh
                        geometry={nodes.duck3_pSphere15_wing_0.geometry}
                        material={materials.wing}
                    />
                    <mesh
                        geometry={nodes.duck3_pSphere15_quack_0.geometry}
                        material={materials.quack}
                    />
                    <mesh
                        geometry={nodes.duck3_pSphere15_duck2_0.geometry}
                        material={materials.duck2}
                    />
                    <mesh
                        geometry={nodes.duck3_pSphere15_green1_0.geometry}
                        material={materials.green1}
                    />
                    <mesh
                        geometry={nodes.duck3_pSphere15_duck1_0.geometry}
                        material={materials.duck1}
                    />
                    <mesh
                        geometry={nodes.chick4_quack_0.geometry}
                        material={materials.quack}
                    />
                    <mesh
                        geometry={nodes.chick4_dukkie_0.geometry}
                        material={materials.dukkie}
                    />
                    <mesh
                        geometry={nodes.chick5_quack_0.geometry}
                        material={materials.quack}
                    />
                    <mesh
                        geometry={nodes.chick5_dukkie_0.geometry}
                        material={materials.dukkie}
                    />
                    <mesh
                        geometry={nodes.chick6_quack_0.geometry}
                        material={materials.quack}
                    />
                    <mesh
                        geometry={nodes.chick6_dukkie_0.geometry}
                        material={materials.dukkie}
                    />
                    <mesh
                        geometry={nodes.chick7_quack_0.geometry}
                        material={materials.quack}
                    />
                    <mesh
                        geometry={nodes.chick7_dukkie_0.geometry}
                        material={materials.dukkie}
                    />
                    <mesh
                        geometry={nodes.duck3_pSphere18_wing_0.geometry}
                        material={materials.wing}
                    />
                    <mesh
                        geometry={nodes.duck3_pSphere18_quack_0.geometry}
                        material={materials.quack}
                    />
                    <mesh
                        geometry={nodes.duck3_pSphere18_duck2_0.geometry}
                        material={materials.duck2}
                    />
                    <mesh
                        geometry={nodes.duck3_pSphere18_duck1_0.geometry}
                        material={materials.duck1}
                    />
                    <mesh
                        geometry={nodes.duck3_pSphere18_lambert25_0.geometry}
                        material={materials.lambert25}
                    />
                    <mesh
                        geometry={nodes.chick8_quack_0.geometry}
                        material={materials.quack}
                    />
                    <mesh
                        geometry={nodes.chick8_dukkie_0.geometry}
                        material={materials.dukkie}
                    />
                    <mesh
                        geometry={nodes.chick9_quack_0.geometry}
                        material={materials.quack}
                    />
                    <mesh
                        geometry={nodes.chick9_dukkie_0.geometry}
                        material={materials.dukkie}
                    />
                    <mesh
                        geometry={nodes.chick10_quack_0.geometry}
                        material={materials.quack}
                    />
                    <mesh
                        geometry={nodes.chick10_dukkie_0.geometry}
                        material={materials.dukkie}
                    />
                    <mesh
                        geometry={nodes.chick11_quack_0.geometry}
                        material={materials.quack}
                    />
                    <mesh
                        geometry={nodes.chick11_dukkie_0.geometry}
                        material={materials.dukkie}
                    />
                    <mesh
                        geometry={nodes.duck3_pSphere19_wing_0.geometry}
                        material={materials.wing}
                    />
                    <mesh
                        geometry={nodes.duck3_pSphere19_quack_0.geometry}
                        material={materials.quack}
                    />
                    <mesh
                        geometry={nodes.duck3_pSphere19_duck2_0.geometry}
                        material={materials.duck2}
                    />
                    <mesh
                        geometry={nodes.duck3_pSphere19_green1_0.geometry}
                        material={materials.green1}
                    />
                    <mesh
                        geometry={nodes.duck3_pSphere19_duck1_0.geometry}
                        material={materials.duck1}
                    />
                    <mesh
                        geometry={nodes.duck3_pSphere20_wing_0.geometry}
                        material={materials.wing}
                    />
                    <mesh
                        geometry={nodes.duck3_pSphere20_quack_0.geometry}
                        material={materials.quack}
                    />
                    <mesh
                        geometry={nodes.duck3_pSphere20_duck2_0.geometry}
                        material={materials.duck2}
                    />
                    <mesh
                        geometry={nodes.duck3_pSphere20_duck1_0.geometry}
                        material={materials.duck1}
                    />
                    <mesh
                        geometry={nodes.duck3_pSphere20_lambert25_0.geometry}
                        material={materials.lambert25}
                    />
                    <mesh
                        geometry={nodes.chick12_quack_0.geometry}
                        material={materials.quack}
                    />
                    <mesh
                        geometry={nodes.chick12_dukkie_0.geometry}
                        material={materials.dukkie}
                    />
                    <mesh
                        geometry={nodes.chick13_quack_0.geometry}
                        material={materials.quack}
                    />
                    <mesh
                        geometry={nodes.chick13_dukkie_0.geometry}
                        material={materials.dukkie}
                    />
                    <mesh
                        geometry={nodes.chick14_quack_0.geometry}
                        material={materials.quack}
                    />
                    <mesh
                        geometry={nodes.chick14_dukkie_0.geometry}
                        material={materials.dukkie}
                    />
                    <mesh
                        geometry={nodes.chick15_quack_0.geometry}
                        material={materials.quack}
                    />
                    <mesh
                        geometry={nodes.chick15_dukkie_0.geometry}
                        material={materials.dukkie}
                    />
                    <mesh
                        geometry={nodes.chick16_quack_0.geometry}
                        material={materials.quack}
                    />
                    <mesh
                        geometry={nodes.chick16_dukkie_0.geometry}
                        material={materials.dukkie}
                    />
                    <mesh
                        geometry={nodes.chick17_quack_0.geometry}
                        material={materials.quack}
                    />
                    <mesh
                        geometry={nodes.chick17_dukkie_0.geometry}
                        material={materials.dukkie}
                    />
                    <mesh
                        geometry={nodes.chick18_quack_0.geometry}
                        material={materials.quack}
                    />
                    <mesh
                        geometry={nodes.chick18_dukkie_0.geometry}
                        material={materials.dukkie}
                    />
                    <mesh
                        geometry={nodes.pCube7_lambert40dsfmn_0.geometry}
                        material={materials.lambert40dsfmn}
                    />
                    <mesh
                        geometry={nodes.pCube8_lambert40dsfmn_0.geometry}
                        material={materials.lambert40dsfmn}
                    />
                    <mesh
                        geometry={nodes.pCube9_lambert40dsfmn_0.geometry}
                        material={materials.lambert40dsfmn}
                    />
                    <mesh
                        geometry={nodes.pCube10_lambert40dsfmn_0.geometry}
                        material={materials.lambert40dsfmn}
                    />
                    <mesh
                        geometry={nodes.pCube11_lambert40dsfmn_0.geometry}
                        material={materials.lambert40dsfmn}
                    />
                    <mesh
                        geometry={nodes.pCube12_lambert40dsfmn_0.geometry}
                        material={materials.lambert40dsfmn}
                    />
                    <mesh
                        geometry={nodes.pCube13_lambert40dsfmn_0.geometry}
                        material={materials.lambert40dsfmn}
                    />
                    <mesh
                        geometry={nodes.pCube14_lambert40dsfmn_0.geometry}
                        material={materials.lambert40dsfmn}
                    />
                    <mesh
                        geometry={nodes.pCube15_lambert40dsfmn_0.geometry}
                        material={materials.lambert40dsfmn}
                    />
                    <mesh
                        geometry={nodes.cloud4_cloud_0.geometry}
                        material={materials.cloud}
                    />
                    <mesh
                        geometry={nodes.cloud4_cloud1_0.geometry}
                        material={materials.cloud1}
                    />
                    <mesh
                        geometry={nodes.pSphere1_lambert42_0.geometry}
                        material={materials.lambert42}
                    />
        </a.group>
    )
}

export default Island