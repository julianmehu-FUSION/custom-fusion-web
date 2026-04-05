import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment, Float } from '@react-three/drei';
import * as THREE from 'three';

export default function DodecahedronLogo() {
  const meshRef = useRef();

  // Add continuous automatic rotation
  useFrame((state, delta) => {
    meshRef.current.rotation.x -= delta * 0.15;
    meshRef.current.rotation.y += delta * 0.2;
  });

  return (
    <>
      {/* City environment provides the light reflections that make metal look real */}
      <Environment preset="city" />

      {/* Dramatic main light */}
      <directionalLight position={[5, 10, 5]} intensity={2.5} color="#ffffff" />
      <directionalLight position={[-5, -10, -5]} intensity={1.5} color="#DFFF00" />
      <ambientLight intensity={0.5} />

      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <mesh ref={meshRef}>
          {/* A dodecahedron geometry with radius 2.5 */}
          <dodecahedronGeometry args={[2.5, 0]} />
          
          <meshStandardMaterial 
            color="#0a0a0a"      /* Deep dark base */
            roughness={0.15}     /* Slightly rough so it's not a complete mirror */
            metalness={0.9}      /* Very metallic */
            envMapIntensity={2}  /* Strong reflections */
          />

          {/* Yellow glowing edges */}
          <lineSegments>
            <edgesGeometry args={[new THREE.DodecahedronGeometry(2.5, 0)]} />
            <lineBasicMaterial color="#DFFF00" linewidth={1} opacity={0.6} transparent={true} />
          </lineSegments>
        </mesh>
      </Float>
    </>
  );
}
