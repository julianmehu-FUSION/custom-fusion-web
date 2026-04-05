import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment, Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

export default function DodecahedronLogo() {
  const outerRef = useRef();
  const innerRef = useRef();

  useFrame((state, delta) => {
    outerRef.current.rotation.x -= delta * 0.1;
    outerRef.current.rotation.y += delta * 0.15;
    innerRef.current.rotation.x += delta * 0.2;
    innerRef.current.rotation.y -= delta * 0.1;
  });

  return (
    <>
      <Environment preset="city" />

      {/* Dramatic main light */}
      <directionalLight position={[5, 10, 5]} intensity={3} color="#ffffff" />
      <directionalLight position={[-5, -10, -5]} intensity={2} color="#DFFF00" />
      <ambientLight intensity={0.5} />

      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        
        {/* Outer Geometric Frame (Simulating the complex geometric struts) */}
        <mesh ref={outerRef}>
          <icosahedronGeometry args={[2.5, 1]} />
          <meshStandardMaterial 
            color="#ffffff"
            roughness={0.1}     
            metalness={1.0}      
            envMapIntensity={2}  
            wireframe={true}     
          />
        </mesh>

        {/* Inner Organic 'Fusion' Core (Simulating the complex inner metallic liquid look) */}
        <mesh ref={innerRef}>
          <sphereGeometry args={[1.8, 64, 64]} />
          <MeshDistortMaterial
            color="#b0c4de"      /* Slightly blue/silver tint */
            roughness={0.0}
            metalness={1.0}
            envMapIntensity={3}
            distort={0.4}        /* Creates the organic wobbly shape */
            speed={2}            /* Undulation speed */
          />
        </mesh>

      </Float>
    </>
  );
}
