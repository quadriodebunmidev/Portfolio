import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

/* ─── Design tokens ─── */
const c = {
  tabActive: { background:'var(--accent)', color:'#fff', border:'1px solid var(--accent)', fontFamily:'Space Mono', fontSize:'0.72rem', letterSpacing:'0.08em', textTransform:'uppercase', padding:'0.6rem 1.2rem', cursor:'pointer', borderRadius:'6px', transition:'all 0.2s' },
  tabIdle:   { background:'transparent', color:'var(--text-muted)', border:'1px solid var(--border)', fontFamily:'Space Mono', fontSize:'0.72rem', letterSpacing:'0.08em', textTransform:'uppercase', padding:'0.6rem 1.2rem', cursor:'pointer', borderRadius:'6px', transition:'all 0.2s' },
  btnPrimary: { background:'linear-gradient(135deg,var(--accent),var(--accent-2))', color:'#fff', border:'none', fontFamily:'Space Mono', fontSize:'0.72rem', letterSpacing:'0.06em', padding:'0.6rem 1.2rem', borderRadius:'6px', cursor:'pointer', transition:'opacity 0.2s' },
  btnSecondary: { background:'transparent', color:'var(--text-muted)', border:'1px solid var(--border)', fontFamily:'Space Mono', fontSize:'0.72rem', letterSpacing:'0.06em', padding:'0.6rem 1.2rem', borderRadius:'6px', cursor:'pointer', transition:'all 0.2s' },
  btnDanger: { background:'transparent', color:'#f87171', border:'1px solid rgba(239,68,68,0.3)', fontFamily:'Space Mono', fontSize:'0.72rem', letterSpacing:'0.06em', padding:'0.6rem 1.2rem', borderRadius:'6px', cursor:'pointer', transition:'all 0.2s' },
  input: { width:'100%', background:'var(--bg)', border:'1px solid var(--border)', borderRadius:'6px', padding:'0.75rem 0.9rem', color:'var(--text)', fontSize:'0.88rem', outline:'none', fontFamily:'Space Grotesk', marginBottom:'0.85rem', boxSizing:'border-box', transition:'border-color 0.2s' },
};

const TABS = ['projects','skills','experience','certificates','testimonials','messages'];

