import React, { useRef, useEffect } from 'react';
import { Canvas, useLoader, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const MonitorModel = () => {
  const { scene } = useGLTF('/pc_monitor_27_inch.glb');
  const texture = useLoader(THREE.TextureLoader, 'Screen.png');
  const { gl } = useThree();

  useEffect(() => {
    scene.traverse((child) => {
      console.log(child.name);
      if (child.name === "Screen_Display_0") {
          child.material.map = texture;
          console.log('Applied new texture to Object_2');
        }
    });
  }, [scene, texture, gl]);

  return <primitive object={scene} scale={[2, 2, 2]} position={[0, -2, 0]} rotation={[0, Math.PI / -12, 0]} />;
};

const Monitor = () => {
  return (
    <Canvas style={{ height: '100%', width: '100%' }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <MonitorModel />
      <OrbitControls />
    </Canvas>
  );
};

export default Monitor;