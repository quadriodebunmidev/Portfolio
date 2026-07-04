import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

const SKILLS = [
  { name: 'JavaScript', color: '#F7DF1E', bg: '#1a1a00', emoji: 'JS' },
  { name: 'Python',     color: '#4B8BBE', bg: '#001a2e', emoji: 'PY' },
  { name: 'React',      color: '#61DAFB', bg: '#001a20', emoji: '⚛' },
  { name: 'Node.js',    color: '#68A063', bg: '#001200', emoji: 'ND' },
  { name: 'Three.js',   color: '#ffffff', bg: '#1a1a1a', emoji: '3D' },
  { name: 'MongoDB',    color: '#4DB33D', bg: '#001400', emoji: 'MG' },
  { name: 'Express',    color: '#cccccc', bg: '#111111', emoji: 'EX' },
  { name: 'WebSocket',  color: '#FF6B35', bg: '#1a0d00', emoji: 'WS' },
  { name: 'HTML5',      color: '#E34F26', bg: '#1a0800', emoji: 'HT' },
  { name: 'CSS3',       color: '#264DE4', bg: '#00001a', emoji: 'CS' },
  { name: 'Git',        color: '#F05032', bg: '#1a0600', emoji: 'GIT' },
  { name: 'WebGL',      color: '#A020F0', bg: '#0d001a', emoji: 'GL' },
];

function makeIconCanvas(skill, size = 128) {
  const canvas = document.createElement('canvas');
  canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext('2d');

  // Background circle with subtle glow
  const grad = ctx.createRadialGradient(size/2, size/2, size*0.1, size/2, size/2, size/2);
  grad.addColorStop(0, skill.bg || '#111');
  grad.addColorStop(1, '#050505');
  ctx.beginPath();
  ctx.arc(size/2, size/2, size/2 - 2, 0, Math.PI*2);
  ctx.fillStyle = grad;
  ctx.fill();

  // Border ring
  ctx.beginPath();
  ctx.arc(size/2, size/2, size/2 - 2, 0, Math.PI*2);
  ctx.strokeStyle = skill.color;
  ctx.lineWidth = 3.5;
  ctx.globalAlpha = 0.85;
  ctx.stroke();
  ctx.globalAlpha = 1;

  // Icon text / emoji
  const label = skill.emoji || skill.name.slice(0, 2).toUpperCase();
  const fontSize = label.length > 2 ? size * 0.26 : size * 0.32;
  ctx.font = `bold ${fontSize}px "Space Mono", monospace`;
  ctx.fillStyle = skill.color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = skill.color;
  ctx.shadowBlur = 14;
  ctx.fillText(label, size/2, size/2 - 2);
  ctx.shadowBlur = 0;

  // Name label below
  ctx.font = `bold ${size * 0.12}px "Space Grotesk", sans-serif`;
  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  ctx.shadowBlur = 0;
  ctx.fillText(skill.name, size/2, size/2 + size*0.31);

  return canvas;
}

