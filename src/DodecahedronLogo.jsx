import React, { useRef, useMemo, useEffect, Suspense } from 'react';
import { useFrame, extend } from '@react-three/fiber';
import { Float, useGLTF, Sparkles, shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';

// ============================
// Custom Plasma Shader Material
// ============================
const PlasmaShaderMaterial = shaderMaterial(
  {
    uTime: 0,
    uIntensity: 1.5,
    uColorA: new THREE.Color('#0044ff'),
    uColorB: new THREE.Color('#00aaff'),
    uColorC: new THREE.Color('#ffffff'),
  },
  // Vertex Shader
  `
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec2 vUv;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vPosition = position;
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader — procedural plasma with swirling tendrils
  `
    uniform float uTime;
    uniform float uIntensity;
    uniform vec3 uColorA;
    uniform vec3 uColorB;
    uniform vec3 uColorC;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec2 vUv;

    // Simplex-style noise functions
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

    float snoise(vec3 v) {
      const vec2 C = vec2(1.0/6.0, 1.0/3.0);
      const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
      vec3 i = floor(v + dot(v, C.yyy));
      vec3 x0 = v - i + dot(i, C.xxx);
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min(g.xyz, l.zxy);
      vec3 i2 = max(g.xyz, l.zxy);
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - D.yyy;
      i = mod289(i);
      vec4 p = permute(permute(permute(
        i.z + vec4(0.0, i1.z, i2.z, 1.0))
        + i.y + vec4(0.0, i1.y, i2.y, 1.0))
        + i.x + vec4(0.0, i1.x, i2.x, 1.0));
      float n_ = 0.142857142857;
      vec3 ns = n_ * D.wyz - D.xzx;
      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_);
      vec4 x = x_ * ns.x + ns.yyyy;
      vec4 y = y_ * ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
      vec4 b0 = vec4(x.xy, y.xy);
      vec4 b1 = vec4(x.zw, y.zw);
      vec4 s0 = floor(b0) * 2.0 + 1.0;
      vec4 s1 = floor(b1) * 2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
      vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
      vec3 p0 = vec3(a0.xy, h.x);
      vec3 p1 = vec3(a0.zw, h.y);
      vec3 p2 = vec3(a1.xy, h.z);
      vec3 p3 = vec3(a1.zw, h.w);
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
      p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
    }

    // Fractal brownian motion for layered detail
    float fbm(vec3 p) {
      float value = 0.0;
      float amplitude = 0.5;
      float frequency = 1.0;
      for (int i = 0; i < 6; i++) {
        value += amplitude * snoise(p * frequency);
        frequency *= 2.2;
        amplitude *= 0.5;
      }
      return value;
    }

    void main() {
      vec3 pos = vPosition * 3.0;
      float t = uTime * 0.4;

      // Swirling distortion
      float swirl1 = fbm(pos + vec3(t * 0.3, t * 0.2, t * -0.1));
      float swirl2 = fbm(pos * 1.5 + vec3(-t * 0.2, t * 0.3, t * 0.15) + swirl1 * 0.5);
      float swirl3 = fbm(pos * 2.0 + vec3(t * 0.1, -t * 0.25, t * 0.2) + swirl2 * 0.3);

      // Combine layers for tendril-like patterns
      float plasma = swirl1 * 0.4 + swirl2 * 0.35 + swirl3 * 0.25;
      plasma = plasma * 0.5 + 0.5; // normalize to 0-1

      // Create bright tendril streaks
      float tendrils = pow(abs(snoise(pos * 2.0 + vec3(t * 0.5, t * 0.3, -t * 0.2))), 0.5);
      float brightStreaks = pow(tendrils, 2.0) * 1.5;

      // Edge glow (brighter at edges like real plasma)
      float fresnel = 1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0)));
      float edgeGlow = pow(fresnel, 1.5) * 0.8;

      // Color mixing: deep blue -> bright cyan -> white hot
      vec3 color = mix(uColorA, uColorB, plasma);
      color = mix(color, uColorC, brightStreaks * 0.6 + edgeGlow * 0.3);

      // Add extra brightness in hot spots
      float hotSpots = pow(max(plasma, 0.0), 3.0) * 2.0;
      color += uColorC * hotSpots * 0.3;

      // Overall intensity
      float intensity = (plasma * 0.6 + brightStreaks * 0.3 + edgeGlow * 0.2 + 0.3) * uIntensity;

      gl_FragColor = vec4(color * intensity, 0.95);
    }
  `
);

extend({ PlasmaShaderMaterial });

// ============================
// Lightning helpers
// ============================
function generateLightningBolt(origin, target, segments = 8, spread = 0.003) {
  const points = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const x = origin.x + (target.x - origin.x) * t + (i > 0 && i < segments ? (Math.random() - 0.5) * spread : 0);
    const y = origin.y + (target.y - origin.y) * t + (i > 0 && i < segments ? (Math.random() - 0.5) * spread : 0);
    const z = origin.z + (target.z - origin.z) * t + (i > 0 && i < segments ? (Math.random() - 0.5) * spread : 0);
    points.push(new THREE.Vector3(x, y, z));
  }
  return points;
}

function LightningArc({ boltRef, materialRef }) {
  return (
    <line ref={boltRef}>
      <bufferGeometry />
      <lineBasicMaterial
        ref={materialRef}
        color="#66ccff"
        transparent
        opacity={0.9}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        linewidth={1}
      />
    </line>
  );
}

function RandomEmitter({ emitterRef }) {
  const mat = useMemo(() => new THREE.MeshBasicMaterial({
    color: '#88ccff',
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  }), []);

  return (
    <mesh ref={emitterRef} material={mat}>
      <sphereGeometry args={[0.0004, 6, 6]} />
    </mesh>
  );
}

// ============================
// Plasma Orb — custom shader sphere
// ============================
function PlasmaOrb() {
  const matRef = useRef();
  const meshRef = useRef();

  useFrame((state) => {
    if (matRef.current) {
      matRef.current.uTime = state.clock.elapsedTime;
      matRef.current.uIntensity = 1.8 + Math.sin(state.clock.elapsedTime * 3) * 0.4;
    }
    // Erratic rotation for swirl effect
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.008;
      meshRef.current.rotation.y -= 0.012;
      meshRef.current.rotation.z += 0.005;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.008, 64, 64]} />
      <plasmaShaderMaterial
        ref={matRef}
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// Second wispy layer — slightly larger, more transparent
function PlasmaWisps() {
  const matRef = useRef();
  const meshRef = useRef();

  useFrame((state) => {
    if (matRef.current) {
      matRef.current.uTime = state.clock.elapsedTime * 1.3 + 100.0;
      matRef.current.uIntensity = 0.7 + Math.sin(state.clock.elapsedTime * 5) * 0.25;
    }
    if (meshRef.current) {
      meshRef.current.rotation.x -= 0.006;
      meshRef.current.rotation.y += 0.01;
      meshRef.current.rotation.z -= 0.007;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.0095, 48, 48]} />
      <plasmaShaderMaterial
        ref={matRef}
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        side={THREE.DoubleSide}
        uColorA={new THREE.Color('#0022aa')}
        uColorB={new THREE.Color('#0088dd')}
        uColorC={new THREE.Color('#aaddff')}
      />
    </mesh>
  );
}

// ============================
// Main Logo Component
// ============================
function LogoMeshes() {
  const outerRef = useRef();
  const inner1Ref = useRef();
  const pointLight1Ref = useRef();
  const pointLight2Ref = useRef();
  const pointLight3Ref = useRef();
  const pointLight4Ref = useRef();
  const glowRef = useRef();

  // 10 lightning bolts
  const boltRefs = Array.from({ length: 10 }, () => useRef());
  const boltMatRefs = Array.from({ length: 10 }, () => useRef());
  const lightningLightRef = useRef();

  // 8 random emitters
  const emitterRefs = Array.from({ length: 8 }, () => useRef());

  const outerGLTF = useGLTF('/assets/outer_sphere.glb');
  const inner1GLTF = useGLTF('/assets/inner_1.glb');

  const glowMaterial = useMemo(() => new THREE.SpriteMaterial({
    map: new THREE.TextureLoader().load('data:image/svg+xml;base64,' + btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512"><defs><radialGradient id="g"><stop offset="0%" stop-color="#ffffff" stop-opacity="1"/><stop offset="8%" stop-color="#ccddff" stop-opacity="0.98"/><stop offset="20%" stop-color="#55aaff" stop-opacity="0.7"/><stop offset="35%" stop-color="#3388ff" stop-opacity="0.4"/><stop offset="50%" stop-color="#1155cc" stop-opacity="0.2"/><stop offset="70%" stop-color="#003399" stop-opacity="0.08"/><stop offset="100%" stop-color="#000000" stop-opacity="0"/></radialGradient></defs><circle cx="256" cy="256" r="256" fill="url(#g)"/></svg>`)),
    blending: THREE.AdditiveBlending,
    transparent: true,
    depthWrite: false,
    opacity: 1.0,
    color: '#aaddff',
  }), []);

  useEffect(() => {
    // Outer Shell — lightened
    if (outerGLTF.scene) {
      outerGLTF.scene.traverse((child) => {
        if (child.isMesh) {
          child.visible = true;
          child.material = new THREE.MeshStandardMaterial({
            color: '#3a3a40',
            metalness: 0.9,
            roughness: 0.2,
            envMapIntensity: 2.5,
          });
          child.material.needsUpdate = true;
        }
      });
    }

    // Silver Middle Shell
    if (inner1GLTF.scene) {
      inner1GLTF.scene.traverse((child) => {
        if (child.isMesh) {
          child.visible = true;
          child.material = new THREE.MeshStandardMaterial({
            color: '#ffffff',
            metalness: 1.0,
            roughness: 0.05,
            envMapIntensity: 3,
          });
          child.material.needsUpdate = true;
        }
      });
    }
  }, [outerGLTF, inner1GLTF]);

  const updateBolt = (boltRef, matRef, origin, target, segments, spread, color, opacity) => {
    if (!boltRef.current) return;
    const points = generateLightningBolt(origin, target, segments, spread);
    const positions = new Float32Array(points.length * 3);
    points.forEach((p, i) => {
      positions[i * 3] = p.x;
      positions[i * 3 + 1] = p.y;
      positions[i * 3 + 2] = p.z;
    });
    boltRef.current.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    boltRef.current.geometry.attributes.position.needsUpdate = true;
    if (matRef.current) {
      matRef.current.color.set(color);
      matRef.current.opacity = opacity;
    }
  };

  const lastBoltTime = useRef(0);
  const emitterTimers = useRef(Array.from({ length: 8 }, () => Math.random() * 3));

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    // Slow outer shell rotation
    if (outerRef.current) {
      outerRef.current.rotation.x -= delta * 0.1;
      outerRef.current.rotation.y += delta * 0.15;
    }

    // Mid-cage counter-rotation
    if (inner1Ref.current) {
      inner1Ref.current.rotation.x += delta * 0.3;
      inner1Ref.current.rotation.y -= delta * 0.2;
    }

    // Central glow sprite — large pulsing bloom
    if (glowRef.current) {
      const pulse = 0.025 + Math.sin(t * 11) * 0.005 + Math.cos(t * 17) * 0.003;
      glowRef.current.scale.setScalar(pulse);
      glowRef.current.material.opacity = 0.85 + Math.sin(t * 23) * 0.15;
      glowRef.current.material.color.setHSL(0.58 + Math.sin(t * 5) * 0.04, 0.7, 0.75);
    }

    // Chaotic multi-point light flicker
    if (pointLight1Ref.current) {
      const f = Math.sin(t * 25) * 0.5 + Math.cos(t * 37) * 0.5;
      pointLight1Ref.current.intensity = 60 + f * 35;
      pointLight1Ref.current.color.setHSL(0.58 + f * 0.06, 0.9, 0.7);
    }
    if (pointLight2Ref.current) {
      const f = Math.sin(t * 33) * 0.5 + Math.cos(t * 47) * 0.5;
      pointLight2Ref.current.intensity = 35 + f * 20;
      pointLight2Ref.current.color.setHSL(0.6 + f * 0.05, 0.9, 0.6);
    }
    if (pointLight3Ref.current) {
      const f = Math.sin(t * 41) * 0.5 + Math.cos(t * 59) * 0.5;
      pointLight3Ref.current.intensity = 25 + f * 15;
    }
    if (pointLight4Ref.current) {
      pointLight4Ref.current.position.x = Math.sin(t * 0.7) * 0.015;
      pointLight4Ref.current.position.y = Math.cos(t * 0.5) * 0.015;
      pointLight4Ref.current.position.z = Math.sin(t * 0.3) * 0.015;
      pointLight4Ref.current.intensity = 15 + Math.sin(t * 3) * 5;
    }

    // === LIGHTNING BOLTS ===
    if (t - lastBoltTime.current > 0.04) {
      lastBoltTime.current = t;
      const origin = new THREE.Vector3(0, 0, 0);
      const boltColors = ['#3388ff', '#55bbff', '#2255ee', '#77ddff', '#1144dd', '#99ccff', '#4477ff', '#66aaff', '#0033bb', '#aaddff'];

      const rndSphere = (r) => {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        return new THREE.Vector3(
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.sin(phi) * Math.sin(theta),
          r * Math.cos(phi)
        );
      };

      boltRefs.forEach((ref, i) => {
        const visible = Math.random() > 0.2;
        if (visible) {
          const reach = 0.01 + Math.random() * 0.015;
          const target = rndSphere(reach);
          const segs = 5 + Math.floor(Math.random() * 8);
          const sprd = 0.002 + Math.random() * 0.008;
          const color = boltColors[Math.floor(Math.random() * boltColors.length)];
          const opacity = 0.4 + Math.random() * 0.6;
          updateBolt(ref, boltMatRefs[i], origin, target, segs, sprd, color, opacity);
        } else {
          if (boltMatRefs[i].current) boltMatRefs[i].current.opacity = 0;
        }
      });

      if (lightningLightRef.current) {
        lightningLightRef.current.intensity = 40 + Math.random() * 50;
        const lc = boltColors[Math.floor(Math.random() * boltColors.length)];
        lightningLightRef.current.color.set(lc);
      }
    }

    if (lightningLightRef.current) {
      lightningLightRef.current.intensity *= 0.9;
    }

    // === RANDOM EMITTERS ===
    emitterRefs.forEach((ref, i) => {
      if (!ref.current) return;
      const timer = emitterTimers.current[i];
      const cycle = (t + timer) % 1.5;

      if (cycle < 0.15) {
        if (cycle < 0.02) {
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(2 * Math.random() - 1);
          const r = 0.003 + Math.random() * 0.004;
          ref.current.position.set(
            r * Math.sin(phi) * Math.cos(theta),
            r * Math.sin(phi) * Math.sin(theta),
            r * Math.cos(phi)
          );
          const scale = 0.5 + Math.random() * 1.5;
          ref.current.scale.setScalar(scale);
          const hue = 0.5 + Math.random() * 0.15;
          ref.current.material.color.setHSL(hue, 0.9, 0.6 + Math.random() * 0.3);
        }
        ref.current.material.opacity = 0.8 * (1 - cycle / 0.15);
        ref.current.visible = true;
      } else {
        ref.current.visible = false;
        ref.current.material.opacity = 0;
      }
    });
  });

  return (
    <group scale={100}>
      {/* Multi-point lights */}
      <pointLight ref={pointLight1Ref} position={[0, 0, 0]} intensity={80} distance={40} color="#88ddff" />
      <pointLight ref={pointLight2Ref} position={[0.005, 0.005, 0]} intensity={40} distance={30} color="#3366ff" />
      <pointLight ref={pointLight3Ref} position={[-0.005, -0.005, 0]} intensity={30} distance={30} color="#ffffff" />
      <pointLight ref={pointLight4Ref} position={[0.015, 0, 0]} intensity={20} distance={40} color="#6688cc" />
      <pointLight ref={lightningLightRef} position={[0, 0, 0]} intensity={0} distance={35} color="#aaddff" />

      {/* Central glow bloom */}
      <sprite ref={glowRef} material={glowMaterial} scale={[0.025, 0.025, 0.025]} />

      {/* Shell layers */}
      <primitive object={outerGLTF.scene} ref={outerRef} position={[0, 0, 0]} />
      <primitive object={inner1GLTF.scene} ref={inner1Ref} position={[0, 0, 0]} />

      {/* CUSTOM SHADER PLASMA CORE — replaces the old GLTF inner_3 */}
      <PlasmaOrb />
      <PlasmaWisps />

      {/* Lightning bolts */}
      {boltRefs.map((ref, i) => (
        <LightningArc key={`bolt-${i}`} boltRef={ref} materialRef={boltMatRefs[i]} />
      ))}

      {/* Random emitters */}
      {emitterRefs.map((ref, i) => (
        <RandomEmitter key={`emitter-${i}`} emitterRef={ref} />
      ))}

      {/* Subtle sparkle particles */}
      <Sparkles count={200} scale={1.4} size={2.5} speed={0.5} opacity={0.5} color="#55aaff" noise={0} />
      <Sparkles count={100} scale={1.8} size={1.5} speed={0.3} opacity={0.3} color="#2266ff" noise={0} />
    </group>
  );
}

useGLTF.preload('/assets/outer_sphere.glb');
useGLTF.preload('/assets/inner_1.glb');

export default function DodecahedronLogo() {
  return (
    <>
      <directionalLight position={[5, 10, 5]} intensity={1.0} color="#ffffff" />
      <directionalLight position={[-5, -10, -5]} intensity={0.6} color="#FF6A00" />
      <directionalLight position={[0, 5, -8]} intensity={0.5} color="#4488cc" />
      <directionalLight position={[-8, 0, 5]} intensity={0.4} color="#3366aa" />
      <ambientLight intensity={0.25} />

      <Suspense fallback={null}>
        <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
          <LogoMeshes />
        </Float>
      </Suspense>
    </>
  );
}
