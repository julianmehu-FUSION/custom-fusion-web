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
        
        {/* Outer Geometric Frame (Thick Atomic Chrome Rings to solve skinny wireframes) */}
        <group ref={outerRef}>
          {[
            [0, 0, 0],
            [Math.PI / 2, 0, 0],
            [0, Math.PI / 2, 0],
            [Math.PI / 4, Math.PI / 4, 0],
            [-Math.PI / 4, Math.PI / 4, 0]
          ].map((rot, i) => (
            <mesh key={i} rotation={rot}>
              <torusGeometry args={[2.5, 0.15, 16, 100]} />
              <meshStandardMaterial 
                color="#ffffff"
                roughness={0.05}     
                metalness={1.0}      
                envMapIntensity={2.5}  
              />
            </mesh>
          ))}
        </group>

        {/* Inner Organic 'Fusion' Core (Tiny Molten Neutron) */}
        <mesh ref={innerRef}>
          <sphereGeometry args={[0.6, 64, 64]} />
          <MeshDistortMaterial
            color="#b0c4de"      
            roughness={0.0}
            metalness={1.0}
            envMapIntensity={3}
            distort={0.4}        
            speed={4}            
          />
        </mesh>

      </Float>
    </>
  );
}
