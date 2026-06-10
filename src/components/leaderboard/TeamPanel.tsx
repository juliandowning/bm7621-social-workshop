import { useEffect, useState } from 'react'
import { getAllTeamsData } from '../../lib/supabase'

const TEAM_CODES = ['SOCIAL01','SOCIAL02','SOCIAL03','SOCIAL04','SOCIAL05']

interface TeamInfo {
  code: string
  name: string
  captain: string
  members: { name: string; role: string }[]
}

export function TeamPanel() {
  const [teams, setTeams] = useState<TeamInfo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAllTeamsData().then(data => {
      const rows = (data || []) as unknown as { code: string; name: string; members?: { name: string; role: string; order: number }[] }[]
      const built = TEAM_CODES.map(code => {
        const row = rows.find(r => r.code === code)
        const members = row?.members || []
        const captain = members.find((m, i) => i === 0)?.name || '—'
        return {
          code,
          name: row?.name || code,
          captain,
          members,
        }
      })
      setTeams(built)
      setLoading(false)
    })
  }, [])

  if (loading) return <div className="text-center py-6 text-slate-400 text-sm">Loading teams…</div>

  return (
    <div className="mb-6">
      <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3">Teams</h2>
      <div className="grid grid-cols-1 gap-3">
        {teams.map(team => (
          <div key={team.code} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-bold text-slate-900 text-sm">{team.name}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{team.code}</div>
              </div>
              {team.members.length > 0 && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 flex-shrink-0">
                  {team.members.length} member{team.members.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>
            {team.members.length > 0 ? (
              <div className="mt-3 space-y-1.5">
                {team.members.map((m, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${i === 0 ? 'bg-brand-500' : 'bg-slate-300'}`} />
                    <span className="text-slate-700 font-medium">{m.name}</span>
                    {i === 0 && <span className="text-[10px] text-brand-600 font-semibold">Team Captain</span>}
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-2 text-xs text-slate-400 italic">Not yet registered</div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
