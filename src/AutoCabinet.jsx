import React, { useRef, useEffect, useState } from 'react';
import { useGLTF, PresentationControls, Environment, ContactShadows, Float, Center, Bounds, Backdrop, SoftShadows } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Categorize logic for raycaster
const checkIsDrawer = (nameMatch) => nameMatch.includes('DRAWER') || nameMatch.includes('ICE') || nameMatch.includes('TRAY') || nameMatch.includes('CUP') || nameMatch.includes('GLASS') || nameMatch.includes('EMBLEM');
const checkIsLift = (nameMatch) => nameMatch.includes('LIFT') || nameMatch.includes('BOTTLE') || nameMatch.includes('CAP') || nameMatch.includes('COGNAC') || nameMatch.includes('WHISKY') || nameMatch.includes('VODKA') || nameMatch.includes('SHOT') || nameMatch.includes('TOP') || nameMatch.includes('LIQUI');

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
        
        // Essential for photoreal backdrop shading
        child.castShadow = true;
        child.receiveShadow = true;

        const name = child.name.toUpperCase();

        // Safely upgrade or mutate materials, preserving UV maps where needed!
        if (!child.userData.matFixed && child.material) {
           const oldMat = child.material;
           child.userData.matFixed = true;

           // HIDE internal mechanical brackets that poke out
           if (name.includes('BRACKET') || name.includes('TRACK') || name.includes('GEAR') || name.includes('MOTOR') || name.includes('STEPMOTOR')) {
              child.visible = false;
              return;
           }

           if (name.includes('LINER')) {
             // Rose Gold Lip
             child.material = oldMat.clone();
             child.material.color.set('#e0a996');
             child.material.metalness = 1.0;
             child.material.roughness = 0.2;
           } else if (name.includes('OUTER') || name.includes('TOP') || name.includes('BASE') || name.includes('DRAWER')) {
             // Eggshell White Plastic
             child.material = oldMat.clone();
             child.material.color.set('#f4f3ef'); 
             child.material.metalness = 0.02;
             child.material.roughness = 0.6; 
             // DESTROY KeyShot's intrusive wavy swirly normal maps
             child.material.normalMap = null;
             child.material.roughnessMap = null;
             child.material.map = null;
             child.material.needsUpdate = true;
           } else if (name.includes('EMBLEM')) {
             // Custom Fusion Silver Logo
             child.material = oldMat.clone();
             child.material.color.set('#444444'); // Darken base to create dark chrome reflections
             child.material.metalness = 1.0;
             child.material.roughness = 0.1;
           } else if (name.includes('GLASS') || name.includes('CUP') || name.includes('BOTTLE')) {
             // Glass Cups and Bottles - Safely add Basic Transparency to save physical label maps natively!
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
    // Threaded motor lift physics
    const targetDrawer = -3.0; // Moderate drawer push 
    const targetLift = 5.0;  // Moderate liquor rise
    const speedDrawer = 2.5 * delta;
    const speedLift = 3.5 * delta;

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
      <PresentationControls global={false} cursor={false} snap={true} speed={1} zoom={1} rotation={[0.0, 0.0, 0]} polar={[-0.2, 0.5]} azimuth={[-Math.PI / 1.5, Math.PI / 1.5]}>
        <Float speed={1.0} rotationIntensity={0.1} floatIntensity={0.2}>
          <Bounds fit clip observe margin={1.2}>
            <Center>
              <primitive 
                object={scene} 
                onPointerOver={(e) => {
                  e.stopPropagation();
                  document.body.style.cursor = 'pointer';
                  if (checkIsDrawer(e.object.name.toUpperCase())) setHoverText('Click to Toggle Drawer');
                  else setHoverText('Click to Toggle Lift');
                }}
                onPointerOut={(e) => {
                  document.body.style.cursor = 'auto';
                  setHoverText('');
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
      
      {/* Reliable HTML Overlay natively on the DOM instead of WebGL */}
      <div style={{ 
        position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)', zIndex: 100, 
        background: 'rgba(0,0,0,0.85)', color: '#fff', padding: '12px 24px', borderRadius: '30px', 
        fontFamily: 'var(--font-display)', letterSpacing: '1px', textTransform: 'uppercase', fontSize: '13px',
        transition: 'opacity 0.3s', opacity: hoverText ? 1 : 0, pointerEvents: 'none' 
      }}>
        {hoverText || 'INTERACT'}
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


