import { useState, useRef, useEffect } from 'react';
import axios from 'axios';

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hey! I'm Quadri's AI assistant. Ask me anything about his skills, projects, or experience 🚀" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 200);
  }, [open]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: 'user', content: input };
    const history = messages.slice(1).map(m => ({ role: m.role, content: m.content }));
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const { data } = await axios.post('/api/chat', { message: input, history });
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Chat service unavailable. Please ensure GROQ_API_KEY is set in backend .env.' }]);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = ["What tech does Quadri use?", "Tell me about his projects", "Is he available for hire?"];

  return (
    <>
      {/* FAB */}
      <button onClick={() => setOpen(o => !o)} style={{
        position: 'fixed', bottom: 'clamp(1.25rem,3vw,2rem)', right: 'clamp(1.25rem,3vw,2rem)',
        width: '52px', height: '52px', borderRadius: '50%',
        background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
        color: '#fff', border: 'none', cursor: 'pointer', zIndex: 2000,
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem',
        boxShadow: '0 4px 24px var(--accent-glow)', transition: 'transform 0.2s'
      }}
      onMouseOver={e => e.currentTarget.style.transform='scale(1.1)'}
      onMouseOut={e => e.currentTarget.style.transform='scale(1)'}>
        {open ? '✕' : '💬'}
      </button>

      {/* Panel */}
      <div style={{
        position: 'fixed',
        bottom: 'clamp(4.5rem,10vw,5.5rem)',
        right: 'clamp(1.25rem,3vw,2rem)',
        width: 'min(360px, calc(100vw - 2.5rem))',
        maxHeight: '520px',
        background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)',
        zIndex: 1999, display: 'flex', flexDirection: 'column', overflow: 'hidden',
        boxShadow: 'var(--shadow-lg)',
        transform: open ? 'scale(1) translateY(0)' : 'scale(0.9) translateY(20px)',
        opacity: open ? 1 : 0,
        pointerEvents: open ? 'all' : 'none',
        transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
        transformOrigin: 'bottom right'
      }}>
        {/* Header */}
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'var(--bg-2)' }}>
          <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.95rem' }}>⚡</div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text)' }}>finesseDev AI</div>
            <div style={{ fontFamily: 'Space Mono', fontSize: '0.62rem', color: 'var(--text-muted)' }}>Ask about Quadri</div>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 6px #4ade80' }} />
            <span style={{ fontFamily: 'Space Mono', fontSize: '0.6rem', color: 'var(--text-dim)' }}>Online</span>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {messages.map((m, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <div style={{
                maxWidth: '82%', padding: '0.7rem 0.95rem',
                borderRadius: m.role === 'user' ? '14px 14px 3px 14px' : '14px 14px 14px 3px',
                background: m.role === 'user' ? 'linear-gradient(135deg, var(--accent), var(--accent-2))' : 'var(--bg)',
                color: m.role === 'user' ? '#fff' : 'var(--text)',
                fontSize: '0.84rem', lineHeight: 1.6,
                border: m.role === 'assistant' ? '1px solid var(--border)' : 'none'
              }}>{m.content}</div>
            </div>
          ))}
          {loading && (
            <div style={{ display: 'flex', gap: '5px', padding: '0.7rem 0.95rem', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '14px 14px 14px 3px', width: 'fit-content' }}>
              {[0,1,2].map(i => (
                <div key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--text-dim)', animation: `chatDot 1.2s ${i*0.2}s infinite` }} />
              ))}
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Suggestions */}
        {messages.length <= 1 && (
          <div style={{ padding: '0 1rem 0.5rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {suggestions.map(s => (
              <button key={s} onClick={() => setInput(s)} style={{
                textAlign: 'left', background: 'var(--bg)', border: '1px solid var(--border)',
                color: 'var(--text-muted)', fontSize: '0.76rem', padding: '7px 11px', borderRadius: '6px',
                cursor: 'pointer', fontFamily: 'Space Grotesk', transition: 'all 0.2s'
              }}
              onMouseOver={e => { e.currentTarget.style.borderColor='var(--accent-border)'; e.currentTarget.style.color='var(--accent)'; }}
              onMouseOut={e => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.color='var(--text-muted)'; }}>
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div style={{ padding: '0.75rem 1rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '0.5rem', background: 'var(--bg-2)' }}>
          <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="Ask anything..."
            style={{ flex: 1, background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', padding: '0.6rem 0.85rem', color: 'var(--text)', fontSize: '0.84rem', outline: 'none', fontFamily: 'Space Grotesk' }} />
          <button onClick={send} disabled={loading || !input.trim()} style={{
            background: input.trim() ? 'linear-gradient(135deg, var(--accent), var(--accent-2))' : 'var(--bg)',
            color: input.trim() ? '#fff' : 'var(--text-dim)',
            border: 'none', borderRadius: '8px', width: '38px', cursor: input.trim() ? 'pointer' : 'not-allowed',
            fontSize: '1rem', transition: 'all 0.2s', flexShrink: 0
          }}>↑</button>
        </div>
      </div>
      <style>{`@keyframes chatDot{0%,100%{opacity:0.3;transform:translateY(0)}50%{opacity:1;transform:translateY(-3px)}}`}</style>
    </>
  );
}
