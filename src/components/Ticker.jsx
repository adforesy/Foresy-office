import React from 'react'

// Foresyのエージェント活動ティッカー
const messages = [
  { text: 'SCOUT：見込み客リスト更新完了',        color: '#4ADE80' },
  { text: 'REVIEWER：広告キャンペーン審査通過',    color: '#A78BFA' },
  { text: 'REPORTER：月次レポート生成中',          color: '#34D399' },
  { text: 'TORCH：X投稿案を5件作成',               color: '#FBBF24' },
  { text: 'RANGER：今週のTODO優先順位付け完了',   color: '#60A5FA' },
  { text: 'SENTINEL：セキュリティ監査クリア ✓',   color: '#F87171' },
  { text: 'STEWARD：4チームの議論を統合中',        color: '#22C55E' },
  { text: 'SCOUT：アウトリーチDM下書き完成',       color: '#4ADE80' },
  { text: 'REVIEWER：P-MAX構成の妥当性確認済み',  color: '#A78BFA' },
  { text: 'TORCH：LP改善案を提案',                 color: '#FBBF24' },
  { text: 'REPORTER：Looker Studio更新 ✓',        color: '#34D399' },
  { text: 'RANGER：80/20分析完了',                color: '#60A5FA' },
]

const doubled = [...messages, ...messages]

export default function Ticker() {
  return (
    <div style={{
      position: 'fixed', top: 55, left: 0, right: 0, zIndex: 20, pointerEvents: 'none',
      overflow: 'hidden', height: 20,
      opacity: 0, animation: 'fadeUpR 1.2s ease 2s forwards',
    }}>
      <div style={{
        display: 'flex', gap: 40, whiteSpace: 'nowrap', width: 'max-content',
        animation: 'tickerScroll 35s linear infinite',
      }}>
        {doubled.map((m, i) => (
          <span key={i} style={{
            fontFamily: "'DM Mono', monospace", fontSize: 8, letterSpacing: 2,
            textTransform: 'uppercase', color: m.color, marginRight: 40,
          }}>
            ▸ {m.text}
          </span>
        ))}
      </div>
      <style>{`@keyframes tickerScroll { 0% { transform: translateX(0) } 100% { transform: translateX(-50%) } }`}</style>
    </div>
  )
}
