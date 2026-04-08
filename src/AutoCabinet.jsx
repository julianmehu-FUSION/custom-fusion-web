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

           // HIDE internal mechanical brackets that poke out
           if (name.includes('BRACKET') || name.includes('GEAR') || name.includes('MOTOR') || name === 'DEFAULT' || name.includes('ALCOHOL LIFT')) {
              child.visible = false;
              return;
           }

           if (name.includes('LINER')) {
             // Rose Gold Lip
             child.material = oldMat.clone();
             child.material.color.set('#e0a996');
             child.material.metalness = 1.0;
             child.material.roughness = 0.2;
           } else if (name.includes('BASE')) {
             // Polished Cement / Stone Shader ONLY for the very bottom foot
             child.material = new THREE.MeshPhysicalMaterial({
                 color: '#aca8a0',           
                 roughness: 0.6,             
                 metalness: 0.05,
                 clearcoat: 1.0,             
                 clearcoatRoughness: 0.15    
             });
             child.material.needsUpdate = true;
           } else if (name.includes('OUTER') || name.includes('TOP') || name.includes('DRAWER') || name.includes('CABINET')) {
             // Eggshell White Plastic - FORCE NEW MATERIAL TO STRIP ALL BAKED MESH TEXTURES
             child.material = new THREE.MeshStandardMaterial({
                 color: '#f6f5f1', 
                 metalness: 0.0,
                 roughness: 0.35,
                 flatShading: false
             });
           } else if (name.includes('EMBLEM') || name.includes('LOGO')) {
             // Custom Fusion Rose Gold Logo 
             child.material = oldMat.clone();
             child.material.color.set('#e0a996'); // Rose gold to match lip
             child.material.metalness = 1.0;
             child.material.roughness = 0.1;
             if (!child.userData.recessed) {
                child.position.y -= 0.01; // Recess logo backwards 1mm into the shell
                if (child.userData.basePos) child.userData.basePos.y -= 0.01; // Update raycast physics baseline
                child.userData.recessed = true;
             }
           } else if (name.includes('GLASS') || name.includes('CUP')) {
             // Glass Cups (LEAVE BOTTLES ALONE SO BRANDED KEYSHOT LABELS SURVIVE!)
             child.material = oldMat.clone();
             child.material.transparent = true;
             child.material.opacity = 0.4; // Light ghost glass overlay
             child.material.roughness = 0.1;
             child.material.envMapIntensity = 2.0;
           } else if (name.includes('LIQUID')) {
             // Amber Alcohol 
             child.material = oldMat.clone();
             child.material.color.set('#d48f37'); 
             child.material.transparent = true;
             child.material.opacity = 0.95;
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
                  // EXPOSE THE EXACT CAD NAME TO THE SCREEN SO WE KNOW WHAT THE TABS ARE CALLED!
                  setHoverText(`PART: ${e.object.name.toUpperCase()}`);
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


