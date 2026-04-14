import React from 'react'

const s = {
  panel: (open) => ({
    position: 'fixed', right: 24, bottom: 68, width: 300, zIndex: 25,
    background: 'rgba(5,26,16,0.95)', backdropFilter: 'blur(20px)',
    border: '1px solid rgba(34,197,94,0.1)', borderRadius: 12, padding: 24,
    opacity: open ? 1 : 0, transform: open ? 'translateY(0)' : 'translateY(10px)',
    transition: 'all 0.3s ease', visibility: open ? 'visible' : 'hidden',
    pointerEvents: open ? 'all' : 'none',
  }),
  label: { fontFamily: "'DM Mono', monospace", fontSize: 7, letterSpacing: 3, textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: 6 },
  title: { fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 16, color: '#fff', letterSpacing: 1 },
  text: { fontFamily: "'DM Sans', sans-serif", fontSize: 12, lineHeight: 1.6, color: 'rgba(255,255,255,0.55)', marginTop: 4 },
  divider: { height: 1, background: 'rgba(34,197,94,0.08)', margin: '14px 0' },
  badge: {
    display: 'inline-block', fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: 1,
    padding: '2px 8px', borderRadius: 10, border: '1px solid rgba(34,197,94,0.15)',
    color: 'rgba(255,255,255,0.35)', marginRight: 4, marginBottom: 4,
  },
  agent: { marginBottom: 8 },
  agentName: { fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 2 },
  agentRole: { fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.4)' },
}

const agents = [
  { name: 'STEWARD',  color: '#22C55E', role: 'The Director — 指揮・調整・統合・記録' },
  { name: 'SCOUT',    color: '#4ADE80', role: 'The Connector — 営業開発・見込み客リサーチ' },
  { name: 'TORCH',    color: '#FBBF24', role: 'The Provocateur — コンテンツ戦略・LP改善' },
  { name: 'RANGER',   color: '#60A5FA', role: 'The Pragmatist — 実行管理・優先順位付け' },
  { name: 'SENTINEL', color: '#F87171', role: 'The Skeptic — 品質監査・リスク検証' },
  { name: 'REVIEWER', color: '#A78BFA', role: 'The Auditor — Google広告レビュー' },
  { name: 'REPORTER', color: '#34D399', role: 'The Narrator — 月次レポート作成' },
]

export default function InfoPanel({ open }) {
  return (
    <div style={s.panel(open)}>
      <div style={{ marginBottom: 16 }}>
        <div style={s.label}>Project</div>
        <div style={s.title}>
          FORESY{' '}
          <span style={{ color: '#22C55E' }}>GROVE</span>
        </div>
        <div style={s.text}>
          7体のAIエージェントが働く3Dミニチュアオフィス。
          歩き、会話し、会議を開く様子をリアルタイムで可視化。
          React + Three.js製。
        </div>
      </div>

      <div style={s.divider} />

      <div style={{ marginBottom: 16 }}>
        <div style={s.label}>チームメンバー</div>
        <div style={{ marginTop: 8 }}>
          {agents.map(a => (
            <div key={a.name} style={{ ...s.agent, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: a.color, boxShadow: `0 0 4px ${a.color}`, marginTop: 4, flexShrink: 0 }} />
              <div>
                <div style={{ ...s.agentName, color: a.color }}>{a.name}</div>
                <div style={s.agentRole}>{a.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={s.divider} />

      <div>
        <div style={s.label}>操作方法</div>
        <div style={{ marginTop: 6 }}>
          {['ドラッグ：カメラ回転', 'スクロール：ズーム', 'スライダー：時間変更', 'LIGHTS OFF：夜間モード'].map(t => (
            <span key={t} style={s.badge}>{t}</span>
          ))}
        </div>
      </div>

      <div style={s.divider} />

      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: 1, color: 'rgba(34,197,94,0.4)', textAlign: 'center' }}>
        Foresy — デジタル広告・データ計測のパートナー
      </div>
    </div>
  )
}
