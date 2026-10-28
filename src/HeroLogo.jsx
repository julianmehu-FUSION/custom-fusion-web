import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import DodecahedronLogo from './DodecahedronLogo';

export default function HeroLogo() {
  return (
    <Canvas camera={{ position: [0, 0, 7], fov: 50 }}>
      <OrbitControls enableZoom={false} enablePan={false} />
      <DodecahedronLogo />
    </Canvas>
  );
}
