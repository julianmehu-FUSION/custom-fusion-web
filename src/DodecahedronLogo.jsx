import React, { useRef, useEffect, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment, Float, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

function LogoMeshes() {
  const outerRef = useRef();
  const inner1Ref = useRef();
  const inner3Ref = useRef();

  const outerGLTF = useGLTF('/assets/outer_sphere.glb');
  const inner1GLTF = useGLTF('/assets/inner_1.glb');
  const inner3GLTF = useGLTF('/assets/inner_3.glb');

  // Override materials on load
  useEffect(() => {
    if (outerGLTF.scene) {
      outerGLTF.scene.traverse((child) => {
        if (child.isMesh) {
          child.material = new THREE.MeshStandardMaterial({
            color: '#2a2a2c', // Glossy Zinc
            metalness: 1.0,
            roughness: 0.15,
            envMapIntensity: 2
          });
          child.material.needsUpdate = true;
        }
      });
    }

    // Give the inner cores the requested glowing blue orb look
    const glowingBlueMaterial = new THREE.MeshStandardMaterial({
      color: '#0055ff',         // Deep Blue Base
      emissive: '#00ccff',      // Glowing light blue
      emissiveIntensity: 0.5,   // Soft glow
      metalness: 0.8,
      roughness: 0.1,
      envMapIntensity: 2
    });

    if (inner1GLTF.scene) {
      inner1GLTF.scene.traverse((child) => {
        if (child.isMesh) {
          child.material = glowingBlueMaterial;
          child.material.needsUpdate = true;
        }
      });
    }

    if (inner3GLTF.scene) {
      inner3GLTF.scene.traverse((child) => {
        if (child.isMesh) {
          child.material = glowingBlueMaterial;
          child.material.needsUpdate = true;
        }
      });
    }

  }, [outerGLTF, inner1GLTF, inner3GLTF]);

  useFrame((state, delta) => {
    if (outerRef.current) {
      outerRef.current.rotation.x -= delta * 0.1;
      outerRef.current.rotation.y += delta * 0.15;
    }
    if (inner1Ref.current) {
      inner1Ref.current.rotation.x += delta * 0.4;
      inner1Ref.current.rotation.y -= delta * 0.3;
    }
    if (inner3Ref.current) {
      inner3Ref.current.rotation.x -= delta * 0.2;
      inner3Ref.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <group scale={50}>
      
      {/* Light source coming directly from the center globe */}
      <pointLight position={[0, 0, 0]} intensity={15} distance={10} color="#00aaff" />

      {/* Outer Sphere */}
      <primitive object={outerGLTF.scene} ref={outerRef} position={[0, 0, 0]} />

      {/* Inner Cores */}
      <primitive object={inner1GLTF.scene} ref={inner1Ref} position={[0, 0, 0]} />
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
      <directionalLight position={[5, 10, 5]} intensity={1} color="#ffffff" />
      <directionalLight position={[-5, -10, -5]} intensity={1} color="#DFFF00" />
      <ambientLight intensity={0.2} />

      <Suspense fallback={null}>
        <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
          <LogoMeshes />
        </Float>
      </Suspense>
    </>
  );
}
