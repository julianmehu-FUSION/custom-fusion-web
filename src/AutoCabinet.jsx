import React, { useRef, useEffect, useState } from 'react';
import { useGLTF, PresentationControls, Environment, ContactShadows, Float, Center, Bounds } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function CabinetModel(props) {
  const group = useRef();
  const { scene, nodes, materials } = useGLTF('/assets/autocabinet.glb');
  const [open, setOpen] = useState(false);
  const drawerVal = useRef(0);
  const liftVal = useRef(0);

  useEffect(() => {
    // Restore and fix physical properties.
    Object.values(materials).forEach((mat) => {
      if (!mat || !mat.name) return;
      const name = mat.name.toLowerCase();
      
      // Fix KeyShot default black paint for WebGL so it looks like polished plastic instead of a black void
      if (name.includes('black')) {
        mat.color.set('#1a1a1c'); // Dark graphite/off-black for depth
        mat.roughness = 0.15; // Smooth polished plastic
        mat.metalness = 0.1; // Plastic is dielectric, not 100% metal
        mat.envMapIntensity = 1.5;
        mat.needsUpdate = true;
      }

      if (name.includes('glass')) {
        mat.transparent = true;
        mat.transmission = 1.0;
        mat.opacity = 1.0;
        mat.roughness = 0.05;
        mat.ior = 1.5;
        mat.thickness = 1.0;
        mat.color.set('#ffffff'); // Fixes the black void
        mat.needsUpdate = true;
      }
      
      if (name.includes('liquid')) {
        mat.transparent = true;
        mat.opacity = 0.85;
        mat.roughness = 0.1;
        mat.transmission = 0.9;
        mat.envMapIntensity = 2.0;
        mat.needsUpdate = true;
      }
      
      if (name.includes('platinum') || name.includes('metal')) {
        mat.metalness = 1.0;
        mat.roughness = 0.15;
        mat.envMapIntensity = 2.5;
        mat.needsUpdate = true;
      }
    });
    
    // Only adjust cameras
    const cameras = [];
    scene.traverse((child) => {
      if (child.isCamera) {
        cameras.push(child);
      }
      // Store original mesh positions natively for offsets
      if (child.isMesh && child.userData.basePos === undefined) {
        child.userData.basePos = child.position.clone();
      }
    });
    cameras.forEach(cam => {
      cam.visible = false;
      cam.removeFromParent();
    });
  }, [materials, scene]);

  useFrame((state, delta) => {
    // Cabinet geometry was created in KeyShot and physically scaled to millimeters natively.
    // We must offset them by hundreds of units to see visible movement inside the scale!
    const targetDrawer = open ? -350 : 0; // Pulls drawer OUT significantly
    const targetLift = open ? 250 : 0;  // Elevates liquor UP significantly

    drawerVal.current = THREE.MathUtils.damp(drawerVal.current, targetDrawer, 5, delta);
    liftVal.current = THREE.MathUtils.damp(liftVal.current, targetLift, 4, delta);

    Object.keys(nodes).forEach(key => {
      const node = nodes[key];
      if (!node || node.userData.basePos === undefined) return;
      
      // Convert space strings to match exactly how GLTF formats node names (underscores)
      const nameMatch = key.toUpperCase();
      const isDrawer = nameMatch.includes('DRAWER') || nameMatch.includes('ICE') || nameMatch.includes('TRAY');
      const isLift = nameMatch.includes('LIFT') || nameMatch.includes('LIQUI') || nameMatch.includes('BOTTLE') || nameMatch.includes('CAP') || nameMatch.includes('COGNAC') || nameMatch.includes('WHISKY') || nameMatch.includes('VODKA') || nameMatch.includes('SHOT') || nameMatch.includes('TOP');

      // KeyShot default group rotation is [-PI/2, 0, 0]. 
      // Inside this local space: Y points OUT, Z points UP.
      if (isDrawer) {
        node.position.y = node.userData.basePos.y + drawerVal.current;
      }
      if (isLift) {
        node.position.z = node.userData.basePos.z + liftVal.current;
      }
    });

    // Make the cabinet very slightly wobble if it's opened to feel mechanical
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, open ? Math.sin(state.clock.elapsedTime * 2) * 0.01 : 0, 0.1);
  });

  return (
    <group ref={group} {...props} dispose={null} onClick={(e) => { e.stopPropagation(); setOpen(!open); }}>
      <PresentationControls global={false} cursor={true} snap={true} speed={1} zoom={1} rotation={[0.1, -Math.PI / 4, 0]} polar={[-0.2, Math.PI / 4]} azimuth={[-Math.PI / 1.5, Math.PI / 1.5]}>
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
          <Bounds fit clip observe margin={1.2}>
            <Center>
              <primitive object={scene} />
            </Center>
          </Bounds>
        </Float>
      </PresentationControls>
      <Environment preset="studio" intensity={1.5} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} />
      <directionalLight position={[-10, 5, -5]} intensity={0.5} />
      <ambientLight intensity={0.4} />
      <ContactShadows position={[0, -2.5, 0]} opacity={0.6} scale={15} blur={1.5} far={4} />
    </group>
  );
}

export default function AutoCabinet() {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: '500px', cursor: 'grab' }}>
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }} dpr={[1, 2]}>
        <React.Suspense fallback={null}>
          <CabinetModel />
        </React.Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload('/assets/autocabinet.glb');


