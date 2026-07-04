import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [active, setActive] = useState(0);
  const headRef = useScrollReveal();
  const timerRef = useRef(null);

  useEffect(() => {
    axios.get('/api/testimonials').then(r =>{
       setTestimonials(r.data)
      
      }
      ).catch(() => {});
  }, []);

  useEffect(() => {
    if (testimonials.length < 2) return;
    timerRef.current = setInterval(() => setActive(a => (a + 1) % testimonials.length), 6000);
    return () => clearInterval(timerRef.current);
  }, [testimonials.length]);

 //if (testimonials.length === 0) return null;
  const t = testimonials[active];

  const goTo = (i) => { setActive(i); clearInterval(timerRef.current); };

  return (
    <section style={{ padding: 'clamp(4rem,8vw,8rem) clamp(1.25rem,6vw,6vw)', background: 'var(--bg)' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
        <div ref={headRef} className="reveal">
          <p style={{ fontFamily: 'Space Mono', fontSize: '0.75rem', color: 'var(--accent)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1rem' }}>What People Say</p>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 'clamp(2.5rem,5vw,4rem)', color: 'var(--text)' }}>Testimonials</h2>
        </div>

        <div style={{ position: 'relative', minHeight: '220px' }}>
          <div key={t?._id} style={{ animation: 'fadeSlide 0.5s ease' }}>
            <div style={{ fontSize: 'clamp(2.5rem,5vw,3.5rem)', color: 'var(--accent-border)', lineHeight: 0.5, marginBottom: '1rem', fontFamily: 'Georgia, serif' }}>"</div>
            <p style={{ fontSize: 'clamp(1.05rem,2.2vw,1.35rem)', color: 'var(--text)', lineHeight: 1.7, fontWeight: 500, marginBottom: '2rem', maxWidth: '700px', marginLeft: 'auto', marginRight: 'auto' }}>
              {t?.quote}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              {t?.avatarUrl ? <img src={t?.avatarUrl} style={{ width: '54px', height: '54px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#fff', fontSize: '1.2rem' }}/>:
              <div style={{ width: '54px', height: '54px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#fff', fontSize: '1.2rem' }}>
                {t?.name?.charAt(0)}
              </div>}
              <div>
                <div style={{ fontWeight: 600, color: 'var(--text)', fontSize: '0.95rem' }}>{t?.name}</div>
                <div style={{ fontFamily: 'Space Mono', fontSize: '0.72rem', color: 'var(--text-muted)' }}>{t?.role}{t?.company ? `, ${t?.company}` : ''}</div>
              </div>
              <div style={{ display: 'flex', gap: '2px', marginTop: '4px' }}>
                {Array.from({ length: t?.rating || 5 }).map((_, i) => <span key={i} style={{ color: '#fbbf24', fontSize: '0.9rem' }}>★</span>)}
              </div>
            </div>
          </div>
        </div>

        {testimonials?.length > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '2.5rem' }}>
            {testimonials?.map((_, i) => (
              <button key={i} onClick={() => goTo(i)} style={{
                width: i === active ? '24px' : '8px', height: '8px', borderRadius: '4px',
                background: i === active ? 'var(--accent)' : 'var(--border-light)', border: 'none', cursor: 'pointer', transition: 'all 0.3s'
              }} />
            ))}
          </div>
        )}
      </div>
      <style>{`@keyframes fadeSlide { from{opacity:0; transform:translateY(10px)} to{opacity:1; transform:translateY(0)} }`}</style>
    </section>
  );
}
