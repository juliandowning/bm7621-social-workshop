import { useEffect, useState } from 'react'
import { getAllTeamsData, subscribeToAllWorkspaces, sendBroadcast } from '../../lib/supabase'
import { BLOCK_STRUCTURE, ACTIVITY_LABELS } from '../../data/workshop'
import { ProgressBar } from '../ui/shared'
import type { ActivityKey } from '../../types'

const TEAM_CODES = ['SOCIAL01', 'SOCIAL02', 'SOCIAL03', 'SOCIAL04', 'SOCIAL05']
const TOTAL_ACTS = 24

interface TeamRow {
  id: string; code: string; name: string; score: number
  completed: number; pct: number; currentBlock: number; lastUpdated: string | null
  scores: Record<string, { points?: number; completed?: boolean }>
}

const BROADCAST_PRESETS = [
  { label: 'Move to next block', text: '➡️ Please move to the next block when ready', type: 'info' as const },
  { label: '5 minutes remaining', text: '⏱️ 5 minutes remaining on this activity', type: 'warning' as const },
  { label: 'Pause activity', text: '⏸️ Please pause — facilitator note incoming', type: 'warning' as const },
  { label: 'Discussion starting', text: '💬 Group discussion starting — look up!', type: 'success' as const },
  { label: 'Agency Pitch open', text: '🏆 Agency Pitch is now open — download your pitch!', type: 'success' as const },
]

function computeRow(raw: { id: string; code: string; name: string; workspace?: { scores?: Record<string, { points: number; completed: boolean }>; updated_at?: string } | null }): TeamRow {
  const ws = raw.workspace
  const sc = ws?.scores || {}
  const score = Object.values(sc).reduce((s, v) => s + (v?.points || 0), 0)
  const completed = Object.values(sc).filter(v => v?.completed).length
  const pct = Math.round((completed / TOTAL_ACTS) * 100)
  let currentBlock = 1
  for (let i = BLOCK_STRUCTURE.length - 1; i >= 0; i--) {
    if (BLOCK_STRUCTURE[i].activities.some(a => sc[a]?.completed)) { currentBlock = BLOCK_STRUCTURE[i].id; break }
  }
  return { id: raw.id, code: raw.code, name: raw.name || raw.code, score, completed, pct, currentBlock, lastUpdated: ws?.updated_at || null, scores: sc }
}

export function FacilitatorDashboard() {
  const [rows, setRows] = useState<TeamRow[]>(
    TEAM_CODES.map(code => ({ id: '', code, name: code, score: 0, completed: 0, pct: 0, currentBlock: 1, lastUpdated: null, scores: {} }))
  )
  const [lastRefresh, setLastRefresh] = useState(new Date())
  const [broadcastText, setBroadcastText] = useState('')
  const [broadcastType, setBroadcastType] = useState<'info' | 'warning' | 'success'>('info')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [expandedTeam, setExpandedTeam] = useState<string | null>(null)

  const refresh = async () => {
    const data = await getAllTeamsData()
    const updated = TEAM_CODES.map(code => {
      const raw = (data || []).find((r: unknown) => (r as { code: string }).code === code) as Parameters<typeof computeRow>[0] | undefined
      if (!raw) return { id: '', code, name: code, score: 0, completed: 0, pct: 0, currentBlock: 1, lastUpdated: null, scores: {} }
      return computeRow(raw)
    })
    setRows(updated)
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
    await sendBroadcast(broadcastText.trim(), broadcastType)
    setSending(false); setSent(true)
    setBroadcastText('')
    setTimeout(() => setSent(false), 3000)
  }

  const sorted = [...rows].sort((a, b) => b.score - a.score)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-5">
        <div className="text-[10px] font-bold tracking-widest uppercase text-slate-400 mb-1">Facilitator Dashboard</div>
        <div className="text-lg font-bold">Nike Social Media Workshop</div>
        <div className="text-sm text-slate-400 mt-1">
          Last refreshed: {lastRefresh.toLocaleTimeString()} ·
          <button onClick={refresh} className="ml-2 text-brand-400 hover:text-brand-300 underline text-xs">Refresh now</button>
        </div>
      </div>

      {/* Team overview */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              {['Agency', 'Score', 'Progress', 'Block', 'Last Active'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-400">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((row, i) => (
              <>
                <tr key={row.code}
                  className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer"
                  onClick={() => setExpandedTeam(expandedTeam === row.code ? null : row.code)}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 text-xs font-bold w-5">{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}</span>
                      <div>
                        <div className="font-semibold text-slate-800 text-sm">{row.name}</div>
                        <div className="text-[10px] text-slate-400">{row.code}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-bold text-slate-800">{row.score}</td>
                  <td className="px-4 py-3">
                    <ProgressBar value={row.completed} max={TOTAL_ACTS} />
                    <div className="text-[10px] text-slate-400 mt-1">{row.completed}/{TOTAL_ACTS} · {row.pct}%</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">Block {row.currentBlock}</td>
                  <td className="px-4 py-3 text-xs text-slate-400">
                    {row.lastUpdated ? new Date(row.lastUpdated).toLocaleTimeString() : 'Not started'}
                  </td>
                </tr>
                {expandedTeam === row.code && (
                  <tr key={`${row.code}-detail`} className="bg-slate-50 border-b border-slate-200">
                    <td colSpan={5} className="px-4 py-4">
                      <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                        {BLOCK_STRUCTURE.map(block => (
                          <div key={block.id}>
                            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">B{block.id}</div>
                            {block.activities.map(act => {
                              const s = row.scores[act]
                              return (
                                <div key={act} className={`text-[10px] px-2 py-1 rounded mb-0.5 flex justify-between ${s?.completed ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
                                  <span className="truncate">{ACTIVITY_LABELS[act as ActivityKey]?.split(' ').slice(0, 2).join(' ')}</span>
                                  <span className="font-bold ml-1 flex-shrink-0">{s?.points ?? '—'}</span>
                                </div>
                              )
                            })}
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>

      {/* Broadcast */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <div className="font-bold text-slate-900 mb-3">📢 Broadcast Message</div>
        <div className="flex flex-wrap gap-2 mb-3">
          {BROADCAST_PRESETS.map(p => (
            <button key={p.label} onClick={() => { setBroadcastText(p.text); setBroadcastType(p.type) }}
              className="text-xs px-3 py-1.5 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors">
              {p.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2 mb-2">
          {(['info', 'warning', 'success'] as const).map(t => (
            <button key={t} onClick={() => setBroadcastType(t)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold border-2 transition-all ${broadcastType === t ? (t === 'info' ? 'border-blue-500 bg-blue-50 text-blue-700' : t === 'warning' ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-emerald-500 bg-emerald-50 text-emerald-700') : 'border-slate-200 text-slate-500'}`}>
              {t}
            </button>
          ))}
        </div>
        <textarea value={broadcastText} onChange={e => setBroadcastText(e.target.value)}
          placeholder="Type a message to all teams…"
          rows={2} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-brand-400 resize-none mb-2" />
        <button onClick={handleBroadcast} disabled={!broadcastText.trim() || sending}
          className="bg-slate-900 text-white font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-slate-700 transition-colors disabled:opacity-50">
          {sending ? 'Sending…' : sent ? '✓ Sent!' : 'Send to All Teams'}
        </button>
      </div>
    </div>
  )
}
