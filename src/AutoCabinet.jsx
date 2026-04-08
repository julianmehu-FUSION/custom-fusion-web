import React, { useRef, useEffect, useState } from 'react';
import { useGLTF, PresentationControls, Environment, ContactShadows, Float, Center, Bounds, Html, Backdrop, SoftShadows } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Categorize logic for raycaster
const checkIsDrawer = (nameMatch) => nameMatch.includes('DRAWER') || nameMatch.includes('ICE') || nameMatch.includes('TRAY') || nameMatch.includes('CUP') || nameMatch.includes('GLASS');
const checkIsLift = (nameMatch) => nameMatch.includes('LIFT') || nameMatch.includes('BOTTLE') || nameMatch.includes('CAP') || nameMatch.includes('COGNAC') || nameMatch.includes('WHISKY') || nameMatch.includes('VODKA') || nameMatch.includes('SHOT') || nameMatch.includes('TOP') || nameMatch.includes('LIQUI');

function CabinetModel(props) {
  const group = useRef();
  const { scene, nodes } = useGLTF('/assets/autocabinet.glb');
  
  // Separate states
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openLift, setOpenLift] = useState(false);
  const [hovered, setHovered] = useState(null);

  const drawerVal = useRef(0);
  const liftVal = useRef(0);

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'grab';
  }, [hovered]);

  useEffect(() => {
    // Manually force all CAD materials surgically per user request
    const cameras = [];
    scene.traverse((child) => {
      if (child.isCamera) {
        cameras.push(child);
      }
      if (child.isMesh) {
        if (child.userData.basePos === undefined) {
          child.userData.basePos = child.position.clone();
        }
        
        // Essential for photoreal backdrop shading
        child.castShadow = true;
        child.receiveShadow = true;

        const name = child.name.toUpperCase();
        
        // Safely upgrade or mutate materials, preserving UV maps where needed!
        if (!child.userData.matFixed && child.material) {
           const oldMat = child.material;
           child.userData.matFixed = true;

           if (name.includes('LINER')) {
             // Rose Gold Lip
             child.material = oldMat.clone();
             child.material.color.set('#ebb8ad');
             child.material.metalness = 1.0;
             child.material.roughness = 0.2;
           } else if (name.includes('OUTER') || name.includes('TOP') || name.includes('BASE') || name.includes('DRAWER') || name.includes('BRACKET')) {
             // Eggshell White Plastic
             child.material = oldMat.clone();
             child.material.color.set('#f2f1ee'); 
             child.material.metalness = 0.05;
             child.material.roughness = 0.55; 
           } else if (name.includes('EMBLEM')) {
             // Custom Fusion Silver Logo
             child.material = oldMat.clone();
             child.material.color.set('#fcfcfc');
             child.material.metalness = 1.0;
             child.material.roughness = 0.1;
           } else if (name.includes('GLASS') || name.includes('CUP') || name.includes('BOTTLE')) {
             // Glass Cups and Bottles - Safely upgrade to PhysicalMaterial
             child.material = new THREE.MeshPhysicalMaterial({
                color: '#ffffff', transparent: true, transmission: 1.0,
                opacity: 1.0, roughness: 0.05, ior: 1.5, thickness: 1.0,
                map: oldMat.map, normalMap: oldMat.normalMap, 
                roughnessMap: oldMat.roughnessMap, metalnessMap: oldMat.metalnessMap
             });
           } else if (name.includes('LIQUID')) {
             // Amber Alcohol - Safely upgrade to PhysicalMaterial
             child.material = new THREE.MeshPhysicalMaterial({
                color: '#b55d05', transparent: true, opacity: 0.95, 
                transmission: 0.5, roughness: 0.05,
                map: oldMat.map, normalMap: oldMat.normalMap
             });
           }
        }
      }
    });
    cameras.forEach(cam => {
      cam.visible = false;
      cam.removeFromParent();
    });
  }, [scene]);

  useFrame((state, delta) => {
    // Threaded motor lift physics - scaled to mm exports
    const targetDrawer = -15.0; 
    const targetLift = 20.0;  
    const speedDrawer = 10.0 * delta;
    const speedLift = 15.0 * delta;

    if (openDrawer) drawerVal.current = Math.max(targetDrawer, drawerVal.current - speedDrawer);
    else drawerVal.current = Math.min(0, drawerVal.current + speedDrawer);

    if (openLift) liftVal.current = Math.min(targetLift, liftVal.current + speedLift);
    else liftVal.current = Math.max(0, liftVal.current - speedLift);

    Object.keys(nodes).forEach(key => {
      const node = nodes[key];
      if (!node || node.userData.basePos === undefined) return;
      
      const nameMatch = key.toUpperCase();
      
      if (checkIsDrawer(nameMatch)) {
        node.position.y = node.userData.basePos.y + drawerVal.current;
      }
      if (checkIsLift(nameMatch)) {
        node.position.z = node.userData.basePos.z + liftVal.current;
      }
    });
  });

  return (
    <group ref={group} {...props} dispose={null}>
      <Html position={[0, -2, 4]} center style={{ pointerEvents: 'none', transition: 'opacity 0.2s', opacity: hovered ? 1 : 0, transform: 'translate3d(0,0,0)' }}>
        <div style={{ background: '#fff', color: '#000', padding: '6px 14px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '11px', fontFamily: 'sans-serif', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          {hovered === 'drawer' ? 'Click to Toggle Drawer' : hovered === 'lift' ? 'Click to Toggle Lift' : ''}
        </div>
      </Html>

      <PresentationControls global={false} cursor={false} snap={true} speed={1} zoom={1} rotation={[0.0, 0.0, 0]} polar={[-0.2, 0.5]} azimuth={[-Math.PI / 1.5, Math.PI / 1.5]}>
        <Float speed={1.0} rotationIntensity={0.1} floatIntensity={0.2}>
          <Bounds fit clip observe margin={1.2}>
            <Center>
              <primitive 
                object={scene} 
                onPointerOver={(e) => {
                  e.stopPropagation();
                  if (checkIsDrawer(e.object.name.toUpperCase())) setHovered('drawer');
                  else setHovered('lift');
                }}
                onPointerOut={(e) => {
                  setHovered(null);
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  const nameMatch = e.object.name.toUpperCase();
                  if (checkIsDrawer(nameMatch)) setOpenDrawer(o => !o);
                  else setOpenLift(o => !o);
                }}
              />
            </Center>
          </Bounds>
        </Float>
      </PresentationControls>

      {/* Invisible environment map merely for realistic glossy reflections, zero backdrop rendering */}
      <Environment preset="city" blur={1} background={false} />

      {/* Lighting optimized for shadows */}
      <ambientLight intensity={0.5} color="#ffffff" />
      <directionalLight 
         position={[8, 12, 10]} 
         intensity={1.0} 
         color="#ffffff" 
         castShadow 
         shadow-mapSize={[1024, 1024]}
         shadow-camera-far={50}
         shadow-camera-left={-10}
         shadow-camera-right={10}
         shadow-camera-top={10}
         shadow-camera-bottom={-10}
      />
      
      {/* Physical Photography Backdrop */}
      <Backdrop 
        receiveShadow 
        floor={5} 
        segments={30} 
        position={[0, -2.5, -4]} 
        scale={[20, 10, 10]}
      >
        <meshStandardMaterial color="#ffffff" roughness={1} />
      </Backdrop>

      {/* Ambient shadow falloff for realism */}
      <ContactShadows position={[0, -2.48, 0]} opacity={0.6} scale={15} blur={2.0} far={4} color="#000000" />
    </group>
  );
}

export default function AutoCabinet() {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: '500px' }}>
      <Canvas shadows camera={{ position: [0, 0, 8], fov: 45 }} dpr={[1, 2]}>
        <SoftShadows size={25} samples={10} focus={0.5} />
        <React.Suspense fallback={null}>
          <CabinetModel />
        </React.Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload('/assets/autocabinet.glb');


