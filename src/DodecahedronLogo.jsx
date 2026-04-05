import React, { useRef, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment, Float, useGLTF } from '@react-three/drei';

function LogoMeshes() {
  const outerRef = useRef();
  const inner1Ref = useRef();
  const inner3Ref = useRef();
  const textRef = useRef();

  // Load the actual GLTF models from the public/assets directory
  const outerGLTF = useGLTF('/assets/outer_sphere.glb');
  const inner1GLTF = useGLTF('/assets/inner_1.glb');
  const inner3GLTF = useGLTF('/assets/inner_3.glb');
  const textGLTF = useGLTF('/assets/text.glb');

  // Rotate each object at different speeds/directions
  useFrame((state, delta) => {
    if (outerRef.current) {
      outerRef.current.rotation.x -= delta * 0.1;
      outerRef.current.rotation.y += delta * 0.15;
    }
    if (inner1Ref.current) {
      inner1Ref.current.rotation.x += delta * 0.4;
      inner1Ref.current.rotation.y -= delta * 0.3;
    }
    if (inner3Ref.current) {
      inner3Ref.current.rotation.x -= delta * 0.2;
      inner3Ref.current.rotation.y += delta * 0.5;
    }
    if (textRef.current) {
      // Very slow, subtle text hover/rotation
      textRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group scale={18}>
      {/* Outer Sphere */}
      <primitive 
        object={outerGLTF.scene} 
        ref={outerRef} 
        position={[0, 0, 0]}
      />

      {/* Inner Cores */}
      <primitive 
        object={inner1GLTF.scene} 
        ref={inner1Ref} 
        position={[0, 0, 0]}
      />
      <primitive 
        object={inner3GLTF.scene} 
        ref={inner3Ref} 
        position={[0, 0, 0]}
      />

      {/* Text Model */}
      <primitive 
        object={textGLTF.scene} 
        ref={textRef} 
        position={[0, 0, 0]}
      />
    </group>
  );
}

export default function DodecahedronLogo() {
  return (
    <>
      <Environment preset="city" />

      {/* Dramatic main lighting */}
      <directionalLight position={[5, 10, 5]} intensity={3} color="#ffffff" />
      <directionalLight position={[-5, -10, -5]} intensity={2} color="#DFFF00" />
      <ambientLight intensity={0.5} />

      {/* Wrap everything in Suspense so the site doesn't crash while CAD files load */}
      <Suspense fallback={null}>
        <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
          <LogoMeshes />
        </Float>
      </Suspense>
    </>
  );
}
