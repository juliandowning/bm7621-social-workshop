import { useEffect, useState } from 'react'
import { getAllTeamsData, subscribeToAllWorkspaces, sendBroadcast } from '../../lib/supabase'
import { BRANDS, BLOCK_STRUCTURE, ACTIVITY_LABELS, ACTIVITY_DISPLAY_NUM } from '../../data/workshop'
import { ProgressBar } from '../ui/shared'
import type { Brand, ActivityKey } from '../../types'

interface TeamRow {
  id: string; brand: Brand; name: string; score: number
  completed: number; pct: number; currentBlock: number; lastUpdated: string | null
}

const BROADCAST_PRESETS = [
  { label: 'Move to next block', text: '➡️ Please move to the next block when ready', type: 'info' as const },
  { label: '5 minutes remaining', text: '⏱️ 5 minutes remaining on this activity', type: 'warning' as const },
  { label: 'Pause activity', text: '⏸️ Please pause — facilitator note incoming', type: 'warning' as const },
  { label: 'Discussion starting', text: '💬 Group discussion starting — look up!', type: 'success' as const },
  { label: 'Final challenge open', text: '🏆 Social Masters Challenge is now open!', type: 'success' as const },
]

function computeRow(raw: { id: string; brand: Brand; name: string; workspace?: { scores?: Record<string, { points: number; completed: boolean }>; updated_at?: string } | null }): TeamRow {
  const ws = raw.workspace
  const sc = ws?.scores || {}
  const score = Object.values(sc).reduce((s, v) => s + (v?.points || 0), 0)
  const completed = Object.values(sc).filter(v => v?.completed).length
  const pct = Math.round((completed / 22) * 100)
  let currentBlock = 1
  for (let i = BLOCK_STRUCTURE.length - 1; i >= 0; i--) {
    if (BLOCK_STRUCTURE[i].activities.some(a => sc[a]?.completed)) { currentBlock = BLOCK_STRUCTURE[i].id; break }
  }
  return { id: raw.id, brand: raw.brand, name: raw.name || String(raw.brand), score, completed, pct, currentBlock, lastUpdated: ws?.updated_at || null }
}

