import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import resume from './Odebunmi_Quadri_Resume.pdf'

export default function Hero() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = canvas.offsetWidth, h = canvas.offsetHeight;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, w / h, 0.1, 100);
    camera.position.z = 6;

    // Particles
    const pGeo = new THREE.BufferGeometry();
    const count = 5000;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i*3]   = (Math.random()-0.5)*30;
      pos[i*3+1] = (Math.random()-0.5)*30;
      pos[i*3+2] = (Math.random()-0.5)*30;
      const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
      const b = isDark ? 0.15 + Math.random()*0.5 : 0.5 + Math.random()*0.4;
      const purple = Math.random() > 0.75;
      col[i*3]   = purple ? 0.48 + b*0.2 : b;
      col[i*3+1] = purple ? 0.42 + b*0.1 : b;
      col[i*3+2] = purple ? 1.0 : b;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    const pMat = new THREE.PointsMaterial({ size: 0.028, vertexColors: true, transparent: true, opacity: 0.8 });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // Torus knot (signature element)
    const tkGeo = new THREE.TorusKnotGeometry(1.3, 0.38, 140, 18);
    const tkMat = new THREE.MeshBasicMaterial({ color: 0x3d2eaa, wireframe: true, transparent: true, opacity: 0.5 });
    const torusKnot = new THREE.Mesh(tkGeo, tkMat);
    scene.add(torusKnot);

    // Accent ring
    const rGeo = new THREE.TorusGeometry(2.6, 0.006, 8, 160);
    const rMat = new THREE.MeshBasicMaterial({ color: 0x7c6aff, transparent: true, opacity: 0.4 });
    const ring = new THREE.Mesh(rGeo, rMat);
    ring.rotation.x = Math.PI / 2.5;
    scene.add(ring);

    const r2Geo = new THREE.TorusGeometry(3.5, 0.003, 8, 200);
    const r2Mat = new THREE.MeshBasicMaterial({ color: 0x5538cc, transparent: true, opacity: 0.2 });
    const ring2 = new THREE.Mesh(r2Geo, r2Mat);
    ring2.rotation.x = -Math.PI / 5;
    ring2.rotation.y = Math.PI / 6;
    scene.add(ring2);

    let mouse = { x: 0, y: 0 };
    const onMouse = e => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouse);

    const onResize = () => {
      const nw = canvas.offsetWidth, nh = canvas.offsetHeight;
      camera.aspect = nw / nh; camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener('resize', onResize);

    let t = 0, animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      t += 0.004;
      torusKnot.rotation.x = t * 0.35 + mouse.y * 0.25;
      torusKnot.rotation.y = t * 0.55 + mouse.x * 0.25;
      ring.rotation.z = t * 0.18;
      ring2.rotation.z = -t * 0.12;
      particles.rotation.y = t * 0.04;
      particles.rotation.x = t * 0.02;
      camera.position.x += (mouse.x * 0.4 - camera.position.x) * 0.04;
      camera.position.y += (mouse.y * 0.25 - camera.position.y) * 0.04;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
    };
  }, []);

  return (
    <section id="home" style={{ position: 'relative', height: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden', background: 'var(--bg)' }}>
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(110deg, var(--bg) 40%, transparent 80%), linear-gradient(to top, var(--bg) 0%, transparent 30%)' }} />

      <div style={{ position: 'relative', zIndex: 2, padding: '0 clamp(1.5rem,6vw,7rem)', maxWidth: '820px' }}>
        
        <h1 style={{ fontSize: 'clamp(2.8rem,7vw,5.5rem)', fontWeight: 700, lineHeight: 1.04, letterSpacing: '-0.04em', marginBottom: '1.5rem', paddingTop: '40px' }}>
          <span style={{ display: 'block', color: 'var(--text)' }}>Odebunmi</span>
          <span style={{ display: 'block', background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Quadri.</span>
        </h1>

        <p style={{ fontSize: 'clamp(1rem,1.8vw,1.15rem)', color: 'var(--text-muted)', maxWidth: '500px', lineHeight: 1.75, marginBottom: '2.5rem' }}>
          Full Stack Developer building performant web experiences. Crafting elegant solutions with React, Node.js, Python, Three.js & more.
        </p>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '4rem' }}>
          <button onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
            style={{ padding: '0.9rem 2.2rem', background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', color: '#fff', fontWeight: 600, fontSize: '0.9rem', borderRadius: '8px', border: 'none', cursor: 'pointer', boxShadow: '0 4px 20px var(--accent-glow)', transition: 'all 0.2s', letterSpacing: '0.02em' }}
            onMouseOver={e => e.currentTarget.style.transform='translateY(-2px)'}
            onMouseOut={e => e.currentTarget.style.transform='translateY(0)'}>
            View My Work ↗
          </button>
          <a href={resume}>
          <button
            style={{ padding: '0.9rem 2.2rem', background: 'transparent', color: 'var(--text)', fontWeight: 500, fontSize: '0.9rem', borderRadius: '8px', border: '1px solid var(--border)', cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseOver={e => { e.currentTarget.style.borderColor='var(--accent-border)'; e.currentTarget.style.color='var(--accent)'; }}
            onMouseOut={e => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.color='var(--text)'; }}>
            Download Cv
          </button>
          </a>
        </div>

        <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
          {[['3+','Years of Experience'],['15+','Projects Shipped'],['8+','Technologies']].map(([n,l]) => (
            <div key={l}>
              <div style={{ fontSize: '2rem', fontWeight: 700, background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1 }}>{n}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.3rem', letterSpacing: '0.04em' }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: '2.5rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', cursor: 'pointer', animation: 'floatDown 2s ease-in-out infinite' }}
        onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}>
        <span style={{ fontFamily: 'Space Mono', fontSize: '0.6rem', color: 'var(--text-dim)', letterSpacing: '0.15em' }}>SCROLL</span>
        <div style={{ width: '24px', height: '38px', border: '1.5px solid var(--border-light)', borderRadius: '12px', display: 'flex', justifyContent: 'center', paddingTop: '5px' }}>
          <div style={{ width: '4px', height: '8px', background: 'var(--accent)', borderRadius: '2px', animation: 'scrollDot 2s ease-in-out infinite' }} />
        </div>
      </div>
      <style>{`
        @keyframes floatDown { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(6px)} }
        @keyframes scrollDot { 0%,100%{transform:translateY(0);opacity:1} 80%{transform:translateY(12px);opacity:0} }
      `}</style>
    </section>
  );
}
