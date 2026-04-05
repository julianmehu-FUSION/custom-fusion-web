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

    // 3. Center Core (inner 3): Glowing Blue Energy Source
    // We make it highly emissive rather than metallic so it looks like pure energy
    if (inner3GLTF.scene) {
      inner3GLTF.scene.traverse((child) => {
        if (child.isMesh) {
          child.material = new THREE.MeshStandardMaterial({
            color: '#0055ff',         
            emissive: '#00ccff',      // Brilliant neon blue glow
            emissiveIntensity: 2.0,   // Extremely bright
            metalness: 0.0,           // Energy isn't metallic
            roughness: 1.0,           // Non-reflective, just glowing
            transparent: true,
            opacity: 0.9              // Slight translucency for plasma effect
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

    // Spin and pulse the blue energy core
    if (inner3Ref.current) {
      inner3Ref.current.rotation.x -= delta * 0.5;
      inner3Ref.current.rotation.y += delta * 0.8;
      
      // Calculate a pulsing wave using Math.sin based on elapsed time
      // This will make the energy core expand and contract slightly like a beating heart
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.05;
      inner3Ref.current.scale.set(pulse, pulse, pulse);
      
      // Also pulse the emissive intensity of the material itself for a realistic glow flash
      inner3GLTF.scene.traverse((child) => {
        if (child.isMesh && child.material.emissiveIntensity !== undefined) {
          child.material.emissiveIntensity = 1.5 + Math.sin(state.clock.elapsedTime * 4) * 0.5;
        }
      });
    }

    // Pulse the actual PointLight to match the geometry
    if (pointLightRef.current) {
      pointLightRef.current.intensity = 15 + Math.sin(state.clock.elapsedTime * 4) * 5;
    }
  });

  return (
    <group scale={50}>
      
      {/* Dynamic Pulsing Light Source from the center */}
      <pointLight 
        ref={pointLightRef}
        position={[0, 0, 0]} 
        intensity={15} 
        distance={20} 
        color="#00ccff" 
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
