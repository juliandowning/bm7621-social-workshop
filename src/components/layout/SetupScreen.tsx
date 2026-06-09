import { useState } from 'react'
import { getTeamByCode, getWorkspaceData, updateTeamMembers } from '../../lib/supabase'
import { useWorkspaceStore } from '../../store/workspace'
import { WORKSHOP_CODES } from '../../data/workshop'
import type { Team, ScoreMap, ResponseMap } from '../../types'

interface SetupScreenProps {
  onComplete: (resumeBlock?: number) => void
  onFacilitator: () => void
}

export function SetupScreen({ onComplete, onFacilitator }: SetupScreenProps) {
  const { setTeam, updateScore, updateResponse } = useWorkspaceStore()
  const [code, setCode] = useState('')
  const [agencyName, setAgencyName] = useState('')
  const [memberName, setMemberName] = useState('')
  const [joinMode, setJoinMode] = useState<'member' | 'viewer'>('member')
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)
  const [step, setStep] = useState<'code' | 'join'>('code')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleCode = async () => {
    const trimmed = code.toUpperCase().trim()
    if (!trimmed) { setError('Please enter your access code.'); return }
    if (trimmed === 'FACILITATOR') { onFacilitator(); return }
    if (!WORKSHOP_CODES[trimmed] && trimmed !== 'FACILITATOR') {
      setError('Access code not recognised. Check with your facilitator.')
      return
    }

    setLoading(true); setError('')
    try {
      let team: Team | null = null
      let existingWorkspace: Record<string, unknown> | null = null

      team = await getTeamByCode(trimmed) as Team | null
      if (team) existingWorkspace = await getWorkspaceData(team.id) as Record<string, unknown> | null

      // Demo fallback
      if (!team) {
        const info = WORKSHOP_CODES[trimmed]
        if (info) {
          team = {
            id: `demo-${trimmed}`, code: trimmed, name: info.name, brand: 'Nike',
            members: [], created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
          }
        }
      }

      if (!team) { setError('Access code not recognised.'); setLoading(false); return }

      // Returning team — has members saved. Go to join screen (pre-fill name for restore)
      if (team.members && team.members.length > 0 && !team.id.startsWith('demo-')) {
        setSelectedTeam(team)
        setAgencyName(team.name && !team.name.startsWith('Agency ') ? team.name : '')
        setStep('join')
        setLoading(false)
        return
      }

      setSelectedTeam(team)
      // Pre-fill agency name if exists
      if (team.name && !team.name.startsWith('Agency ')) setAgencyName(team.name)
      setStep('join')
    } catch { setError('Connection error. Please try again.') }
    setLoading(false)
  }

  const getLastBlock = (ws: { scores?: ScoreMap } | null): number => {
    if (!ws?.scores) return 1
    const BLOCK_KEYS = [
      ['b1a1','b1a2','b1a3'],
      ['b2a1','b2a2','b2a3','b2a4','b2a5'],
      ['b3a1','b3a2','b3a3'],
      ['b4a1','b4a2','b4a3','b4a4'],
      ['b5a1','b5a2','b5a3'],
      ['b6a1','b6a2','b6a3'],
      ['b7a1','b7a2','b7a3'],
    ]
    for (let i = BLOCK_KEYS.length - 1; i >= 0; i--) {
      if (BLOCK_KEYS[i].some(k => ws.scores?.[k as keyof typeof ws.scores]?.completed)) return i + 1
    }
    return 1
  }

  const handleJoin = async () => {
    if (!selectedTeam) return
    const isViewer = joinMode === 'viewer'
    const finalAgencyName = agencyName.trim() || selectedTeam.name
    const member = memberName.trim() || 'Team Member'

    // Check if returning member by name — restore their session
    const existingMember = !isViewer && selectedTeam.members?.find(
      m => m.name.toLowerCase() === member.toLowerCase()
    )

    let existingWorkspace: Record<string, unknown> | null = null
    if ((existingMember || isViewer) && !selectedTeam.id.startsWith('demo-')) {
      existingWorkspace = await getWorkspaceData(selectedTeam.id) as Record<string, unknown> | null
    }

    const teamMembers = isViewer ? (selectedTeam.members || []) : existingMember
      ? (selectedTeam.members || []) // don't duplicate
      : [...(selectedTeam.members || []), { name: member, order: (selectedTeam.members?.length || 0) + 1, role: 'member' as const }]

    const updatedTeam: Team = { ...selectedTeam, name: finalAgencyName, members: teamMembers }
    setTeam(updatedTeam, isViewer)

    // Restore workspace if returning
    if (existingWorkspace) {
      const ws = existingWorkspace as { scores?: ScoreMap; responses?: ResponseMap }
      if (ws.scores) Object.entries(ws.scores).forEach(([key, val]) => {
        if (val) updateScore(key as Parameters<typeof updateScore>[0], val.points, val.max)
      })
      if (ws.responses) updateResponse(ws.responses as ResponseMap)
    }

    if (!isViewer && !existingMember && !selectedTeam.id.startsWith('demo-')) {
      await updateTeamMembers(selectedTeam.id, teamMembers)
    }

    const lastBlock = getLastBlock(existingWorkspace as { scores?: ScoreMap } | null)
    onComplete(existingMember ? lastBlock : 1)
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center px-5 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-xs font-bold tracking-widest uppercase text-slate-500 mb-3">CIM Level 4 · Digital Marketing</div>
          <h1 className="text-white text-3xl font-bold mb-2">Social Media Workshop</h1>
          <p className="text-slate-400 text-sm">BM7621 · Nike Agency Pitch</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {step === 'code' ? (
            <div className="p-8">
              <h2 className="text-lg font-bold text-slate-900 mb-1">Enter Access Code</h2>
              <p className="text-sm text-slate-500 mb-6">Your facilitator will give you your team code.</p>
              <input
                type="text"
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-4 text-center text-2xl font-mono font-bold uppercase tracking-widest outline-none focus:border-brand-400 mb-4 transition-colors"
                placeholder="SOCIAL01"
                value={code}
                onChange={e => setCode(e.target.value.toUpperCase())}
                onKeyDown={e => e.key === 'Enter' && handleCode()}
                maxLength={10}
                autoFocus
              />
              {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-4">{error}</div>}
              <button
                className="w-full bg-brand-600 text-white font-bold py-3.5 rounded-xl hover:bg-brand-700 transition-colors disabled:opacity-50 text-base"
                onClick={handleCode} disabled={loading}
              >
                {loading ? 'Checking…' : 'Enter Workshop →'}
              </button>
            </div>
          ) : (
            <div className="p-8">
              {/* Nike brief badge */}
              <div className="bg-slate-900 rounded-xl p-4 mb-6 text-center">
                <div className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-1">Your Brief</div>
                <div className="text-white font-bold text-lg">Nike Social Media Account</div>
                <div className="text-slate-300 text-sm mt-1">5 agencies. 1 client. Best pitch wins.</div>
              </div>

              {/* Agency name */}
              <div className="mb-4">
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Your Agency Name</label>
                <input
                  className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 font-semibold outline-none focus:border-brand-400 transition-colors"
                  placeholder="e.g. Spark Social, Bold Agency…"
                  value={agencyName}
                  onChange={e => setAgencyName(e.target.value)}
                />
              </div>

              {/* Join mode */}
              <div className="mb-4">
                <label className="block text-sm font-bold text-slate-700 mb-1.5">How are you joining?</label>
                <div className="flex gap-2">
                  {(['member', 'viewer'] as const).map(mode => (
                    <button key={mode} onClick={() => setJoinMode(mode)}
                      className={`flex-1 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all ${joinMode === mode ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}>
                      {mode === 'member' ? '✏️ Team Member' : '👁 Viewer'}
                    </button>
                  ))}
                </div>
                {joinMode === 'viewer' && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 mt-2 text-xs text-amber-700">
                    Viewer mode — you can follow your team's progress but cannot submit answers.
                  </div>
                )}
              </div>

              {/* Member name */}
              {joinMode === 'member' && (
                <div className="mb-5">
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Your Name</label>
                  <input
                    className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-brand-400 transition-colors"
                    placeholder="Enter your name"
                    value={memberName}
                    onChange={e => setMemberName(e.target.value)}
                  />
                </div>
              )}

              {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-4">{error}</div>}

              <div className="flex gap-3">
                <button
                  className="flex-1 bg-brand-600 text-white font-bold py-3.5 rounded-xl hover:bg-brand-700 transition-colors text-base"
                  onClick={handleJoin}
                  disabled={!agencyName.trim()}
                >
                  {joinMode === 'member' ? 'Start Pitch →' : 'View Workshop →'}
                </button>
                <button className="px-4 border-2 border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 text-sm font-medium"
                  onClick={() => { setStep('code'); setError('') }}>← Back</button>
              </div>
              {!agencyName.trim() && <div className="text-xs text-amber-600 mt-2 text-center">Enter your agency name to continue</div>}
            </div>
          )}
        </div>
        <p className="text-center text-xs text-slate-600 mt-5">Kingston Business School · BM7621</p>
      </div>
    </div>
  )
}
