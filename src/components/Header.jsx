import React from 'react'

export default function Header() {
  return (
    <div style={{
      position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)',
      textAlign: 'center', zIndex: 20, pointerEvents: 'none',
      opacity: 0, animation: 'fadeUp 1.2s ease 0.3s forwards'
    }}>
      <h1 style={{
        fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18,
        letterSpacing: 5, textTransform: 'uppercase', color: 'rgba(255,255,255,0.85)', margin: 0,
      }}>
        FORESY{' '}
        <span style={{
          background: 'linear-gradient(135deg, #22C55E, #4ADE80)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
        }}>
          GROVE
        </span>
      </h1>
      <div style={{
        fontFamily: "'DM Mono', monospace", fontSize: 9, fontWeight: 300,
        letterSpacing: 4, textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginTop: 4,
      }}>
        AIエージェントチームの仮想オフィス
      </div>
    </div>
  )
}
