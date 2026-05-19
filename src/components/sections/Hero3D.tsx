"use client";

import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

function WavyGrid() {
  const ref = useRef<THREE.Points>(null);
  
  // Create a grid of particles (45 x 45 grid = 2025 particles)
  const countX = 45;
  const countY = 45;
  const numParticles = countX * countY;
  
  const [positions] = useState(() => {
    const arr = new Float32Array(numParticles * 3);
    let i = 0;
    for (let x = 0; x < countX; x++) {
      for (let y = 0; y < countY; y++) {
        // Map coordinates to grid space
        const posX = ((x / countX) - 0.5) * 16;
        const posZ = ((y / countY) - 0.5) * 16;
        
        arr[i] = posX;
        arr[i + 1] = 0; // Animated dynamically in useFrame
        arr[i + 2] = posZ;
        i += 3;
      }
    }
    return arr;
  });

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ref.current) {
      const positionAttr = ref.current.geometry.attributes.position;
      const arr = positionAttr.array as Float32Array;
      
      let index = 0;
      for (let x = 0; x < countX; x++) {
        for (let y = 0; y < countY; y++) {
          const posX = arr[index];
          const posZ = arr[index + 2];
          
          // Ripple equations based on center distance and wave parameters
          const distance = Math.sqrt(posX * posX + posZ * posZ);
          const wave = Math.sin(distance - t * 2.2) * 0.45 
                     + Math.cos(posX * 0.7 + t) * 0.22
                     + Math.sin(posZ * 0.5 - t * 1.6) * 0.15;
          
          arr[index + 1] = wave; // Y position modifier
          index += 3;
        }
      }
      
      positionAttr.needsUpdate = true;
      
      // Gentle floating rotation
      ref.current.rotation.y = t * 0.025;
      ref.current.rotation.x = Math.sin(t * 0.2) * 0.05;
    }
  });

  return (
    <group position={[0, -1.2, -2]} rotation={[Math.PI / 5, 0, 0]}>
      <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#06b6d4" // Cyan glowing particles
          size={0.065}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  );
}

export default function Hero3D() {
  return (
    <div className="absolute inset-0 -z-10 w-full h-full pointer-events-none opacity-40">
      <Canvas camera={{ position: [0, 2.5, 7], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[3, 5, 4]} intensity={0.4} />
        <WavyGrid />
      </Canvas>
    </div>
  );
}
