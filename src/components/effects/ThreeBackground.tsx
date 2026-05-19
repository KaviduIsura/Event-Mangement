"use client";

import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

function ParticleStars() {
  const ref = useRef<THREE.Points>(null);
  
  // Create random points within a sphere manually to avoid extra dependencies
  const [positions] = useState(() => {
    const count = 1000;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Box Muller transform or basic spherical distribution
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 2.0 + Math.random() * 4.0; // radius between 2 and 6
      
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  });

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta * 0.05;
      ref.current.rotation.y -= delta * 0.025;
      
      // Gentle floating effect
      ref.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.2;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#a855f7" // Glowing Purple
          size={0.035}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  );
}

function FloatingOrbs() {
  const orbRef1 = useRef<THREE.Mesh>(null);
  const orbRef2 = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (orbRef1.current) {
      orbRef1.current.position.x = Math.sin(t * 0.5) * 3;
      orbRef1.current.position.y = Math.cos(t * 0.3) * 1.5;
      orbRef1.current.position.z = Math.sin(t * 0.2) * 2 - 3;
    }
    if (orbRef2.current) {
      orbRef2.current.position.x = Math.cos(t * 0.4) * 2.5;
      orbRef2.current.position.y = Math.sin(t * 0.6) * 2;
      orbRef2.current.position.z = Math.cos(t * 0.3) * 1.5 - 4;
    }
  });

  return (
    <group>
      {/* Glow mesh 1 */}
      <mesh ref={orbRef1}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshBasicMaterial
          color="#22d3ee" // Cyan
          transparent
          opacity={0.08}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      {/* Glow mesh 2 */}
      <mesh ref={orbRef2}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshBasicMaterial
          color="#ec4899" // Pink
          transparent
          opacity={0.05}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

export default function ThreeBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="fixed inset-0 bg-[#030014] -z-20" />;

  return (
    <div className="fixed inset-0 -z-10 h-screen w-screen overflow-hidden bg-[#030014] pointer-events-none">
      {/* Subtle ambient lighting gradients beneath Canvas */}
      <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-cyan-900/10 rounded-full blur-[120px] pointer-events-none" />
      
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <ParticleStars />
        <FloatingOrbs />
      </Canvas>
    </div>
  );
}