export default function AdminDashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('projects');
  const [data, setData] = useState({ projects:[], skills:[], experiences:[], certificates:[], testimonials:[], messages:[] });
  const [modal, setModal] = useState(null); // { type, item|null }
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type='success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  const fetchAll = async () => {
    const [p,s,e,cert,test,m] = await Promise.allSettled([
      axios.get('https://portfolio-7tlk.vercel.app/api/projects'), axios.get('https://portfolio-7tlk.vercel.app/api/skills'), axios.get('https://portfolio-7tlk.vercel.app/api/experience'),
      axios.get('https://portfolio-7tlk.vercel.app/api/certificates'), axios.get('https://portfolio-7tlk.vercel.app/api/testimonials'), axios.get('https://portfolio-7tlk.vercel.app/api/messages')
    ]);
    setData({
      projects:     p.status==='fulfilled'    ? p.value.data    : [],
      skills:       s.status==='fulfilled'    ? s.value.data    : [],
      experiences:  e.status==='fulfilled'    ? e.value.data    : [],
      certificates: cert.status==='fulfilled' ? cert.value.data : [],
      testimonials: test.status==='fulfilled' ? test.value.data : [],
      messages:     m.status==='fulfilled'    ? m.value.data    : [],
    });
  };
  useEffect(() => { fetchAll(); }, []);

  const handleLogout = () => { logout(); navigate('/admin/login'); };

  const defaults = {
    projects:     { title:'', description:'', longDescription:'', techStack:'', liveUrl:'', githubUrl:'', imageUrl:'', featured:false, category:'fullstack', status:'completed' },
    skills:       { name:'', category:'frontend', proficiency:80 },
    experience:   { company:'', role:'', description:'', achievements:'', startDate:'', endDate:'', current:false, techUsed:'' },
    certificates: { title:'', issuer:'', issueDate:'', credentialUrl:'', imageUrl:'', description:'' },
    testimonials: { name:'', role:'', company:'', quote:'',avatarUrl:"", rating:5 },
  };

  const openModal = (type, item=null) => {
    setModal(type);
    if (item) {
      const f = { ...item };
      if (type==='projects'   && Array.isArray(f.techStack))   f.techStack   = f.techStack.join(', ');
      if (type==='experience' && Array.isArray(f.achievements)) f.achievements = f.achievements.join('\n');
      if (type==='experience' && Array.isArray(f.techUsed))    f.techUsed    = f.techUsed.join(', ');
      setForm(f);
    } else {
      setForm(defaults[type] || {});
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = { ...form };
      if (modal==='projects'   && typeof payload.techStack==='string')   payload.techStack   = payload.techStack.split(',').map(t=>t.trim()).filter(Boolean);
      if (modal==='experience' && typeof payload.achievements==='string') payload.achievements = payload.achievements.split('\n').filter(Boolean);
      if (modal==='experience' && typeof payload.techUsed==='string')    payload.techUsed    = payload.techUsed.split(',').map(t=>t.trim()).filter(Boolean);

      const ep = { projects:'https://portfolio-7tlk.vercel.app/api/projects', skills:'https://portfolio-7tlk.vercel.app/api/skills', experience:'https://portfolio-7tlk.vercel.app/api/experience', certificates:'https://portfolio-7tlk.vercel.app/api/certificates', testimonials:'https://portfolio-7tlk.vercel.app/api/testimonials' };
      const url = ep[modal];
      if (payload._id) await axios.put(`${url}/${payload._id}`, payload);
      else             await axios.post(url, payload);
      await fetchAll();
      setModal(null); setForm({});
      showToast(payload._id ? 'Updated!' : 'Created!');
    } catch(e) { showToast('Error: '+(e.response?.data?.message||e.message), 'error'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm('Delete this item?')) return;
    const ep = { projects:'https://portfolio-7tlk.vercel.app/api/projects', skills:'https://portfolio-7tlk.vercel.app/api/skills', experience:'https://portfolio-7tlk.vercel.app/api/experience', certificates:'https://portfolio-7tlk.vercel.app/api/certificates', testimonials:'https://portfolio-7tlk.vercel.app/api/testimonials', messages:'https://portfolio-7tlk.vercel.app/api/messages' };
    try { await axios.delete(`${ep[type]}/${id}`); await fetchAll(); showToast('Deleted.'); }
    catch { showToast('Delete failed', 'error'); }
  };

  const handleMarkRead = async (id) => {
    try { await axios.patch(`https://portfolio-7tlk.vercel.app/api/messages/${id}/read`); await fetchAll(); } catch {}
  };

  const handleSeed = async () => {
    if (!window.confirm('Reset all data with sample content?')) return;
    try { await axios.post('https://portfolio-7tlk.vercel.app/api/seed'); await fetchAll(); showToast('Database seeded!'); }
    catch { showToast('Seed failed', 'error'); }
  };

  const sf = (k,v) => setForm(f=>({...f,[k]:v}));
  const unread = data.messages.filter(m=>!m.read).length;

  const tabLabels = { projects:`Projects (${data.projects.length})`, skills:`Skills (${data.skills.length})`, experience:`Experience (${data.experiences.length})`, certificates:`Certs (${data.certificates.length})`, testimonials:`Testimonials (${data.testimonials.length})`, messages:`Messages${unread?` •${unread}`:''}` };

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', color:'var(--text)' }}>
      {/* Toast */}
      {toast && (
        <div style={{ position:'fixed', top:'1.25rem', right:'1.25rem', zIndex:9999, background:'var(--bg-card)', border:`1px solid ${toast.type==='error'?'rgba(239,68,68,0.4)':'var(--accent-border)'}`, padding:'0.75rem 1.5rem', borderRadius:'8px', fontFamily:'Space Mono', fontSize:'0.78rem', color:toast.type==='error'?'#f87171':'var(--accent)', boxShadow:'var(--shadow)' }}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div style={{ borderBottom:'1px solid var(--border)', padding:'0.85rem 2rem', display:'flex', alignItems:'center', justifyContent:'space-between', background:'var(--bg-card)', position:'sticky', top:0, zIndex:100 }}>
        <div style={{ display:'flex', alignItems:'center', gap:'1.25rem' }}>
          <Link to="/" style={{ fontFamily:'Space Mono', fontWeight:700, fontSize:'1rem' }}>
            <span style={{ color:'var(--accent)' }}>finesse</span><span style={{ color:'var(--text)' }}>Dev</span>
          </Link>
          <span style={{ fontFamily:'Space Mono', fontSize:'0.62rem', color:'var(--text-dim)', letterSpacing:'0.15em', background:'var(--accent-glow)', border:'1px solid var(--accent-border)', padding:'2px 8px', borderRadius:'4px' }}>ADMIN</span>
        </div>
        <div style={{ display:'flex', gap:'0.75rem', alignItems:'center' }}>
          <button onClick={handleSeed}  style={{ ...c.btnSecondary, fontSize:'0.65rem', padding:'5px 14px' }}>Seed DB</button>
          <button onClick={handleLogout} style={c.btnSecondary}>Sign Out</button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'1.75rem 2rem 0' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))', gap:'1rem' }}>
          {[['Projects',data.projects.length,'📁'],['Skills',data.skills.length,'⚡'],['Experience',data.experiences.length,'💼'],['Certs',data.certificates.length,'🎓'],['Testimonials',data.testimonials.length,'💬'],['Messages',data.messages.length,'📩']].map(([l,n,ic])=>(
            <div key={l} style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'10px', padding:'1.1rem 1.25rem' }}>
              <div style={{ fontSize:'0.82rem', color:'var(--text-muted)', marginBottom:'0.3rem' }}>{ic} {l}</div>
              <div style={{ fontFamily:'Space Mono', fontSize:'1.8rem', fontWeight:700, color:'var(--text)', lineHeight:1 }}>{n}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'1.5rem 2rem 0' }}>
        <div style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap', marginBottom:'1.5rem' }}>
          {TABS.map(t=>(
            <button key={t} onClick={()=>setTab(t)} style={tab===t ? c.tabActive : c.tabIdle}>{tabLabels[t]}</button>
          ))}
        </div>

        {/* ── PROJECTS ── */}
        {tab==='projects' && (
          <div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.25rem' }}>
              <h2 style={{ fontWeight:600, fontSize:'1.1rem' }}>Projects</h2>
              <button onClick={()=>openModal('projects')} style={c.btnPrimary}>+ Add Project</button>
            </div>
            <div style={{ display:'grid', gap:'0.75rem' }}>
              {data.projects.map(p=>(
                <div key={p._id} style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'10px', padding:'1.25rem', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'1rem' }}>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'0.6rem', marginBottom:'0.35rem' }}>
                      <span style={{ fontWeight:600 }}>{p.title}</span>
                      {p.featured && <span style={{ fontFamily:'Space Mono', fontSize:'0.6rem', color:'var(--accent)', border:'1px solid var(--accent-border)', padding:'1px 7px', borderRadius:'20px' }}>★</span>}
                    </div>
                    <p style={{ color:'var(--text-muted)', fontSize:'0.82rem', marginBottom:'0.5rem', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:'500px' }}>{p.description}</p>
                    <div style={{ display:'flex', gap:'0.35rem', flexWrap:'wrap' }}>
                      {p.techStack?.slice(0,5).map(t=><span key={t} style={{ fontFamily:'Space Mono', fontSize:'0.58rem', color:'var(--text-muted)', border:'1px solid var(--border)', padding:'2px 6px', borderRadius:'4px' }}>{t}</span>)}
                    </div>
                  </div>
                  <div style={{ display:'flex', gap:'0.5rem' }}>
                    <button onClick={()=>openModal('projects', p)} style={c.btnSecondary}>Edit</button>
                    <button onClick={()=>handleDelete('projects', p._id)} style={c.btnDanger}>Delete</button>
                  </div>
                </div>
              ))}
              {data.projects.length===0 && <Empty label="No projects yet." />}
            </div>
          </div>
        )}

        {/* ── SKILLS ── */}
        {tab==='skills' && (
          <div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.25rem' }}>
              <h2 style={{ fontWeight:600, fontSize:'1.1rem' }}>Skills</h2>
              <button onClick={()=>openModal('skills')} style={c.btnPrimary}>+ Add Skill</button>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:'0.75rem' }}>
              {data.skills.map(s=>(
                <div key={s._id} style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'10px', padding:'1.1rem' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'0.6rem' }}>
                    <span style={{ fontWeight:600 }}>{s.name}</span>
                    <span style={{ fontFamily:'Space Mono', fontSize:'0.72rem', color:'var(--accent)' }}>{s.proficiency}%</span>
                  </div>
                  <div style={{ height:'4px', background:'var(--border)', borderRadius:'2px', marginBottom:'0.75rem' }}>
                    <div style={{ height:'100%', width:`${s.proficiency}%`, background:'linear-gradient(to right,var(--accent),var(--accent-2))' }} />
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <span style={{ fontFamily:'Space Mono', fontSize:'0.6rem', color:'var(--text-dim)', textTransform:'uppercase' }}>{s.category}</span>
                    <div style={{ display:'flex', gap:'0.4rem' }}>
                      <button onClick={()=>openModal('skills', s)} style={{ ...c.btnSecondary, padding:'3px 10px', fontSize:'0.65rem' }}>Edit</button>
                      <button onClick={()=>handleDelete('skills', s._id)} style={{ ...c.btnDanger, padding:'3px 10px', fontSize:'0.65rem' }}>Del</button>
                    </div>
                  </div>
                </div>
              ))}
              {data.skills.length===0 && <Empty label="No skills yet." />}
            </div>
          </div>
        )}

        {/* ── EXPERIENCE ── */}
        {tab==='experience' && (
          <div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.25rem' }}>
              <h2 style={{ fontWeight:600, fontSize:'1.1rem' }}>Experience</h2>
              <button onClick={()=>openModal('experience')} style={c.btnPrimary}>+ Add Experience</button>
            </div>
            <div style={{ display:'grid', gap:'0.75rem' }}>
              {data.experiences.map(e=>(
                <div key={e._id} style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'10px', padding:'1.25rem', display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'1rem', flexWrap:'wrap' }}>
                  <div>
                    <div style={{ fontWeight:600 }}>{e.role}</div>
                    <div style={{ fontFamily:'Space Mono', fontSize:'0.72rem', color:'var(--text-muted)', margin:'3px 0 6px' }}>{e.company} · {e.startDate} – {e.current?'Present':e.endDate}</div>
                    <div style={{ color:'var(--text-muted)', fontSize:'0.82rem' }}>{e.description}</div>
                  </div>
                  <div style={{ display:'flex', gap:'0.5rem' }}>
                    <button onClick={()=>openModal('experience', e)} style={c.btnSecondary}>Edit</button>
                    <button onClick={()=>handleDelete('experience', e._id)} style={c.btnDanger}>Delete</button>
                  </div>
                </div>
              ))}
              {data.experiences.length===0 && <Empty label="No experience entries yet." />}
            </div>
          </div>
        )}

        {/* ── CERTIFICATES ── */}
        {tab==='certificates' && (
          <div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.25rem' }}>
              <h2 style={{ fontWeight:600, fontSize:'1.1rem' }}>Certificates</h2>
              <button onClick={()=>openModal('certificates')} style={c.btnPrimary}>+ Add Certificate</button>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:'0.75rem' }}>
              {data.certificates.map(cert=>(
                <div key={cert._id} style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'10px', padding:'1.25rem' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'0.75rem' }}>
                    <div style={{ width:'38px', height:'38px', borderRadius:'8px', background:'var(--accent-glow)', border:'1px solid var(--accent-border)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.1rem', flexShrink:0 }}>🎓</div>
                    <div>
                      <div style={{ fontWeight:600, fontSize:'0.9rem' }}>{cert.title}</div>
                      <div style={{ fontFamily:'Space Mono', fontSize:'0.68rem', color:'var(--text-muted)' }}>{cert.issuer} · {cert.issueDate}</div>
                    </div>
                  </div>
                  {cert.description && <p style={{ color:'var(--text-muted)', fontSize:'0.82rem', marginBottom:'0.75rem', lineHeight:1.5 }}>{cert.description}</p>}
                  <div style={{ display:'flex', justifyContent:'flex-end', gap:'0.5rem' }}>
                    <button onClick={()=>openModal('certificates', cert)} style={{ ...c.btnSecondary, padding:'4px 12px', fontSize:'0.65rem' }}>Edit</button>
                    <button onClick={()=>handleDelete('certificates', cert._id)} style={{ ...c.btnDanger, padding:'4px 12px', fontSize:'0.65rem' }}>Delete</button>
                  </div>
                </div>
              ))}
              {data.certificates.length===0 && <Empty label="No certificates yet." />}
            </div>
          </div>
        )}

        {/* ── TESTIMONIALS ── */}
        {tab==='testimonials' && (
          <div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.25rem' }}>
              <h2 style={{ fontWeight:600, fontSize:'1.1rem' }}>Testimonials</h2>
              <button onClick={()=>openModal('testimonials')} style={c.btnPrimary}>+ Add Testimonial</button>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:'0.75rem' }}>
              {data.testimonials.map(t=>(
                <div key={t._id} style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'10px', padding:'1.25rem' }}>
                  <p style={{ color:'var(--text-muted)', fontSize:'0.85rem', lineHeight:1.65, marginBottom:'1rem', fontStyle:'italic' }}>"{t.quote}"</p>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <div>
                      <div style={{ fontWeight:600, fontSize:'0.88rem' }}>{t.name}</div>
                      <div style={{ fontFamily:'Space Mono', fontSize:'0.65rem', color:'var(--text-muted)' }}>{t.role}{t.company?`, ${t.company}`:''}</div>
                      <div style={{ marginTop:'4px' }}>{Array.from({length:t.rating||5}).map((_,i)=><span key={i} style={{ color:'#fbbf24', fontSize:'0.8rem' }}>★</span>)}</div>
                    </div>
                    <div style={{ display:'flex', flexDirection:'column', gap:'0.4rem' }}>
                      <button onClick={()=>openModal('testimonials', t)} style={{ ...c.btnSecondary, padding:'4px 12px', fontSize:'0.65rem' }}>Edit</button>
                      <button onClick={()=>handleDelete('testimonials', t._id)} style={{ ...c.btnDanger, padding:'4px 12px', fontSize:'0.65rem' }}>Delete</button>
                    </div>
                  </div>
                </div>
              ))}
              {data.testimonials.length===0 && <Empty label="No testimonials yet." />}
            </div>
          </div>
        )}

        {/* ── MESSAGES ── */}
        {tab==='messages' && (
          <div>
            <h2 style={{ fontWeight:600, fontSize:'1.1rem', marginBottom:'1.25rem' }}>Messages {unread>0 && <span style={{ fontFamily:'Space Mono', fontSize:'0.65rem', color:'var(--accent)', border:'1px solid var(--accent-border)', padding:'2px 8px', borderRadius:'20px', marginLeft:'0.5rem' }}>{unread} unread</span>}</h2>
            <div style={{ display:'grid', gap:'0.75rem' }}>
              {data.messages.map(m=>(
                <div key={m._id} style={{ background:'var(--bg-card)', border:`1px solid ${m.read?'var(--border)':'var(--accent-border)'}`, borderRadius:'10px', padding:'1.25rem', position:'relative' }}>
                  {!m.read && <div style={{ position:'absolute', top:'1.25rem', right:'1.25rem', width:'8px', height:'8px', borderRadius:'50%', background:'var(--accent)', boxShadow:'0 0 6px var(--accent)' }} />}
                  <div style={{ display:'flex', gap:'1rem', marginBottom:'0.5rem', flexWrap:'wrap', alignItems:'center' }}>
                    <span style={{ fontWeight:600 }}>{m.name}</span>
                    <span style={{ fontFamily:'Space Mono', fontSize:'0.7rem', color:'var(--text-muted)' }}>{m.email}</span>
                    <span style={{ fontFamily:'Space Mono', fontSize:'0.68rem', color:'var(--text-dim)' }}>{new Date(m.createdAt).toLocaleDateString()}</span>
                  </div>
                  {m.subject && <div style={{ fontFamily:'Space Mono', fontSize:'0.72rem', color:'var(--text-muted)', marginBottom:'0.5rem' }}>Subject: {m.subject}</div>}
                  <p style={{ color:'var(--text-muted)', fontSize:'0.87rem', lineHeight:1.65 }}>{m.message}</p>
                  <div style={{ marginTop:'1rem', display:'flex', gap:'0.5rem' }}>
                    {!m.read && <button onClick={()=>handleMarkRead(m._id)} style={{ ...c.btnSecondary, fontSize:'0.65rem', padding:'4px 12px' }}>Mark Read</button>}
                    <button onClick={()=>handleDelete('messages', m._id)} style={{ ...c.btnDanger, fontSize:'0.65rem', padding:'4px 12px' }}>Delete</button>
                  </div>
                </div>
              ))}
              {data.messages.length===0 && <Empty label="No messages yet." />}
            </div>
          </div>
        )}
      </div>

      {/* ── MODAL ── */}
      {modal && (
        <div onClick={e=>e.target===e.currentTarget&&setModal(null)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.75)', backdropFilter:'blur(4px)', zIndex:5000, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }}>
          <div style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'12px', padding:'2rem', width:'100%', maxWidth:'560px', maxHeight:'88vh', overflowY:'auto', boxShadow:'var(--shadow-lg)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' }}>
              <h3 style={{ fontWeight:600 }}>{form._id?'Edit':'Add'} {modal.charAt(0).toUpperCase()+modal.slice(1).replace('ies','y')}</h3>
              <button onClick={()=>setModal(null)} style={{ background:'none', border:'none', color:'var(--text-muted)', fontSize:'1.2rem', cursor:'pointer' }}>✕</button>
            </div>

            {/* PROJECT FIELDS */}
            {modal==='projects' && <>
              <input style={c.input} placeholder="Title *" value={form.title||''} onChange={e=>sf('title',e.target.value)} onFocus={e=>e.target.style.borderColor='var(--accent-border)'} onBlur={e=>e.target.style.borderColor='var(--border)'} />
              <textarea style={{...c.input,height:'70px',resize:'vertical'}} placeholder="Short description *" value={form.description||''} onChange={e=>sf('description',e.target.value)} onFocus={e=>e.target.style.borderColor='var(--accent-border)'} onBlur={e=>e.target.style.borderColor='var(--border)'} />
              <textarea style={{...c.input,height:'80px',resize:'vertical'}} placeholder="Long description (shown in modal)" value={form.longDescription||''} onChange={e=>sf('longDescription',e.target.value)} onFocus={e=>e.target.style.borderColor='var(--accent-border)'} onBlur={e=>e.target.style.borderColor='var(--border)'} />
              <input style={c.input} placeholder="Tech stack (comma-separated: React, Node.js, ...)" value={form.techStack||''} onChange={e=>sf('techStack',e.target.value)} onFocus={e=>e.target.style.borderColor='var(--accent-border)'} onBlur={e=>e.target.style.borderColor='var(--border)'} />
              <input style={c.input} placeholder="GitHub URL" value={form.githubUrl||''} onChange={e=>sf('githubUrl',e.target.value)} onFocus={e=>e.target.style.borderColor='var(--accent-border)'} onBlur={e=>e.target.style.borderColor='var(--border)'} />
              <input style={c.input} placeholder="Live URL" value={form.liveUrl||''} onChange={e=>sf('liveUrl',e.target.value)} onFocus={e=>e.target.style.borderColor='var(--accent-border)'} onBlur={e=>e.target.style.borderColor='var(--border)'} />
              <input style={c.input} placeholder="Cover image URL (optional)" value={form.imageUrl||''} onChange={e=>sf('imageUrl',e.target.value)} onFocus={e=>e.target.style.borderColor='var(--accent-border)'} onBlur={e=>e.target.style.borderColor='var(--border)'} />
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem', marginBottom:'0.85rem' }}>
                <select style={{...c.input,marginBottom:0}} value={form.category||'fullstack'} onChange={e=>sf('category',e.target.value)}>
                  {['fullstack','frontend','backend','api','other'].map(v=><option key={v} value={v}>{v}</option>)}
                </select>
                <select style={{...c.input,marginBottom:0}} value={form.status||'completed'} onChange={e=>sf('status',e.target.value)}>
                  {['completed','in-progress','archived'].map(v=><option key={v} value={v}>{v}</option>)}
                </select>
              </div>
              <label style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'1.25rem', cursor:'pointer', fontFamily:'Space Mono', fontSize:'0.72rem', color:'var(--text-muted)' }}>
                <input type="checkbox" checked={form.featured||false} onChange={e=>sf('featured',e.target.checked)} /> Featured project
              </label>
            </>}

            {/* SKILL FIELDS */}
            {modal==='skills' && <>
              <input style={c.input} placeholder="Skill name *" value={form.name||''} onChange={e=>sf('name',e.target.value)} onFocus={e=>e.target.style.borderColor='var(--accent-border)'} onBlur={e=>e.target.style.borderColor='var(--border)'} />
              <select style={c.input} value={form.category||'frontend'} onChange={e=>sf('category',e.target.value)}>
                {['frontend','backend','database','tools','other'].map(v=><option key={v} value={v}>{v}</option>)}
              </select>
              <div style={{ marginBottom:'1.25rem' }}>
                <label style={{ fontFamily:'Space Mono', fontSize:'0.7rem', color:'var(--text-muted)', display:'block', marginBottom:'0.5rem' }}>Proficiency: <span style={{ color:'var(--accent)' }}>{form.proficiency||80}%</span></label>
                <input type="range" min="1" max="100" value={form.proficiency||80} onChange={e=>sf('proficiency',Number(e.target.value))} style={{ width:'100%', accentColor:'var(--accent)' }} />
              </div>
            </>}

            {/* EXPERIENCE FIELDS */}
            {modal==='experience' && <>
              <input style={c.input} placeholder="Company *" value={form.company||''} onChange={e=>sf('company',e.target.value)} onFocus={e=>e.target.style.borderColor='var(--accent-border)'} onBlur={e=>e.target.style.borderColor='var(--border)'} />
              <input style={c.input} placeholder="Role / Title *" value={form.role||''} onChange={e=>sf('role',e.target.value)} onFocus={e=>e.target.style.borderColor='var(--accent-border)'} onBlur={e=>e.target.style.borderColor='var(--border)'} />
              <textarea style={{...c.input,height:'70px',resize:'vertical'}} placeholder="Description" value={form.description||''} onChange={e=>sf('description',e.target.value)} onFocus={e=>e.target.style.borderColor='var(--accent-border)'} onBlur={e=>e.target.style.borderColor='var(--border)'} />
              <textarea style={{...c.input,height:'90px',resize:'vertical'}} placeholder="Achievements (one per line)" value={form.achievements||''} onChange={e=>sf('achievements',e.target.value)} onFocus={e=>e.target.style.borderColor='var(--accent-border)'} onBlur={e=>e.target.style.borderColor='var(--border)'} />
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem' }}>
                <input style={{...c.input}} placeholder="Start date (e.g. 2022-01)" value={form.startDate||''} onChange={e=>sf('startDate',e.target.value)} onFocus={e=>e.target.style.borderColor='var(--accent-border)'} onBlur={e=>e.target.style.borderColor='var(--border)'} />
                <input style={{...c.input}} placeholder="End date" value={form.endDate||''} onChange={e=>sf('endDate',e.target.value)} disabled={form.current} onFocus={e=>e.target.style.borderColor='var(--accent-border)'} onBlur={e=>e.target.style.borderColor='var(--border)'} />
              </div>
              <input style={c.input} placeholder="Tech used (comma-separated)" value={form.techUsed||''} onChange={e=>sf('techUsed',e.target.value)} onFocus={e=>e.target.style.borderColor='var(--accent-border)'} onBlur={e=>e.target.style.borderColor='var(--border)'} />
              <label style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'1.25rem', cursor:'pointer', fontFamily:'Space Mono', fontSize:'0.72rem', color:'var(--text-muted)' }}>
                <input type="checkbox" checked={form.current||false} onChange={e=>sf('current',e.target.checked)} /> Current position
              </label>
            </>}

            {/* CERTIFICATE FIELDS */}
            {modal==='certificates' && <>
              <input style={c.input} placeholder="Certificate title *" value={form.title||''} onChange={e=>sf('title',e.target.value)} onFocus={e=>e.target.style.borderColor='var(--accent-border)'} onBlur={e=>e.target.style.borderColor='var(--border)'} />
              <input style={c.input} placeholder="Issuer (e.g. freeCodeCamp) *" value={form.issuer||''} onChange={e=>sf('issuer',e.target.value)} onFocus={e=>e.target.style.borderColor='var(--accent-border)'} onBlur={e=>e.target.style.borderColor='var(--border)'} />
              <input style={c.input} placeholder="Issue date (e.g. 2023-06)" value={form.issueDate||''} onChange={e=>sf('issueDate',e.target.value)} onFocus={e=>e.target.style.borderColor='var(--accent-border)'} onBlur={e=>e.target.style.borderColor='var(--border)'} />
              <input style={c.input} placeholder="Credential URL" value={form.credentialUrl||''} onChange={e=>sf('credentialUrl',e.target.value)} onFocus={e=>e.target.style.borderColor='var(--accent-border)'} onBlur={e=>e.target.style.borderColor='var(--border)'} />
              <input style={c.input} placeholder="Badge / image URL (optional)" value={form.imageUrl||''} onChange={e=>sf('imageUrl',e.target.value)} onFocus={e=>e.target.style.borderColor='var(--accent-border)'} onBlur={e=>e.target.style.borderColor='var(--border)'} />
              <textarea style={{...c.input,height:'80px',resize:'vertical'}} placeholder="Description" value={form.description||''} onChange={e=>sf('description',e.target.value)} onFocus={e=>e.target.style.borderColor='var(--accent-border)'} onBlur={e=>e.target.style.borderColor='var(--border)'} />
            </>}

            {/* TESTIMONIAL FIELDS */}
            {modal==='testimonials' && <>
              <input style={c.input} placeholder="Person's name *" value={form.name||''} onChange={e=>sf('name',e.target.value)} onFocus={e=>e.target.style.borderColor='var(--accent-border)'} onBlur={e=>e.target.style.borderColor='var(--border)'} />
              <input style={c.input} placeholder="Role / Title *" value={form.role||''} onChange={e=>sf('role',e.target.value)} onFocus={e=>e.target.style.borderColor='var(--accent-border)'} onBlur={e=>e.target.style.borderColor='var(--border)'} />
              <input style={c.input} placeholder="AvatarUrl *" value={form.avatarUrl||''} onChange={e=>sf('avatarUrl',e.target.value)} onFocus={e=>e.target.style.borderColor='var(--accent-border)'} onBlur={e=>e.target.style.borderColor='var(--border)'} />
              <input style={c.input} placeholder="Company (optional)" value={form.company||''} onChange={e=>sf('company',e.target.value)} onFocus={e=>e.target.style.borderColor='var(--accent-border)'} onBlur={e=>e.target.style.borderColor='var(--border)'} />
              <textarea style={{...c.input,height:'100px',resize:'vertical'}} placeholder="Their testimonial quote *" value={form.quote||''} onChange={e=>sf('quote',e.target.value)} onFocus={e=>e.target.style.borderColor='var(--accent-border)'} onBlur={e=>e.target.style.borderColor='var(--border)'} />
              <div style={{ marginBottom:'1.25rem' }}>
                <label style={{ fontFamily:'Space Mono', fontSize:'0.7rem', color:'var(--text-muted)', display:'block', marginBottom:'0.5rem' }}>Rating: <span style={{ color:'#fbbf24' }}>{'★'.repeat(form.rating||5)}</span></label>
                <input type="range" min="1" max="5" value={form.rating||5} onChange={e=>sf('rating',Number(e.target.value))} style={{ width:'100%', accentColor:'#fbbf24' }} />
              </div>
            </>}

            <div style={{ display:'flex', gap:'0.75rem', justifyContent:'flex-end', paddingTop:'0.5rem', borderTop:'1px solid var(--border)' }}>
              <button onClick={()=>setModal(null)} style={c.btnSecondary}>Cancel</button>
              <button onClick={handleSave} disabled={saving} style={{ ...c.btnPrimary, opacity:saving?0.6:1 }}>{saving?'Saving...':'Save'}</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ height:'3rem' }} />
    </div>
  );
}

function Empty({ label }) {
  return (
    <div style={{ padding:'3rem', textAlign:'center', color:'var(--text-dim)', fontFamily:'Space Mono', fontSize:'0.8rem', background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'10px' }}>
      {label}
    </div>
  );
}
