import { useEffect, useState, useCallback } from 'react'
import { useWorkspaceStore, selectTotalScore, selectAvgQuality } from '../../store/workspace'
import { subscribeToAllWorkspaces, getAllTeamsData } from '../../lib/supabase'

const TOTAL_ACTS = 24
const TEAM_CODES = ['SOCIAL01', 'SOCIAL02', 'SOCIAL03', 'SOCIAL04', 'SOCIAL05']

interface LeaderboardEntry {
  code: string; name: string; score: number
  completed: number; completionPct: number; avgQuality: number; isMine: boolean
}

export function LeaderboardPanel() {
  const { team, scores } = useWorkspaceStore()
  const myScore = selectTotalScore(scores)
  const myCompleted = Object.values(scores).filter(s => s?.completed).length
  const myQuality = selectAvgQuality(scores)

  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  const buildEntries = useCallback((data: unknown[]) => {
    return TEAM_CODES.map(code => {
      if (code === team?.code) {
        return { code, name: team?.name || code, score: myScore, completed: myCompleted, completionPct: Math.round(myCompleted / TOTAL_ACTS * 100), avgQuality: myQuality, isMine: true }
      }
      const row = (data || []).find((r: unknown) => (r as { code: string }).code === code) as { name?: string; code: string; workspace?: { scores?: Record<string, unknown> } } | undefined
      if (!row) return { code, name: code, score: 0, completed: 0, completionPct: 0, avgQuality: 0, isMine: false }
      const sc = (row.workspace?.scores || {}) as Record<string, { points?: number; completed?: boolean }>
      const score = Object.values(sc).reduce((s, v) => s + (v?.points || 0), 0)
      const completed = Object.values(sc).filter(v => v?.completed).length
      const withQ = Object.values(sc).filter(v => v?.completed && (v?.points || 0) > 0)
      const avgQuality = withQ.length ? Math.round(withQ.reduce((s, v) => s + (v?.points || 0), 0) / withQ.length * 10) / 10 : 0
      return { code, name: row.name || code, score, completed, completionPct: Math.round(completed / TOTAL_ACTS * 100), avgQuality, isMine: false }
    })
  }, [team, myScore, myCompleted, myQuality])

  const loadAll = useCallback(async () => {
    const data = await getAllTeamsData()
    setEntries(buildEntries(data as unknown[]))
    setLoading(false)
  }, [buildEntries])

  useEffect(() => {
    loadAll()
    const unsub = subscribeToAllWorkspaces(() => loadAll())
    return () => { unsub() }
  }, [loadAll])

  const sorted = [...entries].sort((a, b) => b.score - a.score || b.completed - a.completed)
  const getRankIcon = (i: number) => i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`

  if (loading) return <div className="text-center py-12 text-slate-400">Loading leaderboard…</div>

  return (
    <div>
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              {['Rank', 'Agency', 'Score', 'Activities', 'Avg Quality'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-400">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((entry, i) => (
              <tr key={entry.code} className={`border-b border-slate-100 ${entry.isMine ? 'bg-brand-50' : 'hover:bg-slate-50'}`}>
                <td className="px-4 py-4 text-sm font-bold text-slate-500">{getRankIcon(i)}</td>
                <td className="px-4 py-4">
                  <span className={`text-sm font-semibold ${entry.isMine ? 'text-brand-700' : 'text-slate-700'}`}>
                    {entry.name} {entry.isMine && <span className="text-[10px] text-brand-400">(you)</span>}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className={`text-base font-bold tabular-nums ${entry.isMine ? 'text-emerald-600' : 'text-slate-700'}`}>{entry.score}</span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-brand-500 rounded-full" style={{ width: `${entry.completionPct}%` }} />
                    </div>
                    <span className="text-xs text-slate-500">{entry.completed}/{TOTAL_ACTS}</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className={`text-sm font-bold ${entry.avgQuality >= 3 ? 'text-emerald-600' : entry.avgQuality >= 2 ? 'text-amber-600' : 'text-slate-400'}`}>
                    {entry.avgQuality > 0 ? `${entry.avgQuality}/5` : '—'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-slate-400 text-center">Updates automatically · Quality scores 0–5 per activity</div>
    </div>
  )
}
