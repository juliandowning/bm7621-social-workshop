import { useState } from 'react'
import { getTeamByCode, getWorkspaceData, updateTeamMembers } from '../../lib/supabase'
import { useWorkspaceStore } from '../../store/workspace'
import { WORKSHOP_CODES } from '../../data/workshop'
import type { Team, ScoreMap, ResponseMap, TeamMember } from '../../types'

const DEMO_TEAMS: Team[] = Object.entries(WORKSHOP_CODES).map(([code, info], i) => ({
  id: `demo-${i}`,
  code,
  name: info.name,
  brand: info.brand,
  members: [],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}))

interface SetupScreenProps {
  onComplete: (resumeBlock?: number) => void
  onFacilitator: () => void
}

export function SetupScreen({ onComplete, onFacilitator }: SetupScreenProps) {
  const { setTeam, updateScore, updateResponse } = useWorkspaceStore()
  const [code, setCode] = useState('')
  const [name, setName] = useState('')
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)
  const [step, setStep] = useState<'code' | 'join'>('code')
  const [joinMode, setJoinMode] = useState<'member' | 'viewer'>('member')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleCode = async () => {
    const trimmed = code.toUpperCase().trim()
    if (!trimmed) { setError('Please enter your access code.'); return }
    if (trimmed === 'FACILITATOR') { onFacilitator(); return }

    setLoading(true); setError('')
    try {
      let team: Team | null = null
      let existingWorkspace: Record<string, unknown> | null = null

      team = await getTeamByCode(trimmed) as Team | null
      if (team) existingWorkspace = await getWorkspaceData(team.id) as Record<string, unknown> | null

      if (!team) {
        const demo = DEMO_TEAMS.find(t => t.code === trimmed)
        if (demo) team = demo
      }

      if (!team) { setError('Access code not recognised. Check with your facilitator.'); setLoading(false); return }

      // Returning member — restore and go in
      if (team.members && team.members.length > 0 && !team.id.startsWith('demo-')) {
        if (existingWorkspace) {
          const ws = existingWorkspace as { scores?: ScoreMap; responses?: ResponseMap }
          if (ws.scores) Object.entries(ws.scores).forEach(([key, val]) => {
            if (val) updateScore(key as Parameters<typeof updateScore>[0], val.points, val.max, val.completionPts, val.qualityPts)
          })
          if (ws.responses) updateResponse(ws.responses as ResponseMap)
        }
        setTeam(team)
        onComplete(1)
        return
      }

      setSelectedTeam(team)
      setStep('join')
    } catch { setError('Connection error. Please try again.') }
    setLoading(false)
  }

  const handleJoin = async () => {
    if (!selectedTeam) return
    const isViewer = joinMode === 'viewer'
    const memberName = name.trim()

    const teamMembers: TeamMember[] = isViewer
      ? selectedTeam.members || []
      : [...(selectedTeam.members || []), { name: memberName || 'Student', order: (selectedTeam.members?.length || 0) + 1, role: 'member' as const }]

    const updatedTeam: Team = { ...selectedTeam, members: teamMembers }
    setTeam(updatedTeam, isViewer)

    if (!isViewer && !selectedTeam.id.startsWith('demo-')) {
      await updateTeamMembers(selectedTeam.id, teamMembers)
    }

    onComplete(1)
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center px-5 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-[10px] font-bold tracking-widest uppercase text-slate-500 mb-3">CIM Level 4 · Digital Marketing</div>
          <h1 className="text-white text-3xl font-bold mb-2">BM7621 Social Media Workshop</h1>
          <p className="text-slate-400 text-sm">Social Media Marketing · 6-Hour Workshop</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {step === 'code' ? (
            <div className="p-8">
              <h2 className="text-lg font-bold text-slate-900 mb-1">Enter Access Code</h2>
              <p className="text-sm text-slate-500 mb-6">Your facilitator will give you a team code.</p>
              <input
                type="text"
                className="w-full border border-slate-200 rounded-xl px-4 py-4 text-center text-2xl font-mono font-bold uppercase tracking-widest outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 mb-4"
                placeholder="SOCIAL01"
                value={code}
                onChange={e => setCode(e.target.value.toUpperCase())}
                onKeyDown={e => e.key === 'Enter' && handleCode()}
                maxLength={10}
                autoFocus
              />
              {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-4">{error}</div>}
              <button className="w-full bg-brand-600 text-white font-bold py-3 rounded-xl hover:bg-brand-700 transition-colors disabled:opacity-50"
                onClick={handleCode} disabled={loading}>
                {loading ? 'Checking…' : 'Continue →'}
              </button>
            </div>
          ) : (
            <div className="p-8">
              <div className="flex items-center gap-2 mb-5">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-brand-100 text-brand-700">{selectedTeam?.brand}</span>
                <span className="font-semibold text-slate-700 text-sm">{selectedTeam?.name}</span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 mb-1">How are you joining?</h2>
              <p className="text-sm text-slate-500 mb-5">Join as a member to submit answers, or as a viewer to follow along on your own device.</p>

              {/* Join mode toggle */}
              <div className="flex gap-2 mb-5">
                {(['member', 'viewer'] as const).map(mode => (
                  <button key={mode} onClick={() => setJoinMode(mode)}
                    className={`flex-1 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all ${joinMode === mode ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-200 text-slate-600'}`}>
                    {mode === 'member' ? '✏️ Join as Member' : '👁 Join as Viewer'}
                  </button>
                ))}
              </div>

              {joinMode === 'viewer' && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-700 mb-4">
                  Viewer mode — you can follow your team's progress but cannot submit answers.
                </div>
              )}

              {joinMode === 'member' && (
                <div className="mb-5">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Your Name</label>
                  <input className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                    placeholder="Enter your name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                </div>
              )}

              {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-4">{error}</div>}

              <div className="flex gap-3">
                <button className="flex-1 bg-brand-600 text-white font-bold py-3 rounded-xl hover:bg-brand-700 transition-colors"
                  onClick={handleJoin}>
                  {joinMode === 'member' ? 'Join Workshop →' : 'View Workshop →'}
                </button>
                <button className="px-4 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 text-sm"
                  onClick={() => { setStep('code'); setError('') }}>← Back</button>
              </div>
            </div>
          )}
        </div>
        <p className="text-center text-xs text-slate-600 mt-5">Kingston Business School · BM7621</p>
      </div>
    </div>
  )
}