export function FacilitatorDashboard() {
  const [rows, setRows] = useState<TeamRow[]>(
    BRANDS.map(b => ({ id: '', brand: b, name: String(b), score: 0, completed: 0, pct: 0, currentBlock: 1, lastUpdated: null }))
  )
  const [lastRefresh, setLastRefresh] = useState(new Date())
  const [broadcastText, setBroadcastText] = useState('')
  const [broadcastType, setBroadcastType] = useState<'info' | 'warning' | 'success'>('info')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [expandedTeam, setExpandedTeam] = useState<string | null>(null)

  const refresh = async () => {
    const data = await getAllTeamsData()
    const updated = BRANDS.map(brand => {
      const raw = (data || []).find((r: unknown) => (r as { brand: string }).brand === brand) as Parameters<typeof computeRow>[0] | undefined
      if (!raw) return { id: '', brand, name: String(brand), score: 0, completed: 0, pct: 0, currentBlock: 1, lastUpdated: null }
      return computeRow(raw)
    })
    setRows(updated as TeamRow[])
    setLastRefresh(new Date())
  }

  useEffect(() => {
    refresh()
    const unsub = subscribeToAllWorkspaces(() => refresh())
    const interval = setInterval(refresh, 30000)
    return () => { unsub(); clearInterval(interval) }
  }, [])

  const handleBroadcast = async () => {
    if (!broadcastText.trim()) return
    setSending(true)
    await sendBroadcast(broadcastText, broadcastType)
    setSending(false); setSent(true)
    setBroadcastText('')
    setTimeout(() => setSent(false), 3000)
  }

  const sorted = [...rows].sort((a, b) => b.score - a.score)

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-[10px] font-bold tracking-widest uppercase text-brand-500 mb-1">BM7621 · Facilitator View</div>
            <h1 className="text-3xl font-bold text-slate-900">Workshop Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">Last refresh: {lastRefresh.toLocaleTimeString()}</span>
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <button onClick={refresh} className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-100">Refresh</button>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Teams Active', value: rows.filter(r => r.completed > 0).length, color: 'text-brand-600' },
            { label: 'Avg Completion', value: `${Math.round(rows.reduce((s, r) => s + r.pct, 0) / rows.length)}%`, color: 'text-slate-900' },
            { label: 'Leading Score', value: sorted[0]?.score || 0, color: 'text-emerald-600' },
            { label: 'Avg Score', value: Math.round(rows.reduce((s, r) => s + r.score, 0) / rows.length), color: 'text-slate-600' },
          ].map(card => (
            <div key={card.label} className="bg-white border border-slate-200 rounded-2xl p-5 text-center shadow-sm">
              <div className={`text-3xl font-bold ${card.color}`}>{card.value}</div>
              <div className="text-xs text-slate-400 uppercase tracking-wider mt-1">{card.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Team table */}
          <div className="col-span-2">
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm mb-6">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Team Progress</div>
                <div className="text-xs text-slate-400">Real-time · auto-updates</div>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    {['Rank', 'Team', 'Block', 'Progress', 'Score', 'Last Active'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((row, i) => (
                    <tr key={row.brand} className="border-b border-slate-50 hover:bg-slate-50 cursor-pointer"
                      onClick={() => setExpandedTeam(expandedTeam === row.brand ? null : row.brand)}>
                      <td className="px-4 py-3 text-sm font-bold text-slate-500">#{i + 1}</td>
                      <td className="px-4 py-3">
                        <div className="text-sm font-semibold text-slate-800">{row.name}</div>
                        <div className="text-[10px] text-slate-400">{row.brand}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-100 text-brand-700">Block {row.currentBlock}</span>
                      </td>
                      <td className="px-4 py-3 min-w-32">
                        <div className="flex items-center gap-2">
                          <ProgressBar value={row.pct} className="flex-1" />
                          <span className="text-xs text-slate-500">{row.pct}%</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{row.completed}/22</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-lg font-bold text-slate-900">{row.score}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-400">
                        {row.lastUpdated ? new Date(row.lastUpdated).toLocaleTimeString() : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Activity unlock panel */}
            {expandedTeam && (() => {
              const row = rows.find(r => r.brand === expandedTeam)
              if (!row) return null
              return (
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                    Unlock Activities — {row.name}
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {BLOCK_STRUCTURE.flatMap(block =>
                      block.activities.map(actKey => (
                        <div key={actKey} className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-lg text-xs">
                          <span className="text-slate-600 truncate mr-2">A{ACTIVITY_DISPLAY_NUM[actKey as ActivityKey]} {ACTIVITY_LABELS[actKey as ActivityKey]}</span>
                          <button
                            onClick={async () => {
                              // Update Supabase to unlock this activity for this team
                              alert(`Unlock ${ACTIVITY_LABELS[actKey as ActivityKey]} for ${row.name} — connect to Supabase unlock endpoint`)
                            }}
                            className="text-[10px] px-2 py-0.5 bg-amber-100 text-amber-700 rounded hover:bg-amber-200 flex-shrink-0">
                            Unlock
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )
            })()}
          </div>

          {/* Broadcast panel */}
          <div>
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">📢 Broadcast to All Students</div>

              {/* Presets */}
              <div className="space-y-2 mb-4">
                {BROADCAST_PRESETS.map(preset => (
                  <button key={preset.label} onClick={() => { setBroadcastText(preset.text); setBroadcastType(preset.type) }}
                    className="w-full text-left px-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-600 hover:border-brand-300 hover:bg-brand-50 transition-all">
                    {preset.label}
                  </button>
                ))}
              </div>

              {/* Custom message */}
              <div className="mb-3">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Custom Message</div>
                <textarea
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-brand-400 resize-none"
                  rows={3}
                  placeholder="Type a message to send to all teams..."
                  value={broadcastText}
                  onChange={e => setBroadcastText(e.target.value)}
                />
              </div>

              {/* Type selector */}
              <div className="flex gap-2 mb-3">
                {(['info', 'warning', 'success'] as const).map(t => (
                  <button key={t} onClick={() => setBroadcastType(t)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border-2 transition-all ${broadcastType === t ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-200 text-slate-600'}`}>
                    {t === 'info' ? '💬' : t === 'warning' ? '⚠️' : '✅'} {t}
                  </button>
                ))}
              </div>

              <button onClick={handleBroadcast} disabled={!broadcastText.trim() || sending}
                className="w-full bg-brand-600 text-white font-bold py-2.5 rounded-xl text-sm hover:bg-brand-700 disabled:opacity-50 transition-colors">
                {sending ? 'Sending…' : sent ? '✓ Sent!' : 'Send to All Teams'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
