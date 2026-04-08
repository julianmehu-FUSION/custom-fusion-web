import React, { useRef, useEffect } from 'react';
import { useGLTF, useAnimations, PresentationControls, Environment, ContactShadows, Float } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';

function CabinetModel(props) {
  const group = useRef();
  const { scene, animations, materials } = useGLTF('/assets/autocabinet.glb');
  const { actions } = useAnimations(animations, group);

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

    if (actions) {
      Object.values(actions).forEach(action => {
        if (action) action.play();
      });
    }

    const cameras = [];
    scene.traverse((child) => {
      if (child.isCamera) {
        cameras.push(child);
      }
    });
    cameras.forEach(cam => {
      cam.visible = false;
      cam.removeFromParent();
    });
  }, [materials, actions, scene]);

  return (
    <group ref={group} {...props} dispose={null}>
      <PresentationControls global={false} cursor={true} snap={true} speed={1} zoom={1} rotation={[0.1, -Math.PI / 4, 0]} polar={[-0.2, Math.PI / 4]} azimuth={[-Math.PI / 1.5, Math.PI / 1.5]}>
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
          <primitive object={scene} scale={0.025} position={[0, -2, 0]} />
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
