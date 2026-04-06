import React, { useRef, useEffect, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment, Float, useGLTF, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

function LogoMeshes() {
  const outerRef = useRef();
  const inner1Ref = useRef(); 
  const knot1Ref = useRef(); 
  const knot2Ref = useRef(); 
  const pointLightRef = useRef(); 

  const outerGLTF = useGLTF('/assets/outer_sphere.glb');
  const inner1GLTF = useGLTF('/assets/inner_1.glb');
  
  // Override materials on the CAD geometry
  useEffect(() => {
    if (outerGLTF.scene) {
      outerGLTF.scene.traverse((child) => {
        if (child.isMesh) {
          // Rhino and CAD tools often export hidden low-poly bounding boxes or ground planes invisibly. 
          // By hiding objects with very few vertices (< 100), we strip out these giant box artifacts automatically.
          if (child.geometry && child.geometry.attributes.position.count < 100) {
            child.visible = false;
          } else {
            child.material = new THREE.MeshStandardMaterial({
              color: '#1a1a1c', 
              metalness: 1.0,
              roughness: 0.15,
              envMapIntensity: 2
            });
            child.material.needsUpdate = true;
          }
        }
      });
    }

    if (inner1GLTF.scene) {
      inner1GLTF.scene.traverse((child) => {
        if (child.isMesh) {
          if (child.geometry && child.geometry.attributes.position.count < 100) {
            child.visible = false;
          } else {
            child.material = new THREE.MeshStandardMaterial({
              color: '#ffffff', 
              metalness: 1.0,
              roughness: 0.05,
              envMapIntensity: 3
            });
            child.material.needsUpdate = true;
          }
        }
      });
    }
  }, [outerGLTF, inner1GLTF]);

  // Physics animation loop
  useFrame((state, delta) => {
    if (outerRef.current) {
      outerRef.current.rotation.x -= delta * 0.1;
      outerRef.current.rotation.y += delta * 0.15;
    }
    
    if (inner1Ref.current) {
      inner1Ref.current.rotation.x += delta * 0.3;
      inner1Ref.current.rotation.y -= delta * 0.2;
    }

    // Spin the chaotic energy knots in opposing directions to simulate the plasma strands swirling
    if (knot1Ref.current) {
      knot1Ref.current.rotation.y += delta * 1.8;
      knot1Ref.current.rotation.z += delta * 0.5;
    }
    if (knot2Ref.current) {
      knot2Ref.current.rotation.x -= delta * 1.5;
      knot2Ref.current.rotation.z -= delta * 1.2;
      
      const t = state.clock.elapsedTime;
      const flicker = Math.sin(t * 15) * 0.5 + Math.cos(t * 23) * 0.5;
      const scale = 1 + (flicker * 0.1);
      knot2Ref.current.scale.set(scale, scale, scale);
    }

    if (pointLightRef.current) {
      const t = state.clock.elapsedTime;
      const flicker = Math.sin(t * 15) * 0.5 + Math.cos(t * 23) * 0.5;
      pointLightRef.current.intensity = 20 + (flicker * 10);
    }
  });

  // A standalone material for the energy strands
  const plasmaStringMaterial = new THREE.MeshStandardMaterial({
    color: '#002244',
    emissive: '#11aaff',
    emissiveIntensity: 3.5,
    transparent: true,
    opacity: 0.7,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });

  return (
    <group scale={100}>
      
      {/* Dynamic Jitter Light */}
      <pointLight 
        ref={pointLightRef}
        position={[0, 0, 0]} 
        intensity={20} 
        distance={25} 
        color="#88ccff" 
      />

      <primitive object={outerGLTF.scene} ref={outerRef} position={[0, 0, 0]} />
      <primitive object={inner1GLTF.scene} ref={inner1Ref} position={[0, 0, 0]} />

      {/* Layer 3: Intersecting Energy Strands (Native 3D Torus Knots)
          This totally replaces the stretched image mapping and uses true 3D geometry
          to create glowing swirling plasma fields that look premium and high-end. */}
      
      {/* Inner swirling plasma strand */}
      <mesh ref={knot1Ref} material={plasmaStringMaterial} scale={[0.8, 0.8, 0.8]}>
        {/* Radius, Tube thickness, Tube segments (smoothness), Radial segments, p, q (knot complexity) */}
        <torusKnotGeometry args={[0.5, 0.05, 128, 16, 3, 5]} />
      </mesh>

      {/* Outer pulsing plasma strand */}
      <mesh ref={knot2Ref} material={plasmaStringMaterial} scale={[0.9, 0.9, 0.9]}>
        <torusKnotGeometry args={[0.45, 0.03, 150, 16, 4, 7]} />
      </mesh>

    </group>
  );
}

useGLTF.preload('/assets/outer_sphere.glb');
useGLTF.preload('/assets/inner_1.glb');

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
