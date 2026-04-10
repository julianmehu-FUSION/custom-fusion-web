import React, { useRef, useEffect, useState } from 'react';
import { useGLTF, Environment, PresentationControls, SoftShadows, ContactShadows } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Sequence phases in seconds
const CYCLE_DURATION = 12.0;

function ChairModel(props) {
  const group = useRef();
  const { scene, nodes } = useGLTF('/assets/fingerprint_chair.glb');

  // We assign base transform data so we guarantee everything has an anchor point
  useEffect(() => {
    scene.traverse((child) => {
      // 1. Establish initial anchor transforms for physics
      if (child.userData.basePos === undefined) {
        child.userData.basePos = child.position.clone();
        child.userData.baseRot = child.rotation.clone();
        child.userData.baseScale = child.scale.clone();
      }

      // 2. Material injection mapping
      if (child.isMesh && child.material && !child.userData.matFixed) {
        child.userData.matFixed = true;
        child.castShadow = true;
        child.receiveShadow = true;

        const name = child.name.toUpperCase();
        const oldMat = child.material.clone();

        if (name.includes('PLEXI') || name.includes('FINGERPRINT')) {
          child.material = new THREE.MeshPhysicalMaterial({
            color: '#ffffff',
            transmission: 1.0,
            opacity: 1.0,
            transparent: true,
            roughness: 0.1,
            ior: 1.5,
            thickness: 0.5,
            clearcoat: 1.0
          });
        } else if (name.includes('WOOD') || name.includes('EXTRUSION')) {
          child.material = new THREE.MeshPhysicalMaterial({
            color: '#f8f4f0',
            roughness: 0.8,
            metalness: 0.05
          });
          child.castShadow = true;
          child.receiveShadow = false;
        } else if (name.includes('SPRING') || name.includes('BASE') || name.includes('BAR')) {
          child.material = new THREE.MeshPhysicalMaterial({
            color: '#d4af37', // Rose Gold/Bronze hue from the thumbnail
            roughness: 0.3,
            metalness: 0.9,
            clearcoat: 0.5
          });
        } else if (name.includes('SEAT')) {
           child.material = new THREE.MeshStandardMaterial({
             color: '#1a1a1a',
             roughness: 0.9
           });
        } else {
          child.material = oldMat;
        }
      }
    });
  }, [scene]);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const progress = (time % CYCLE_DURATION) / CYCLE_DURATION; // 0.0 to 1.0

    // Split progressive animation into distinct construction waves vs deconstruction
    // 0.0 -> 0.1: Core Fingerprint flies in
    // 0.1 -> 0.2: Frame/Extrusions lock in
    // 0.2 -> 0.3: Seat hits
    // 0.3 -> 0.4: Base hits
    // 0.4 -> 0.7: Held state
    // 0.7 -> 1.0: Full rapid deconstruction shatter

    scene.traverse((child) => {
      if (!child.userData.basePos) return;

      const n = child.name.toUpperCase();
      
      let targetPos = child.userData.basePos.clone();
      let targetScale = child.userData.baseScale.clone();

      // Simple Easing helper
      const easeOut = (t) => 1 - Math.pow(1 - t, 3);
      const easeIn = (t) => t * t * t;

      let isVisible = true;
      let explodeMult = 0;

      // Group Identification
      const isCore = n.includes('PLEXI') || n.includes('FINGERPRINT');
      const isFrame = n.includes('WOOD') || n.includes('EXTRUSION');
      const isSeat = n.includes('SEAT');
      const isBase = n.includes('SPRING') || n.includes('BASE') || n.includes('BAR');

      // Construction Phase
      if (progress < 0.4) {
        if (isCore) {
           const p = Math.min(Math.max((progress - 0.0) / 0.1, 0), 1);
           const e = easeOut(p);
           targetPos.y += (1 - e) * 5; 
           targetScale.setScalar(e);
        } else if (isFrame) {
           const p = Math.min(Math.max((progress - 0.1) / 0.1, 0), 1);
           const e = easeOut(p);
           // Slide in from sides
           targetPos.x += (1 - e) * (Math.random() > 0.5 ? 5 : -5);
           targetScale.setScalar(e);
        } else if (isSeat) {
           const p = Math.min(Math.max((progress - 0.2) / 0.1, 0), 1);
           const e = easeOut(p);
           targetPos.z += (1 - e) * 5; 
           targetScale.setScalar(e);
        } else if (isBase) {
           const p = Math.min(Math.max((progress - 0.3) / 0.1, 0), 1);
           const e = easeOut(p);
           targetPos.y -= (1 - e) * 5; 
           targetScale.setScalar(e);
        }
      } 
      // Held State (progress 0.4 to 0.7)
      else if (progress < 0.7) {
         // Do nothing, base target is fine
      }
      // Deconstruction (Shatter)
      else {
         const p = Math.min(Math.max((progress - 0.7) / 0.3, 0), 1);
         const e = easeIn(p);
         
         // Shatter outwards procedurally
         // We use the string hash of name to keep vector consistent
         const hash = n.length; 
         targetPos.x += (hash % 2 === 0 ? 1 : -1) * e * 10;
         targetPos.y += (hash % 3 === 0 ? 1 : -1) * e * 10;
         targetPos.z += (hash % 5 === 0 ? 1 : -1) * e * 10;
         targetScale.setScalar(1 - Math.min(e * 1.5, 1));
      }

      // Smooth application physics
      child.position.lerp(targetPos, 0.15);
      child.scale.lerp(targetScale, 0.15);
    });
  });

  return (
    <group ref={group} {...props} dispose={null}>
      {/* We allow user control but the chair constructs itself around the center */}
      <PresentationControls global cursor={true} snap speed={1} zoom={1} polar={[-Math.PI / 4, Math.PI / 4]}>
        <primitive object={scene} position={[0, -0.5, 0]} />
      </PresentationControls>

      <Environment preset="city" blur={0.8} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow shadow-mapSize={[2048, 2048]} />
      
      {/* Soft contact shadow grounds the floating chair */}
      <ContactShadows resolution={1024} scale={20} blur={2} opacity={0.5} far={10} color="#000000" position={[0, -1, 0]} />
    </group>
  );
}

export default function FingerprintChair() {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: '500px', position: 'relative' }}>
      <Canvas shadows camera={{ position: [2, 2, 5], fov: 45 }}>
        <SoftShadows size={15} samples={10} focus={0.5} />
        <React.Suspense fallback={null}>
          <ChairModel />
        </React.Suspense>
      </Canvas>

      <div style={{ position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)', zIndex: 100, textAlign: 'center', pointerEvents: 'none' }}>
         <div style={{ color: '#222', fontFamily: 'var(--font-display)', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '4px' }}>
            FINGERPRINT CHAIR
         </div>
         <div style={{ color: '#666', fontFamily: 'var(--font-display)', fontSize: '8px', textTransform: 'uppercase', letterSpacing: '2px', marginTop: '4px' }}>
            CONSTRUCTION SEQUENCE ENABLED
         </div>
      </div>
    </div>
  );
}

// Preload to ensure smooth rendering 
useGLTF.preload('/assets/fingerprint_chair.glb');
