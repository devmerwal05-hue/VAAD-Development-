import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

export interface ThreeParticleFieldProps {
  active?: boolean;
  className?: string;
}

const PARTICLE_COUNT = 2000;

export default function ThreeParticleField({ className = '', active = true }: ThreeParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 767px), (pointer: coarse)');
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  const isLowPower = useMemo(() => {
    if (typeof window === 'undefined') return true;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
    const saveData = Boolean(nav.connection?.saveData);
    const lowPowerCpu = (navigator.hardwareConcurrency ?? 8) <= 4;

    return reducedMotion || saveData || lowPowerCpu || isMobile;
  }, [isMobile]);

  useEffect(() => {
    if (!active || isMobile || isLowPower) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    camera.position.z = 5;

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(PARTICLE_COUNT * 3);

    for (let index = 0; index < PARTICLE_COUNT; index += 1) {
      positions[index * 3] = (Math.random() - 0.5) * 20;
      positions[index * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[index * 3 + 2] = (Math.random() - 0.5) * 20;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0xa78bfa,
      size: 0.02,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    const mouse = { x: 0, y: 0 };
    const clock = new THREE.Clock();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    const handleMouseMove = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    const animate = () => {
      const elapsed = clock.getElapsedTime();

      particles.rotation.y = elapsed * 0.05;
      particles.rotation.x = elapsed * 0.02;
      particles.rotation.y += mouse.x * 0.01;
      particles.rotation.x += mouse.y * 0.01;

      renderer.render(scene, camera);
      frameRef.current = window.requestAnimationFrame(animate);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    animate();

    return () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }

      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);

      scene.remove(particles);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
    };
  }, [active, isMobile, isLowPower]);

  if (!active || isMobile || isLowPower) {
    return (
      <div
        aria-hidden="true"
        className={`pointer-events-none fixed inset-0 z-0 opacity-40 ${className}`}
        style={{
          background:
            'radial-gradient(circle at 56% 24%, rgba(167,139,250,0.26), transparent 56%), radial-gradient(circle at 16% 72%, rgba(167,139,250,0.16), transparent 54%)',
        }}
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-0 h-screen w-screen opacity-40 ${className}`}
    />
  );
}