export default function SkillsGlobe() {
  const mountRef = useRef(null);
  const [hovered, setHovered] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 600);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const w = el.offsetWidth;
    const h = el.offsetHeight;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, w / h, 0.1, 100);
    camera.position.z = isMobile ? 7 : 5.5;

    // ─── Orbit radius
    const R = isMobile ? 2.2 : 2.6;

    // ─── Evenly distribute points on a sphere (Fibonacci lattice)
    const meshes = [];
    const iconSize = isMobile ? 80 : 128;

    SKILLS.forEach((skill, i) => {
      const phi   = Math.acos(1 - (2 * (i + 0.5)) / SKILLS.length);
      const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5);
      const x = R * Math.sin(phi) * Math.cos(theta);
      const y = R * Math.sin(phi) * Math.sin(theta);
      const z = R * Math.cos(phi);

      // Sprite from canvas
      const tex = new THREE.CanvasTexture(makeIconCanvas(skill, iconSize));
      const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false });
      const sprite = new THREE.Sprite(mat);
      const sprSize = isMobile ? 0.72 : 0.9;
      sprite.scale.set(sprSize, sprSize, 1);
      sprite.position.set(x, y, z);
      sprite.userData = { skill, origPos: new THREE.Vector3(x, y, z), baseScale: sprSize };
      scene.add(sprite);
      meshes.push(sprite);
    });

    // ─── Wireframe sphere (subtle)
    const sGeo = new THREE.SphereGeometry(R + 0.12, 20, 14);
    const sMat = new THREE.MeshBasicMaterial({
      color: 0x7c6aff, wireframe: true, transparent: true, opacity: 0.06
    });
    scene.add(new THREE.Mesh(sGeo, sMat));

    // ─── Inner glowing core
    const coreGeo = new THREE.SphereGeometry(0.22, 16, 16);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0x7c6aff, transparent: true, opacity: 0.55 });
    const core = new THREE.Mesh(coreGeo, coreMat);
    scene.add(core);

    // Thin equatorial ring
    const ringGeo = new THREE.TorusGeometry(R * 0.98, 0.007, 6, 140);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x7c6aff, transparent: true, opacity: 0.18 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    scene.add(ring);

    // ─── Raycaster for hover
    const raycaster = new THREE.Raycaster();
    const mouse2D   = new THREE.Vector2(-999, -999);

    let lastHovered = null;
    const onMouseMove = (e) => {
      const rect = el.getBoundingClientRect();
      mouse2D.x =  ((e.clientX - rect.left) / rect.width)  * 2 - 1;
      mouse2D.y = -((e.clientY - rect.top)  / rect.height) * 2 + 1;
    };
    el.addEventListener('mousemove', onMouseMove);

    // ─── Touch / drag rotation
    let isDragging = false, autoRotate = true;
    let prevX = 0, prevY = 0;
    let rotX = 0, rotY = 0;
    let velX = 0, velY = 0;

    const onPointerDown = (e) => {
      isDragging = true; autoRotate = false;
      prevX = e.touches ? e.touches[0].clientX : e.clientX;
      prevY = e.touches ? e.touches[0].clientY : e.clientY;
      velX = 0; velY = 0;
    };
    const onPointerMove = (e) => {
      if (!isDragging) return;
      const cx = e.touches ? e.touches[0].clientX : e.clientX;
      const cy = e.touches ? e.touches[0].clientY : e.clientY;
      const dx = cx - prevX, dy = cy - prevY;
      velX = dy * 0.004; velY = dx * 0.004;
      rotX += velX; rotY += velY;
      prevX = cx; prevY = cy;
    };
    const onPointerUp = () => { isDragging = false; setTimeout(() => { autoRotate = true; }, 1800); };

    el.addEventListener('mousedown',  onPointerDown);
    el.addEventListener('mousemove',  onPointerMove);
    el.addEventListener('mouseup',    onPointerUp);
    el.addEventListener('touchstart', onPointerDown, { passive: true });
    el.addEventListener('touchmove',  onPointerMove, { passive: true });
    el.addEventListener('touchend',   onPointerUp);

    const group = new THREE.Group();
    scene.children.slice().forEach(c => { scene.remove(c); group.add(c); });
    scene.add(group);

    // ─── Resize
    const onResize = () => {
      const nw = el.offsetWidth, nh = el.offsetHeight;
      camera.aspect = nw / nh; camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener('resize', onResize);

    let frame = 0, animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      frame += 0.005;

      if (autoRotate && !isDragging) { rotY += 0.006; rotX += 0.001; }
      else if (!isDragging) { velX *= 0.94; velY *= 0.94; rotX += velX; rotY += velY; }

      group.rotation.y = rotY;
      group.rotation.x = rotX;

      // Pulsing core
      const pulse = 0.85 + 0.15 * Math.sin(frame * 2.5);
      core.scale.setScalar(pulse);
      coreMat.opacity = 0.4 + 0.25 * Math.sin(frame * 2);

      // Hover check
      raycaster.setFromCamera(mouse2D, camera);
      const hits = raycaster.intersectObjects(meshes);
      if (hits.length > 0) {
        const hit = hits[0].object;
        if (lastHovered !== hit) {
          if (lastHovered) lastHovered.scale.setScalar(lastHovered.userData.baseScale);
          lastHovered = hit;
          setHovered(hit.userData.skill);
        }
        hit.scale.setScalar(hit.userData.baseScale * 1.45);
        el.style.cursor = 'pointer';
      } else {
        if (lastHovered) { lastHovered.scale.setScalar(lastHovered.userData.baseScale); lastHovered = null; }
        setHovered(null);
        el.style.cursor = isDragging ? 'grabbing' : 'grab';
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      el.removeEventListener('mousemove', onMouseMove);
      el.removeEventListener('mousedown', onPointerDown);
      el.removeEventListener('mousemove', onPointerMove);
      el.removeEventListener('mouseup', onPointerUp);
      el.removeEventListener('touchstart', onPointerDown);
      el.removeEventListener('touchmove', onPointerMove);
      el.removeEventListener('touchend', onPointerUp);
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, [isMobile]);

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <div
        ref={mountRef}
        style={{
          width: '100%',
          height: isMobile ? '340px' : '480px',
          cursor: 'grab',
          borderRadius: '16px',
          overflow: 'hidden',
        }}
      />

      {/* Hover tooltip */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        pointerEvents: 'none', textAlign: 'center', transition: 'opacity 0.25s',
        opacity: hovered ? 1 : 0,
      }}>
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--accent-border)',
          borderRadius: '10px', padding: '10px 20px',
          boxShadow: '0 4px 24px var(--accent-glow)',
          backdropFilter: 'blur(12px)',
        }}>
          <span style={{
            fontFamily: 'Space Mono', fontSize: '0.85rem', fontWeight: 700,
            color: hovered?.color || 'var(--accent)', letterSpacing: '0.06em',
          }}>
            {hovered?.name}
          </span>
        </div>
      </div>

      {/* Drag hint */}
      <p style={{
        textAlign: 'center', marginTop: '0.75rem',
        fontFamily: 'Space Mono', fontSize: '0.65rem',
        color: 'var(--text-dim)', letterSpacing: '0.12em',
      }}>
        {isMobile ? '👆 DRAG TO ROTATE' : '🖱 DRAG TO ROTATE · HOVER TO INSPECT'}
      </p>
    </div>
  );
}
