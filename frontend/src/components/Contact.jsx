import { useState } from 'react';
import axios from 'axios';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const headRef = useScrollReveal();
  const leftRef = useScrollReveal();
  const rightRef = useScrollReveal();

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      await axios.post('https://portfolio-7tlk.vercel.app/api/messages', form);
      setStatus({ type: 'success', msg: "Message sent! I'll get back to you soon." });
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      setStatus({ type: 'error', msg: 'Failed to send. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
    padding: '0.85rem 1rem', color: 'var(--text)', fontSize: '0.9rem', fontFamily: 'Space Grotesk',
    outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box'
  };

  return (
    <section id="contact" style={{ padding: 'clamp(4rem,8vw,8rem) clamp(1.25rem,6vw,6vw)', background: 'var(--bg)' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div ref={headRef} className="reveal">
          <p style={{ fontFamily: 'Space Mono', fontSize: '0.75rem', color: 'var(--accent)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1rem' }}>07 — Contact</p>
        </div>
        <div className="contact-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(2.5rem,5vw,5rem)', alignItems: 'start' }}>
          <div ref={leftRef} className="reveal-left">
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '1.5rem', lineHeight: 1.1, color: 'var(--text)' }}>
              Let's Build<br />
              <span style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Something Together
              </span>
            </h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '2.5rem', fontSize: '0.95rem' }}>
              Have a project in mind, a role to fill, or just want to say hi? My inbox is always open.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              {[
                { label: 'Email', val: 'quadriodebunmi41@gmail.com', icon: '✉' },
                { label: 'Whatsapp', val: '08077128030', icon: '🍏' },
                { label: 'Location', val: 'Lagos, Nigeria', icon: '📍' },
                { label: 'Availability', val: 'Open to work', icon: '🟢' }
              ].map(({ label, val, icon }) => (
                <div key={label} style={{ display: 'flex', gap: '1rem', alignItems: 'center', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '0.85rem 1.1rem' }}>
                  <span style={{ fontSize: '1rem', width: '24px', textAlign: 'center' }}>{icon}</span>
                  <div>
                    <div style={{ fontFamily: 'Space Mono', fontSize: '0.62rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</div>
                    <div style={{ color: 'var(--text)', fontSize: '0.88rem', marginTop: '2px' }}>{val}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div ref={rightRef} className="reveal-right">
            <form onSubmit={handleSubmit}
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 'clamp(1.5rem,4vw,2rem)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <input name="name" value={form.name} onChange={handleChange} placeholder="Name *" required style={inputStyle}
                  onFocus={e => e.target.style.borderColor='var(--accent-border)'} onBlur={e => e.target.style.borderColor='var(--border)'} />
                <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email *" required style={inputStyle}
                  onFocus={e => e.target.style.borderColor='var(--accent-border)'} onBlur={e => e.target.style.borderColor='var(--border)'} />
              </div>
              <input name="subject" value={form.subject} onChange={handleChange} placeholder="Subject" style={inputStyle}
                onFocus={e => e.target.style.borderColor='var(--accent-border)'} onBlur={e => e.target.style.borderColor='var(--border)'} />
              <textarea name="message" value={form.message} onChange={handleChange} placeholder="Your message..." required rows={6}
                style={{ ...inputStyle, resize: 'vertical' }}
                onFocus={e => e.target.style.borderColor='var(--accent-border)'} onBlur={e => e.target.style.borderColor='var(--border)'} />
              {status && (
                <div style={{
                  padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', fontFamily: 'Space Mono',
                  background: status.type === 'success' ? 'rgba(74,222,128,0.08)' : 'rgba(239,68,68,0.08)',
                  border: `1px solid ${status.type === 'success' ? 'rgba(74,222,128,0.3)' : 'rgba(239,68,68,0.3)'}`,
                  color: status.type === 'success' ? '#4ade80' : '#f87171'
                }}>{status.msg}</div>
              )}
              <button type="submit" disabled={loading} style={{
                padding: '0.9rem', background: loading ? 'var(--bg)' : 'linear-gradient(135deg, var(--accent), var(--accent-2))',
                color: loading ? 'var(--text-dim)' : '#fff', fontFamily: 'Space Grotesk', fontWeight: 600,
                fontSize: '0.95rem', border: 'none', borderRadius: 'var(--radius-sm)',
                cursor: loading ? 'not-allowed' : 'pointer', transition: 'opacity 0.2s, transform 0.2s',
                boxShadow: loading ? 'none' : '0 4px 16px var(--accent-glow)'
              }}
              onMouseOver={e => { if (!loading) e.currentTarget.style.transform='translateY(-1px)'; }}
              onMouseOut={e => e.currentTarget.style.transform='translateY(0)'}>
                {loading ? 'Sending...' : 'Send Message →'}
              </button>
            </form>
          </div>
        </div>
      </div>
      <style>{`
        @media(max-width:768px){
          .contact-grid{ grid-template-columns:1fr !important; }
          .form-row{ grid-template-columns:1fr !important; }
        }
      `}</style>
    </section>
  );
}
