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
    Object.values(materials).forEach((mat) => {
      if (!mat || !mat.name) return;
      const name = mat.name.toLowerCase();
      if (name.includes('glass')) {
        mat.transparent = true;
        mat.opacity = 0.6;
        mat.roughness = 0.05;
        mat.metalness = 0.9;
        mat.transmission = 0.9;
        mat.ior = 1.5;
      }
      if (name.includes('polished') || name.includes('metal')) {
        mat.roughness = 0.1;
        mat.metalness = 1.0;
        mat.envMapIntensity = 2.5;
      }
      if (name.includes('black')) {
        mat.roughness = 0.4;
        mat.metalness = 0.8;
      }
      mat.needsUpdate = true;
    });

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
    // Cabinet geometry was created in KeyShot and physically scaled to meters.
    // Inside KeyShot's root hierarchy, `Z` is vertical altitude (Lift), and `Y` is front/back depth (Drawer).
    const targetDrawer = open ? -0.45 : 0; // Pulls drawer OUT
    const targetLift = open ? 0.28 : 0;  // Elevates liquor UP

    drawerVal.current = THREE.MathUtils.damp(drawerVal.current, targetDrawer, 5, delta);
    liftVal.current = THREE.MathUtils.damp(liftVal.current, targetLift, 4, delta);

    Object.keys(nodes).forEach(key => {
      const node = nodes[key];
      if (!node || node.userData.basePos === undefined) return;
      
      const isDrawer = key.includes('DRAWER') || key.includes('ICE_TRAY') || key.includes('ICE_IN_TRAY');
      const isLift = key.includes('LIFT') || key.includes('LIQUID') || key.includes('BOTTLE') || key.includes('CAP') || key.includes('COGNAC') || key.includes('WHISKY') || key.includes('VODKA') || key.includes('SHOT');

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
