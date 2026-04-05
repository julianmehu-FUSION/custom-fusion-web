import React, { useRef, useEffect, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment, Float, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

function LogoMeshes() {
  const outerRef = useRef();
  const inner1Ref = useRef(); 
  const inner3Ref = useRef(); 
  const pointLightRef = useRef(); 

  const outerGLTF = useGLTF('/assets/outer_sphere.glb');
  const inner1GLTF = useGLTF('/assets/inner_1.glb');
  const inner3GLTF = useGLTF('/assets/inner_3.glb');
  
  useEffect(() => {
    // 1. Dark Metal Outer Shell
    if (outerGLTF.scene) {
      outerGLTF.scene.traverse((child) => {
        if (child.isMesh) {
          child.visible = true; // Ensure nothing is accidentally hidden
          child.material = new THREE.MeshStandardMaterial({
            color: '#1a1a1c', 
            metalness: 1.0,
            roughness: 0.15,
            envMapIntensity: 2
          });
          child.material.needsUpdate = true;
        }
      });
    }

    // 2. Pure Silver Middle Shell
    if (inner1GLTF.scene) {
      inner1GLTF.scene.traverse((child) => {
        if (child.isMesh) {
          child.visible = true; 
          child.material = new THREE.MeshStandardMaterial({
            color: '#ffffff', 
            metalness: 1.0,
            roughness: 0.05,
            envMapIntensity: 3
          });
          child.material.needsUpdate = true;
        }
      });
    }

    // 3. Glowing Glassy Plasma Orb (inner 3 CAD)
    if (inner3GLTF.scene) {
      inner3GLTF.scene.traverse((child) => {
        if (child.isMesh) {
          child.visible = true;
          // Upgrading to an elite MeshPhysicalMaterial to mimic true dense glowing energy plasma 
          child.material = new THREE.MeshPhysicalMaterial({
            color: '#00ccff',         // Base neon blue
            emissive: '#0055ff',      // Deep underlying glow
            emissiveIntensity: 2.0,
            metalness: 0.1,
            roughness: 0.0,           // Perfectly smooth
            transmission: 0.9,        // Allows light to pass through like liquid glass
            ior: 1.5,                 // Glow refraction
            thickness: 2.0,           
            clearcoat: 1.0,           // Glossy plasma shell
            transparent: true,
            opacity: 0.95
          });
          child.material.needsUpdate = true;
        }
      });
    }
  }, [outerGLTF, inner1GLTF, inner3GLTF]);

  useFrame((state, delta) => {
    // Spin outer shell
    if (outerRef.current) {
      outerRef.current.rotation.x -= delta * 0.1;
      outerRef.current.rotation.y += delta * 0.15;
    }
    
    // Spin silver mid-cage faster in opposite direction
    if (inner1Ref.current) {
      inner1Ref.current.rotation.x += delta * 0.3;
      inner1Ref.current.rotation.y -= delta * 0.2;
    }

    // Spin and pulse the glowing inner core
    if (inner3Ref.current) {
      inner3Ref.current.rotation.x -= delta * 0.5;
      inner3Ref.current.rotation.y += delta * 0.8;
      
      const t = state.clock.elapsedTime;
      const flicker = Math.sin(t * 15) * 0.5 + Math.cos(t * 23) * 0.5;
      const scale = 1 + (flicker * 0.04);
      inner3Ref.current.scale.set(scale, scale, scale);

      inner3GLTF.scene.traverse((child) => {
        if (child.isMesh && child.material.emissiveIntensity !== undefined) {
          child.material.emissiveIntensity = 2.0 + (flicker * 2.0); // Flicker intensity violently
        }
      });
    }

    // Flicker internal light source casting on the silver shell
    if (pointLightRef.current) {
      const t = state.clock.elapsedTime;
      const flicker = Math.sin(t * 15) * 0.5 + Math.cos(t * 23) * 0.5;
      pointLightRef.current.intensity = 20 + (flicker * 10);
    }
  });

  return (
    <group scale={100}>
      <pointLight 
        ref={pointLightRef}
        position={[0, 0, 0]} 
        intensity={20} 
        distance={25} 
        color="#aaddff" 
      />

      <primitive object={outerGLTF.scene} ref={outerRef} position={[0, 0, 0]} />
      <primitive object={inner1GLTF.scene} ref={inner1Ref} position={[0, 0, 0]} />
      <primitive object={inner3GLTF.scene} ref={inner3Ref} position={[0, 0, 0]} />
    </group>
  );
}

useGLTF.preload('/assets/outer_sphere.glb');
useGLTF.preload('/assets/inner_1.glb');
useGLTF.preload('/assets/inner_3.glb');

export default function DodecahedronLogo() {
  return (
    <>
      <Environment preset="city" />

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
