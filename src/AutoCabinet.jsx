import React, { useRef, useEffect, useState } from 'react';
import { useGLTF, PresentationControls, Environment, ContactShadows, Float, Center, Bounds, Backdrop, SoftShadows } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import { Html, useProgress } from '@react-three/drei';

function Loader() {
  const { progress } = useProgress()
  return <Html center><div style={{ color: '#888', whiteSpace: 'nowrap', fontFamily: 'var(--font-[family-name:var(--font-sans)])' }}>Loading Model... {Math.round(progress)}%</div></Html>
}

// Categorize logic for motion by explicitly targeting the user's cleanly separated parent groups
// We will evaluate this on individual meshes to prevent double-translation!
const isDrawerItem = (mesh) => {
  let p = mesh;
  while(p) { if (p.name === 'ICE DRAWER') return true; p = p.parent; }
  return false;
};

// Tightly restrict LIFT so it exclusively targets the TOP assembly inside the ALCOHOL LIFT body
const isLiftItem = (mesh) => {
  let p = mesh;
  while(p) { if (p.name === 'TOP' && p.parent && p.parent.name === 'ALCOHOL LIFT') return true; p = p.parent; }
  return false;
};

function CabinetModel({ setHoverText, ...props }) {
  const group = useRef();
  const { scene, nodes } = useGLTF('/assets/new_liquor_cabinet.glb');
  
  // Separate states
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openLift, setOpenLift] = useState(false);

  const drawerVal = useRef(0);
  const liftVal = useRef(0);

  useEffect(() => {
    console.group('GLTF Node Audit');
    scene.traverse(child => {
      if (child.name) console.log(`[${child.type}] "${child.name}"`);
    });
    console.groupEnd();

    // Manually force all CAD materials surgically per user request
    const cameras = [];
    scene.traverse((child) => {
      if (child.userData.basePos === undefined) {
        child.userData.basePos = child.position.clone();
      }

      if (child.isCamera) {
        cameras.push(child);
      }
      if (child.isMesh) {
        // Resolve self-shadowing acne that makes CAD models appear black
        child.castShadow = true;
        child.receiveShadow = false;
        
        const name = child.name.toUpperCase();
        
        // Remove weird shadows from the front exterior shell by disabling self-casting for the outer body!
        if (name.includes('OUTER') || name.includes('CABINET') || name.includes('TOP SHELL')) {
             child.castShadow = false;
        }

        // Safely upgrade or mutate materials, preserving UV maps where needed!
        if (!child.userData.matFixed && child.material) {
           const oldMat = child.material;
           child.userData.matFixed = true;

           // WE EXPLICITLY SHIELD THE "GEAR TRACK" SO THE SLIDER RAILS DO NOT GO MISSING!
           if (name.includes('BRACKET') || name.includes('MOTOR') || name === 'DEFAULT' || name.includes('CYLINDER') || name.includes('PIPE') || (name.includes('GEAR') && !name.includes('TRACK'))) {
              child.visible = false;
              return;
           }

           // PROVEN GEOMETRIC TAB CULLING (TARGETING TOP TABS ONLY):
           // By keeping this strictly off the 'LIFT' namespace, we guarantee the entire Lift Floor perfectly survives!!
           if (name.startsWith('TOP')) {
              child.geometry.computeBoundingBox();
              const bbox = child.geometry.boundingBox;
              const cx = (bbox.max.x + bbox.min.x) / 2;
              const dx = bbox.max.x - bbox.min.x;
              const dy = bbox.max.y - bbox.min.y; 
              const dz = bbox.max.z - bbox.min.z; 
              
              if (Math.abs(cx) > (dx * 0.5) + 0.1 && dx < 8.2 && dy < 8.2 && dz < 8.2) {
                  child.visible = false;
                  return;
              }
           }

           // GLOSS WHITE SHELL requested by user. Safely override by mapping exist material instead of creating new ones
           if (name.includes('OUTER') || name.includes('CABINET') || name.includes('TOP SHELL') || name.includes('DRAWER')) {
             child.material = oldMat.clone();
             const paintGlossWhite = (m) => {
                 if (m.color) m.color.set('#ffffff');
                 m.metalness = 0.1;
                 m.roughness = 0.1; 
                 m.map = null; 
                 if (m.normalMap) m.normalMap = null;
                 m.needsUpdate = true;
             };
             if (Array.isArray(child.material)) child.material.forEach(paintGlossWhite);
             else paintGlossWhite(child.material);
           } else if (name.includes('EMBLEM') || name.includes('LOGO')) {
             child.material = oldMat.clone();
             child.material.color.set('#e5e4e2'); // Platinum metal
             child.material.metalness = 1.0;
             child.material.roughness = 0.2;
             if (!child.userData.recessed) {
                child.position.y -= 0.01; 
                if (child.userData.basePos) child.userData.basePos.y -= 0.01; 
                child.userData.recessed = true;
             }
           } else if (name.includes('LINER')) {
             child.material = oldMat.clone();
             child.material.color.set('#e0a996');
             child.material.metalness = 1.0;
             child.material.roughness = 0.2;
           } else if (name.includes('BASE')) {
             child.material = oldMat.clone();
             child.material.color.set('#aca8a0');
           } else if ((name.includes('GLASS') || name.includes('CUP')) && !name.includes('MAT')) {
             child.material = oldMat.clone();
             child.material.transparent = true;
             child.material.opacity = 0.4; 
             child.material.roughness = 0.1;
             child.material.envMapIntensity = 2.0;
           } else if (name.includes('LIQUID')) {
             child.material = oldMat.clone();
             child.material.color.set('#d48f37'); 
             child.material.transparent = true;
             child.material.opacity = 0.95;
           } else {
             // Catch all restoring items like the BOTTLES which need their baked KeyShot textures!
             child.material = oldMat;
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

    scene.traverse((child) => {
      if (!child.userData.basePos) return;
      
      // ONLY translate meshes (child.isMesh). If we translated groups, their child meshes would move twice!
      if (child.isMesh && isDrawerItem(child)) {
        child.position.y = child.userData.basePos.y + drawerVal.current;
      }
      if (child.isMesh && isLiftItem(child)) {
        child.position.z = child.userData.basePos.z + liftVal.current;
      }
    });
  });

  return (
    <group ref={group} {...props} dispose={null}>
      <PresentationControls global={false} cursor={false} snap={true} speed={1} zoom={1} rotation={[0.0, 0.0, 0]} polar={[-0.2, 0.5]} azimuth={[-Math.PI / 1.5, Math.PI / 1.5]}>
        <Float speed={1.0} rotationIntensity={0.1} floatIntensity={0.2}>
          <Bounds fit clip observe margin={1.2}>
            <Center>
              <primitive 
                object={scene} 
                rotation={[0, Math.PI, 0]} // Flip 180 degrees so front is visible
                onPointerOver={(e) => {
                  e.stopPropagation();
                  document.body.style.cursor = 'pointer';
                  if (e.point.y > 0) setHoverText('Click to Lift Cabinet');
                  else setHoverText('Click to Open Drawer');
                }}
                onPointerOut={(e) => {
                  document.body.style.cursor = 'auto';
                  setHoverText('');
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  // Raycaster explicitly splits interaction based on y axis slice rather than mesh names
                  if (e.point.y > 0) {
                     setOpenLift(o => !o);
                  } else {
                     setOpenDrawer(o => !o);
                  }
                }}
              />
            </Center>
          </Bounds>
        </Float>
      </PresentationControls>

      {/* Invisible environment map merely for realistic glossy reflections, zero backdrop rendering */}
      <Environment preset="studio" blur={1} background={false} />

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
        position={[0, -3.2, -4]} 
        scale={[20, 10, 10]}
      >
        <meshStandardMaterial color="#ffffff" roughness={1} />
      </Backdrop>
    </group>
  );
}

export default function AutoCabinet() {
  const [hoverText, setHoverText] = useState('');

  return (
    <div style={{ width: '100%', height: '100%', minHeight: '500px', position: 'relative' }}>
      
      {/* Absolute overlay over the 3D canvas so text styling natively matches the mockups */}
      <div style={{ position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)', zIndex: 100, textAlign: 'center', pointerEvents: 'none', transition: 'opacity 0.4s', opacity: hoverText ? 1 : 0 }}>
         <div style={{ color: '#444', fontFamily: 'var(--font-display)', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '4px', marginBottom: '8px' }}>
            {hoverText}
         </div>
         <div style={{ height: '1.5px', width: '100%', background: 'linear-gradient(90deg, rgba(68,68,68,0) 0%, rgba(68,68,68,0.8) 50%, rgba(68,68,68,0) 100%)' }} />
      </div>

      <Canvas shadows camera={{ position: [0, 0, 8], fov: 45 }} dpr={[1, 2]}>
        <SoftShadows size={25} samples={10} focus={0.5} />
        <React.Suspense fallback={<Loader />}>
          <CabinetModel setHoverText={setHoverText} />
        </React.Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload('/assets/new_liquor_cabinet.glb');


