'use client';

import React from "react"

import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Vertex Shader
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Fragment Shader - Fluid Simulation
const fragmentShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec2 uResolution;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  
  varying vec2 vUv;
  
  // Simplex noise functions
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
  
  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                        -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                     + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
                            dot(x12.zw,x12.zw)), 0.0);
    m = m*m;
    m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }
  
  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    for (int i = 0; i < 5; i++) {
      value += amplitude * snoise(p * frequency);
      amplitude *= 0.5;
      frequency *= 2.0;
    }
    return value;
  }
  
  void main() {
    vec2 uv = vUv;
    vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
    
    // Mouse influence
    vec2 mouseInfluence = (uMouse - 0.5) * 0.3;
    
    // Create flowing noise
    float time = uTime * 0.15;
    vec2 q = vec2(0.0);
    q.x = fbm(uv * 2.0 + vec2(0.0, time));
    q.y = fbm(uv * 2.0 + vec2(1.0, time));
    
    vec2 r = vec2(0.0);
    r.x = fbm(uv * 2.0 + q + vec2(1.7, 9.2) + 0.15 * time + mouseInfluence);
    r.y = fbm(uv * 2.0 + q + vec2(8.3, 2.8) + 0.126 * time - mouseInfluence);
    
    float f = fbm(uv * 2.0 + r);
    
    // Mix colors based on noise
    vec3 color = mix(uColor1, uColor2, clamp(f * f * 2.0, 0.0, 1.0));
    color = mix(color, uColor2, clamp(length(q) * 0.5, 0.0, 1.0));
    color = mix(color, uColor1, clamp(length(r.x) * 0.3, 0.0, 1.0));
    
    // Add subtle vignette
    float vignette = 1.0 - length((uv - 0.5) * 1.2);
    vignette = smoothstep(0.0, 1.0, vignette);
    
    // Darken the overall effect
    color *= 0.4 * vignette;
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

interface FluidMeshProps {
  mousePosition: React.MutableRefObject<{ x: number; y: number }>;
}

function FluidMesh({ mousePosition }: FluidMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();
  
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      uColor1: { value: new THREE.Color('#00F0FF') },
      uColor2: { value: new THREE.Color('#7000FF') },
    }),
    []
  );
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (meshRef.current) {
        const material = meshRef.current.material as THREE.ShaderMaterial;
        material.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  useFrame((state) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uTime.value = state.clock.elapsedTime;
      material.uniforms.uMouse.value.x = mousePosition.current.x;
      material.uniforms.uMouse.value.y = mousePosition.current.y;
    }
  });
  
  return (
    <mesh ref={meshRef} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}

interface FluidBackgroundProps {
  className?: string;
}

export function FluidBackground({ className = '' }: FluidBackgroundProps) {
  const mousePosition = useRef({ x: 0.5, y: 0.5 });
  const containerRef = useRef<HTMLDivElement>(null);
  
  const handleMouseMove = (event: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      mousePosition.current.x = (event.clientX - rect.left) / rect.width;
      mousePosition.current.y = 1.0 - (event.clientY - rect.top) / rect.height;
    }
  };
  
  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 w-full h-full ${className}`}
      onMouseMove={handleMouseMove}
      aria-hidden="true"
      style={{ 
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 1], fov: 75 }}
        gl={{ antialias: false, alpha: false }}
        dpr={Math.min(window.devicePixelRatio, 1.5)}
        style={{ 
          width: '100%', 
          height: '100%',
          display: 'block'
        }}
      >
        <FluidMesh mousePosition={mousePosition} />
      </Canvas>
    </div>
  );
}

export default FluidBackground;
