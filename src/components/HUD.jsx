import React from 'react'

const s = {
  hud: {
    position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
    display: 'flex', alignItems: 'center', gap: 16, zIndex: 20,
    background: 'rgba(5,26,16,0.82)', backdropFilter: 'blur(16px)',
    border: '1px solid rgba(34,197,94,0.12)', borderRadius: 40, padding: '10px 24px',
    opacity: 0, animation: 'fadeUp 1.2s ease 0.8s forwards',
  },
  clock: { fontFamily: "'Orbitron', sans-serif", fontSize: 13, fontWeight: 500, color: '#22C55E', minWidth: 48, textAlign: 'center' },
  div: { width: 1, height: 14, background: 'rgba(255,255,255,0.08)' },
  status: { fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', minWidth: 110, textAlign: 'center' },
}

export default function HUD({ time, timeValue, status, cyberpunk, onTimeChange, onCyberpunk }) {
  return (
    <div style={s.hud}>
      <span style={s.clock}>{time}</span>
      <div style={s.div} />
      <input
        type="range" min="0" max="1440" value={timeValue} step="1"
        onChange={e => onTimeChange(parseInt(e.target.value))}
        style={{
          WebkitAppearance: 'none', appearance: 'none', width: 160, height: 2,
          borderRadius: 1, background: 'rgba(255,255,255,0.1)', outline: 'none', cursor: 'pointer',
        }}
      />
      <div style={s.div} />
      <span style={s.status}>{status}</span>
      <div style={s.div} />
      <button onClick={onCyberpunk} style={{
        background: cyberpunk ? 'rgba(34,197,94,0.15)' : 'none',
        border: `1px solid ${cyberpunk ? '#22C55E' : 'rgba(255,255,255,0.15)'}`,
        borderRadius: 20, padding: '4px 12px', color: '#22C55E',
        fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: 2,
        textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.3s',
      }}>
        {cyberpunk ? 'LIGHTS ON' : 'LIGHTS OFF'}
      </button>
    </div>
  )
}
