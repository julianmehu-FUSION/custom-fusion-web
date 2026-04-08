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
        mat.color.set('#fdfdfd'); // Satin white plastic
        mat.roughness = 0.45; // Smooth satin plastic without sharp mirror reflections
        mat.metalness = 0.05; // Less metallic reflection
        mat.envMapIntensity = 0.8; // Dimmer environment reflections
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
    
    // Only adjust cameras and manually force the Lip to Rose Gold
    const cameras = [];
    scene.traverse((child) => {
      if (child.isCamera) {
        cameras.push(child);
      }
      // Store original mesh positions natively for offsets
      if (child.isMesh && child.userData.basePos === undefined) {
        child.userData.basePos = child.position.clone();
      }
      // Hard override the Liner (Lip) to be polished Rose Gold
      if (child.isMesh && child.name.toUpperCase().includes('LINER')) {
        child.material = new THREE.MeshStandardMaterial({
          color: '#e0bfb8',
          metalness: 1.0,
          roughness: 0.15,
          envMapIntensity: 1.5
        });
      }
    });
    cameras.forEach(cam => {
      cam.visible = false;
      cam.removeFromParent();
    });
  }, [materials, scene]);

  useFrame((state, delta) => {
    // Uses linear math to simulate a slow, mechanical threaded motor lift
    const targetDrawer = -15.0; // Greatly increased distance for millimeter scale
    const targetLift = 20.0;  // Greatly increased distance for millimeter scale
    
    // Constant units per second
    const speedDrawer = 8.0 * delta;
    const speedLift = 10.0 * delta;

    if (open) {
      drawerVal.current = Math.max(targetDrawer, drawerVal.current - speedDrawer);
      liftVal.current = Math.min(targetLift, liftVal.current + speedLift);
    } else {
      // Reverse motor
      drawerVal.current = Math.min(0, drawerVal.current + speedDrawer);
      liftVal.current = Math.max(0, liftVal.current - speedLift);
    }

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
  });

  return (
    <group ref={group} {...props} dispose={null} onClick={(e) => { e.stopPropagation(); setOpen(!open); }}>
      <PresentationControls global={false} cursor={true} snap={true} speed={1} zoom={1} rotation={[0.0, 0.0, 0]} polar={[-0.2, 0.5]} azimuth={[-Math.PI / 1.5, Math.PI / 1.5]}>
        <Float speed={1.0} rotationIntensity={0.1} floatIntensity={0.2}>
          <Bounds fit clip observe margin={1.2}>
            <Center>
              <primitive object={scene} />
            </Center>
          </Bounds>
        </Float>
      </PresentationControls>
      <Environment preset="city" blur={0.8} intensity={1.2} />
      <directionalLight position={[0, 10, 10]} intensity={1.2} color="#ffffff" />
      <directionalLight position={[-10, 5, -10]} intensity={0.4} color="#eef" />
      <ambientLight intensity={0.6} />
      <ContactShadows position={[0, -2.5, 0]} opacity={0.3} scale={15} blur={2.0} far={4} color="#000" />
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


