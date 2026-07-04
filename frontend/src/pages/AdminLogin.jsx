import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminLogin() {
  const [form, setForm] = useState({ username:'', password:'' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError('');
    try { await login(form.username, form.password); navigate('/admin'); }
    catch { setError('Invalid credentials. Check ADMIN_USERNAME and ADMIN_PASSWORD in your .env file.'); }
    finally { setLoading(false); }
  };

  const inp = { width:'100%', background:'var(--bg)', border:'1px solid var(--border)', borderRadius:'8px', padding:'0.85rem 1rem', color:'var(--text)', fontSize:'0.9rem', outline:'none', fontFamily:'Space Grotesk', boxSizing:'border-box', transition:'border-color 0.2s' };

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', display:'flex', alignItems:'center', justifyContent:'center', padding:'1.5rem' }}>
      <div style={{ width:'100%', maxWidth:'400px' }}>
        <div style={{ textAlign:'center', marginBottom:'2.5rem' }}>
          <div style={{ fontFamily:'Space Mono', fontSize:'1.3rem', fontWeight:700, marginBottom:'0.5rem' }}>
            <span style={{ color:'var(--accent)' }}>finesse</span><span style={{ color:'var(--text)' }}>Dev</span>
          </div>
          <span style={{ fontFamily:'Space Mono', fontSize:'0.65rem', color:'var(--text-dim)', letterSpacing:'0.18em', background:'var(--accent-glow)', border:'1px solid var(--accent-border)', padding:'3px 12px', borderRadius:'20px' }}>ADMIN PANEL</span>
        </div>

        <div style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'12px', padding:'2.5rem', boxShadow:'var(--shadow)' }}>
          <h1 style={{ fontSize:'1.4rem', fontWeight:700, marginBottom:'0.4rem', color:'var(--text)' }}>Welcome back</h1>
          <p style={{ color:'var(--text-muted)', fontSize:'0.85rem', marginBottom:'2rem' }}>Sign in to manage your portfolio</p>

          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
            <div>
              <label style={{ fontFamily:'Space Mono', fontSize:'0.68rem', color:'var(--text-muted)', letterSpacing:'0.1em', display:'block', marginBottom:'0.4rem' }}>USERNAME</label>
              <input value={form.username} onChange={e=>setForm(f=>({...f,username:e.target.value}))} placeholder="admin" required style={inp}
                onFocus={e=>e.target.style.borderColor='var(--accent-border)'} onBlur={e=>e.target.style.borderColor='var(--border)'} />
            </div>
            <div>
              <label style={{ fontFamily:'Space Mono', fontSize:'0.68rem', color:'var(--text-muted)', letterSpacing:'0.1em', display:'block', marginBottom:'0.4rem' }}>PASSWORD</label>
              <input type="password" value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))} placeholder="••••••••" required style={inp}
                onFocus={e=>e.target.style.borderColor='var(--accent-border)'} onBlur={e=>e.target.style.borderColor='var(--border)'} />
            </div>
            {error && (
              <div style={{ padding:'0.8rem 1rem', borderRadius:'8px', fontSize:'0.8rem', fontFamily:'Space Mono', background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.3)', color:'#f87171' }}>{error}</div>
            )}
            <button type="submit" disabled={loading} style={{
              marginTop:'0.5rem', padding:'0.9rem',
              background: loading ? 'var(--bg)' : 'linear-gradient(135deg, var(--accent), var(--accent-2))',
              color: loading ? 'var(--text-dim)' : '#fff',
              fontFamily:'Space Mono', fontSize:'0.82rem', letterSpacing:'0.08em', border:'none',
              borderRadius:'8px', cursor:loading?'not-allowed':'pointer', transition:'all 0.2s',
              boxShadow: loading ? 'none' : '0 4px 16px var(--accent-glow)'
            }}>
              {loading ? 'SIGNING IN...' : 'SIGN IN →'}
            </button>
          </form>
        </div>

        <p style={{ textAlign:'center', marginTop:'1.5rem' }}>
          <Link to="/" style={{ fontFamily:'Space Mono', fontSize:'0.72rem', color:'var(--text-muted)', transition:'color 0.2s' }}
            onMouseOver={e=>e.target.style.color='var(--accent)'} onMouseOut={e=>e.target.style.color='var(--text-muted)'}>
            ← Back to Portfolio
          </Link>
        </p>
      </div>
    </div>
  );
}
