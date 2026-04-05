import React, { useRef, useEffect, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment, Float, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

function LogoMeshes() {
  const outerRef = useRef();
  const inner1Ref = useRef(); // The silver metal object
  const inner3Ref = useRef(); // The blue energy orb
  const pointLightRef = useRef(); // To pulse the light emit

  const outerGLTF = useGLTF('/assets/outer_sphere.glb');
  const inner1GLTF = useGLTF('/assets/inner_1.glb');
  const inner3GLTF = useGLTF('/assets/inner_3.glb');

  // Override materials on load
  useEffect(() => {
    // 1. Outer Sphere: Dark Metal
    if (outerGLTF.scene) {
      outerGLTF.scene.traverse((child) => {
        if (child.isMesh) {
          child.material = new THREE.MeshStandardMaterial({
            color: '#1a1a1c', // Very Dark Metal
            metalness: 1.0,
            roughness: 0.15,
            envMapIntensity: 2
          });
          child.material.needsUpdate = true;
        }
      });
    }

    // 2. Middle Structure (inner 1): Silver Metal
    if (inner1GLTF.scene) {
      inner1GLTF.scene.traverse((child) => {
        if (child.isMesh) {
          child.material = new THREE.MeshStandardMaterial({
            color: '#ffffff', // Pure Silver
            metalness: 1.0,
            roughness: 0.05,
            envMapIntensity: 3
          });
          child.material.needsUpdate = true;
        }
      });
    }

    // 3. Center Core (inner 3): Nuclear Fusion Fire Glow
    if (inner3GLTF.scene) {
      inner3GLTF.scene.traverse((child) => {
        if (child.isMesh) {
          child.material = new THREE.MeshStandardMaterial({
            color: '#ffffff',         // Frothy white core
            emissive: '#2288ff',      // Hot blue/white fire glow
            emissiveIntensity: 4.0,   
            metalness: 0.1,           
            roughness: 1.0,           
            transparent: true,
            opacity: 0.9              
          });
          child.material.needsUpdate = true;
        }
      });
    }
  }, [outerGLTF, inner1GLTF, inner3GLTF]);

  // Rotations + Pulsing Energy Animation
  useFrame((state, delta) => {
    // Spin outer shell slowly
    if (outerRef.current) {
      outerRef.current.rotation.x -= delta * 0.1;
      outerRef.current.rotation.y += delta * 0.15;
    }
    
    // Spin silver middle structure counter-directionally
    if (inner1Ref.current) {
      inner1Ref.current.rotation.x += delta * 0.3;
      inner1Ref.current.rotation.y -= delta * 0.2;
    }

    // Spin and violently pulse the nuclear fusion fire core
    if (inner3Ref.current) {
      inner3Ref.current.rotation.x -= delta * 0.8; // Spin faster
      inner3Ref.current.rotation.y += delta * 1.2;
      
      // Calculate a chaotic, flickering pulse using multiple high-frequency sine/cosine waves
      const t = state.clock.elapsedTime;
      const flicker = Math.sin(t * 15) * 0.5 + Math.cos(t * 23) * 0.5; // Chaotic [-1, 1] range
      const pulse = 1 + (flicker * 0.08); // Jitter physical size
      inner3Ref.current.scale.set(pulse, pulse, pulse);
      
      // Flicker the emissive intensity like a volatile burning star
      inner3GLTF.scene.traverse((child) => {
        if (child.isMesh && child.material.emissiveIntensity !== undefined) {
          child.material.emissiveIntensity = 3.0 + (flicker * 1.5);
        }
      });
    }

    // Flicker the actual PointLight to cast chaotic fire lighting onto the metal cage
    if (pointLightRef.current) {
      const t = state.clock.elapsedTime;
      const flicker = Math.sin(t * 15) * 0.5 + Math.cos(t * 23) * 0.5;
      pointLightRef.current.intensity = 20 + (flicker * 10);
    }
  });

  return (
    <group scale={100}>
      
      {/* Nuclear Fire Dynamic Jitter Light from the center */}
      <pointLight 
        ref={pointLightRef}
        position={[0, 0, 0]} 
        intensity={20} 
        distance={25} 
        color="#88ccff" 
      />

      {/* Layer 1: Dark Metal Outer Sphere */}
      <primitive object={outerGLTF.scene} ref={outerRef} position={[0, 0, 0]} />

      {/* Layer 2: Silver Metal Middle Shell */}
      <primitive object={inner1GLTF.scene} ref={inner1Ref} position={[0, 0, 0]} />

      {/* Layer 3: Blue Pulsing Energy Core */}
      <primitive object={inner3GLTF.scene} ref={inner3Ref} position={[0, 0, 0]} />

    </group>
  );
}

// Pre-load the gltf models
useGLTF.preload('/assets/outer_sphere.glb');
useGLTF.preload('/assets/inner_1.glb');
useGLTF.preload('/assets/inner_3.glb');

export default function DodecahedronLogo() {
  return (
    <>
      <Environment preset="city" />

      {/* Dimmed external lights so the internal center light pops more */}
      <directionalLight position={[5, 10, 5]} intensity={0.5} color="#ffffff" />
      <directionalLight position={[-5, -10, -5]} intensity={0.5} color="#DFFF00" />
      <ambientLight intensity={0.2} />

      <Suspense fallback={null}>
        <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
          <LogoMeshes />
        </Float>
      </Suspense>
    </>
  );
}
