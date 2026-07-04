import { useRef, useEffect } from "react";
import * as THREE from "three";

/**
 * Modern interactive 3D globe with real world map (continents/countries).
 * - Land masses rendered as gold dots (dot-matrix style)
 * - Atmosphere glow shader
 * - Auto-rotation + drag-to-rotate
 * - Transparent background (no image box artifacts)
 */
export default function GlobeWireframe({ className = "" }) {
  const mountRef = useRef(null);
  const isDraggingRef = useRef(false);
  const prevMouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let width = mount.clientWidth;
    let height = mount.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 5.2;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // Globe group
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // Inner sphere (dark, slightly visible)
    const RADIUS = 2;
    const sphereGeo = new THREE.SphereGeometry(RADIUS, 64, 64);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: 0x0d1a2e,
      transparent: true,
      opacity: 0.85,
    });
    globeGroup.add(new THREE.Mesh(sphereGeo, sphereMat));

    // Wireframe overlay (faint latitude/longitude grid)
    const wireGeo = new THREE.SphereGeometry(RADIUS + 0.005, 36, 18);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xc5a065,
      wireframe: true,
      transparent: true,
      opacity: 0.07,
    });
    globeGroup.add(new THREE.Mesh(wireGeo, wireMat));

    // Atmosphere glow (backside shader)
    const glowGeo = new THREE.SphereGeometry(RADIUS + 0.3, 64, 64);
    const glowMat = new THREE.ShaderMaterial({
      uniforms: {
        glowColor: { value: new THREE.Color(0xc5a065) },
        coefficient: { value: 0.6 },
        power: { value: 3.5 },
      },
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 glowColor;
        uniform float coefficient;
        uniform float power;
        varying vec3 vNormal;
        void main() {
          float intensity = pow(coefficient - dot(vNormal, vec3(0.0, 0.0, 1.0)), power);
          gl_FragColor = vec4(glowColor, 1.0) * intensity;
        }
      `,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true,
    });
    globeGroup.add(new THREE.Mesh(glowGeo, glowMat));

    // Load world map image and create land dots
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = "https://unpkg.com/three-globe@2.31.0/example/img/earth-dark.jpg";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const w = 2048;
      const h = 1024;
      canvas.width = w;
      canvas.height = h;
      ctx.drawImage(img, 0, 0, w, h);
      const imgData = ctx.getImageData(0, 0, w, h).data;

      const positions = [];
      const step = 4;
      for (let y = 0; y < h; y += step) {
        for (let x = 0; x < w; x += step) {
          const idx = (y * w + x) * 4;
          const brightness = (imgData[idx] + imgData[idx + 1] + imgData[idx + 2]) / 3;
          if (brightness > 25) {
            const lng = (x / w) * 360 - 180;
            const lat = 90 - (y / h) * 180;
            const phi = (90 - lat) * (Math.PI / 180);
            const theta = (lng + 180) * (Math.PI / 180);
            const r = RADIUS + 0.01;
            const px = -r * Math.sin(phi) * Math.cos(theta);
            const py = r * Math.cos(phi);
            const pz = r * Math.sin(phi) * Math.sin(theta);
            positions.push(px, py, pz);
          }
        }
      }

      const dotCount = positions.length / 3;
      const dotGeo = new THREE.SphereGeometry(0.016, 6, 6);
      const dotMat = new THREE.MeshBasicMaterial({ color: 0xe8d5a0 });
      const instanced = new THREE.InstancedMesh(dotGeo, dotMat, dotCount);
      const dummy = new THREE.Object3D();
      for (let i = 0; i < dotCount; i++) {
        dummy.position.set(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
        dummy.updateMatrix();
        instanced.setMatrixAt(i, dummy.matrix);
      }
      instanced.instanceMatrix.needsUpdate = true;
      globeGroup.add(instanced);
    };

    // Mouse / touch interaction
    const handlePointerDown = (e) => {
      isDraggingRef.current = true;
      prevMouseRef.current = { x: e.clientX, y: e.clientY };
    };
    const handlePointerMove = (e) => {
      if (!isDraggingRef.current) return;
      const dx = e.clientX - prevMouseRef.current.x;
      const dy = e.clientY - prevMouseRef.current.y;
      globeGroup.rotation.y += dx * 0.005;
      globeGroup.rotation.x += dy * 0.005;
      globeGroup.rotation.x = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, globeGroup.rotation.x));
      prevMouseRef.current = { x: e.clientX, y: e.clientY };
    };
    const handlePointerUp = () => {
      isDraggingRef.current = false;
    };

    mount.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    // Resize
    const handleResize = () => {
      width = mount.clientWidth;
      height = mount.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", handleResize);

    // Tilt globe slightly for a better angle
    globeGroup.rotation.x = 0.25;

    // Animation loop
    let animId;
    const animate = () => {
      if (!isDraggingRef.current) {
        globeGroup.rotation.y += 0.0015;
      }
      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      mount.removeEventListener("pointerdown", handlePointerDown);
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className={`relative ${className}`}>
      <style>{`
        @keyframes bokehDrift1 { 0%,100%{transform:translate(0,0);opacity:.3} 50%{transform:translate(15px,-20px);opacity:.6} }
        @keyframes bokehDrift2 { 0%,100%{transform:translate(0,0);opacity:.2} 50%{transform:translate(-20px,15px);opacity:.45} }
        @keyframes glowPulse { 0%,100%{opacity:.3} 50%{opacity:.5} }
        .bokeh-1{animation:bokehDrift1 7s ease-in-out infinite}
        .bokeh-2{animation:bokehDrift2 9s ease-in-out infinite}
        .globe-aura{animation:glowPulse 5s ease-in-out infinite}
      `}</style>

      {/* Ambient glow */}
      <div className="absolute inset-0 rounded-full globe-aura pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(197,160,101,0.12) 0%, transparent 60%)" }} />

      {/* Bokeh particles */}
      <div className="absolute bokeh-1 rounded-full pointer-events-none" style={{ top:"8%",left:"12%",width:22,height:22,background:"rgba(197,160,101,0.35)",filter:"blur(8px)" }} />
      <div className="absolute bokeh-2 rounded-full pointer-events-none" style={{ top:"15%",right:"8%",width:16,height:16,background:"rgba(197,160,101,0.3)",filter:"blur(6px)" }} />
      <div className="absolute bokeh-1 rounded-full pointer-events-none" style={{ bottom:"12%",left:"18%",width:28,height:28,background:"rgba(197,160,101,0.2)",filter:"blur(10px)" }} />
      <div className="absolute bokeh-2 rounded-full pointer-events-none" style={{ bottom:"20%",right:"12%",width:14,height:14,background:"rgba(255,255,255,0.15)",filter:"blur(5px)" }} />

      {/* 3D Globe canvas */}
      <div
        ref={mountRef}
        className="relative w-full cursor-grab active:cursor-grabbing select-none"
        style={{ aspectRatio: "1 / 1", touchAction: "none" }}
      />
    </div>
  );
}