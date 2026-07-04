export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer style={{
      borderTop: '1px solid var(--border)',
      padding: 'clamp(2rem,4vw,3rem) clamp(1.25rem,6vw,6vw)',
      background: 'var(--bg-2)'
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div>
          <div style={{ fontFamily: 'Space Mono', fontSize: '1rem', fontWeight: 700, marginBottom: '0.35rem' }}>
            <span style={{ color: 'var(--accent)' }}>finesse</span><span style={{ color: 'var(--text)' }}>Dev</span>
          </div>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.78rem', fontFamily: 'Space Mono' }}>© {year} Odebunmi Quadri. All rights reserved.</p>
        </div>

        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          {['Home','About','Projects','Contact'].map(label => (
            <button key={label} onClick={() => document.getElementById(label.toLowerCase())?.scrollIntoView({ behavior: 'smooth' })}
              style={{ background: 'none', border: 'none', fontFamily: 'Space Mono', fontSize: '0.72rem', color: 'var(--text-dim)', letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', transition: 'color 0.2s' }}
              onMouseOver={e => e.target.style.color='var(--accent)'} onMouseOut={e => e.target.style.color='var(--text-dim)'}>
              {label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '0.85rem' }}>
          {['GitHub', 'LinkedIn', 'Twitter'].map(s => (
            <a key={s} href="#" style={{
              width: '36px', height: '36px', borderRadius: '50%', background: 'var(--bg-card)', border: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)',
              fontSize: '0.7rem', fontFamily: 'Space Mono', transition: 'all 0.2s'
            }}
            onMouseOver={e => { e.currentTarget.style.borderColor='var(--accent-border)'; e.currentTarget.style.color='var(--accent)'; }}
            onMouseOut={e => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.color='var(--text-muted)'; }}>
              {s[0]}
            </a>
          ))}
        </div>
      </div>
      <div style={{ maxWidth: '1100px', margin: '1.5rem auto 0', paddingTop: '1.5rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'center' }}>
        <p style={{ fontFamily: 'Space Mono', fontSize: '0.65rem', color: 'var(--text-dim)', letterSpacing: '0.08em' }}>Built with React · Three.js · Node.js · MongoDB</p>
      </div>
    </footer>
  );
}
