import React, { useRef, useEffect, useState } from 'react';
import { useGLTF, PresentationControls, Environment, ContactShadows, Float, Center, Bounds, Backdrop, SoftShadows } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Categorize logic for motion
const checkIsDrawer = (nameMatch) => nameMatch.includes('DRAWER') || nameMatch.includes('ICE') || nameMatch.includes('TRAY') || nameMatch.includes('CUP') || nameMatch.includes('GLASS');

// Tightly restrict LIFT so random side brackets don't rise
const checkIsLift = (nameMatch) => nameMatch.includes('BOTTLE') || nameMatch.includes('CAP') || nameMatch.includes('COGNAC') || nameMatch.includes('WHISKY') || nameMatch.includes('VODKA') || nameMatch.includes('SHOT') || nameMatch.includes('LIQUI') || nameMatch.includes('TOP') || nameMatch.includes('ALCOHOL');

function CabinetModel({ setHoverText, ...props }) {
  const group = useRef();
  const { scene, nodes } = useGLTF('/assets/autocabinet.glb');
  
  // Separate states
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openLift, setOpenLift] = useState(false);

  const drawerVal = useRef(0);
  const liftVal = useRef(0);

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
        
        // Resolve self-shadowing acne that makes CAD models appear black
        child.castShadow = true;
        child.receiveShadow = false;

        const name = child.name.toUpperCase();

        // Safely upgrade or mutate materials, preserving UV maps where needed!
        if (!child.userData.matFixed && child.material) {
           const oldMat = child.material;
           child.userData.matFixed = true;

           // WE EXPLICITLY SHIELD THE "GEAR TRACK" SO THE SLIDER RAILS DO NOT GO MISSING!
           // But we still hide the brackets and ugly motors.
           if (name.includes('BRACKET') || name.includes('MOTOR') || name === 'DEFAULT' || (name.includes('GEAR') && !name.includes('TRACK'))) {
              child.visible = false;
              return;
           }

           // PROVEN GEOMETRIC TAB CULLING:
           // The tabs hide under structural groups like LIFT or TOP in KeyShot. 
           // We isolate any mesh in those groups that is small and aggressively off axis!
           if (name.includes('LIFT') || name.startsWith('TOP')) {
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

           // EXACT MATERIAL MATCHING FOR PERFECT VISUAL COLOR
           if (name.includes('LINER')) {
             child.material = oldMat.clone();
             child.material.color.set('#e0a996');
             child.material.metalness = 1.0;
             child.material.roughness = 0.2;
           } else if (name.includes('BASE')) {
             // Polished Base
             child.material = new THREE.MeshPhysicalMaterial({
                 color: '#aca8a0',           
                 roughness: 0.6,             
                 metalness: 0.05,
                 clearcoat: 1.0,             
                 clearcoatRoughness: 0.15    
             });
             child.material.needsUpdate = true;
           } else if (name.includes('OUTER') || name.includes('CABINET') || name.includes('TOP') || name.includes('DRAWER')) {
             // Eggshell White Plastic for Outer Shells, Top Lids, and Drawer
             child.material = new THREE.MeshStandardMaterial({
                 color: '#f6f5f1', 
                 metalness: 0.0,
                 roughness: 0.35,
                 flatShading: false
             });
           } else if (name.includes('EMBLEM') || name.includes('LOGO')) {
             child.material = oldMat.clone();
             child.material.color.set('#e0a996'); 
             child.material.metalness = 1.0;
             child.material.roughness = 0.1;
             if (!child.userData.recessed) {
                child.position.y -= 0.01; 
                if (child.userData.basePos) child.userData.basePos.y -= 0.01; 
                child.userData.recessed = true;
             }
           } else if ((name.includes('GLASS') || name.includes('CUP')) && !name.includes('MAT')) {
             // Vodka, Shot, and Cognac glasses mapped beautifully to Ghost Glass
             child.material = oldMat.clone();
             child.material.transparent = true;
             child.material.opacity = 0.4; 
             child.material.roughness = 0.1;
             child.material.envMapIntensity = 2.0;
           } else if (name.includes('LIQUID')) {
             // Alcohol Simulation
             child.material = oldMat.clone();
             child.material.color.set('#d48f37'); 
             child.material.transparent = true;
             child.material.opacity = 0.95;
           } else {
             child.material = oldMat.clone();
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
    // Threaded motor lift physics - targeting positive outward vector
    const targetDrawer = 15.0; // Drawers extend outwards positively
    const targetLift = 15.0;  // Lift must rise high enough to expose all bottle necks
    const speedDrawer = 10.5 * delta;
    const speedLift = 8.5 * delta;

    if (openDrawer) drawerVal.current = Math.min(targetDrawer, drawerVal.current + speedDrawer);
    else drawerVal.current = Math.max(0, drawerVal.current - speedDrawer);

    if (openLift) liftVal.current = Math.min(targetLift, liftVal.current + speedLift);
    else liftVal.current = Math.max(0, liftVal.current - speedLift);

    // DYNAMIC ANIMATION GROUPS: Explicitly mapped via the Node structure
    const checkIsDrawer = (n) => n.includes('DRAWER') || n.includes('ICE') || n.includes('TRACK') || n.includes('MAT') || n.includes('LINER') || n.includes('VODKA') || n.includes('SHOT') || n === 'GLASSES';
    const checkIsLift = (n) => n.includes('BOTTLE') || n.includes('CAP') || n.includes('LIQUOR LIFT') || n.includes('ALCOHOL LIFT') || n.includes('COGNAC') || n.includes('LIQUID') || n.includes('LABEL') || n.includes('WHISKY') || n.includes('GIN') || n.includes('BTL');

    Object.keys(nodes).forEach(key => {
      const node = nodes[key];
      if (!node || node.userData.basePos === undefined) return;
      
      const nameMatch = key.toUpperCase();
      
      if (checkIsDrawer(nameMatch)) {
        node.position.y = node.userData.basePos.y + drawerVal.current; // Drawer runs on local Y
      }
      if (checkIsLift(nameMatch)) {
        node.position.z = node.userData.basePos.z + liftVal.current; // Lift runs on local Z
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
        <React.Suspense fallback={null}>
          <CabinetModel setHoverText={setHoverText} />
        </React.Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload('/assets/autocabinet.glb');


