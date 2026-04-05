import React, { useRef, useEffect, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment, Float, useGLTF, useTexture, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

function LogoMeshes() {
  const outerRef = useRef();
  const inner1Ref = useRef(); // The silver metal object
  const plasmaOrbRef = useRef(); // The swirling plasma orb
  const pointLightRef = useRef(); // To pulse the light emit

  const outerGLTF = useGLTF('/assets/outer_sphere.glb');
  const inner1GLTF = useGLTF('/assets/inner_1.glb');
  
  // Load the exact blue swirling smoke image the user provided
  const plasmaTexture = useTexture('/assets/plasma.jpg');

  // Override materials on the CAD geometry
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
  }, [outerGLTF, inner1GLTF]);

  // Physics animation loop
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

    // Spin the new plasma orb texture drastically to create a vortex
    if (plasmaOrbRef.current) {
      plasmaOrbRef.current.rotation.y += delta * 1.5;
      plasmaOrbRef.current.rotation.z += delta * 0.2;
      
      // Jitter the physical size of the plasma slightly so it feels like living energy
      const t = state.clock.elapsedTime;
      const flicker = Math.sin(t * 15) * 0.5 + Math.cos(t * 23) * 0.5;
      const scale = 1 + (flicker * 0.05);
      plasmaOrbRef.current.scale.set(scale, scale, scale);
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

      {/* Layer 3: Swirling Plasma Image Orb. 
          AdditiveBlending strips away the black background instantly, 
          leaving pure glowing blue magic mapped to a 3D sphere! */}
      <mesh ref={plasmaOrbRef} position={[0, 0, 0]}>
        {/* Adjusted scale to fit neatly inside the silver housing */}
        <sphereGeometry args={[0.85, 64, 64]} />
        <meshBasicMaterial 
          map={plasmaTexture} 
          transparent={true} 
          blending={THREE.AdditiveBlending} 
          depthWrite={false}
          side={THREE.DoubleSide} 
        />
      </mesh>

      {/* Rising Blue Embers / Fire Ash */}
      <Sparkles count={200} scale={2.5} size={2} speed={0.4} opacity={0.8} color="#88ccff" />

    </group>
  );
}

// Pre-load the gltf models and the texture image
useGLTF.preload('/assets/outer_sphere.glb');
useGLTF.preload('/assets/inner_1.glb');
useTexture.preload('/assets/plasma.jpg');

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
