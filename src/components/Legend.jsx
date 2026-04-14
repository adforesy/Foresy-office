import React from 'react'

// Foresy Grove チームメンバー
const agents = [
  { name: 'SCOUT',    color: '#4ADE80', role: 'Connector' },
  { name: 'TORCH',    color: '#FBBF24', role: 'Provocateur' },
  { name: 'RANGER',   color: '#60A5FA', role: 'Pragmatist' },
  { name: 'SENTINEL', color: '#F87171', role: 'Skeptic' },
  { name: 'REVIEWER', color: '#A78BFA', role: 'Auditor' },
  { name: 'REPORTER', color: '#34D399', role: 'Narrator' },
  { name: 'STEWARD',  color: '#22C55E', role: 'Director' },
]

export default function Legend() {
  return (
    <div style={{
      position: 'fixed', bottom: 72, left: '50%', transform: 'translateX(-50%)',
      display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 14,
      zIndex: 20, pointerEvents: 'none',
      opacity: 0, animation: 'fadeUp 1.2s ease 1.2s forwards',
    }}>
      {agents.map(a => (
        <div key={a.name} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <div style={{
            width: 5, height: 5, borderRadius: '50%',
            background: a.color, boxShadow: `0 0 4px ${a.color}`
          }} />
          <span style={{
            fontFamily: "'DM Mono', monospace", fontSize: 8,
            letterSpacing: 1.5, textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)'
          }}>
            {a.name}
          </span>
        </div>
      ))}
    </div>
  )
}
