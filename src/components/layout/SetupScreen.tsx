import { useState } from 'react'
import { getTeamByCode, getWorkspaceData, updateTeamMembers } from '../../lib/supabase'
import { useWorkspaceStore } from '../../store/workspace'
import { WORKSHOP_CODES } from '../../data/workshop'
import type { Team, ScoreMap, ResponseMap, TeamMember } from '../../types'

interface SetupScreenProps {
  onComplete: (resumeBlock?: number) => void
  onFacilitator: () => void
}

type JoinStep = 'code' | 'returning_or_new' | 'choose_role' | 'first_setup'

export function SetupScreen({ onComplete, onFacilitator }: SetupScreenProps) {
  const { setTeam, updateScore, updateResponse } = useWorkspaceStore()
  const [code, setCode] = useState('')
  const [step, setStep] = useState<JoinStep>('code')
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)
  const [existingWorkspace, setExistingWorkspace] = useState<{ scores?: ScoreMap; responses?: ResponseMap } | null>(null)
  const [agencyName, setAgencyName] = useState('')
  const [memberName, setMemberName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const getLastBlock = (ws: { scores?: ScoreMap } | null): number => {
    if (!ws?.scores) return 1
    const BLOCK_KEYS = [
      ['b1a1','b1a2','b1a3'],
      ['b2a1','b2a2','b2a3','b2a4','b2a5'],
      ['b3a1','b3a2'],
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

  const restoreWorkspace = (ws: { scores?: ScoreMap; responses?: ResponseMap } | null) => {
    if (!ws) return
    if (ws.scores) Object.entries(ws.scores).forEach(([key, val]) => {
      if (val) updateScore(key as Parameters<typeof updateScore>[0], val.points, val.max)
    })
    if (ws.responses) updateResponse(ws.responses as ResponseMap)
  }

  const handleCode = async () => {
    const trimmed = code.toUpperCase().trim()
    if (!trimmed) { setError('Please enter your access code.'); return }
    if (trimmed === 'FACILITATOR') { onFacilitator(); return }
    if (!WORKSHOP_CODES[trimmed]) { setError('Access code not recognised. Check with your facilitator.'); return }

    setLoading(true); setError('')
    try {
      const team = await getTeamByCode(trimmed) as Team | null
      const ws = team ? await getWorkspaceData(team.id) as { scores?: ScoreMap; responses?: ResponseMap } | null : null

      if (!team || team.id.startsWith('demo-')) {
        // Demo fallback — go straight to first setup
        const demoTeam: Team = {
          id: `demo-${trimmed}`, code: trimmed, name: WORKSHOP_CODES[trimmed].name,
          brand: 'Nike', members: [], created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
        }
        setSelectedTeam(demoTeam)
        setAgencyName('')
        setStep('first_setup')
        setLoading(false)
        return
      }

      setSelectedTeam(team)
      setExistingWorkspace(ws)

      if (team.members && team.members.length > 0) {
        // Team already set up — pre-fill agency name locked
        setAgencyName(team.name)
        setStep('returning_or_new')
      } else {
        // First person — full setup
        setAgencyName('')
        setStep('first_setup')
      }
    } catch { setError('Connection error. Please try again.') }
    setLoading(false)
  }

  const handleReturning = async () => {
    if (!selectedTeam || !memberName.trim()) return
    const name = memberName.trim()
    const existing = selectedTeam.members?.find(m => m.name.toLowerCase() === name.toLowerCase())

    if (existing) {
      // Returning member — restore with original role
      setTeam({ ...selectedTeam }, existing.role === 'viewer')
      restoreWorkspace(existingWorkspace)
      onComplete(getLastBlock(existingWorkspace))
    } else {
      // New name — go to role selection step
      setStep('choose_role')
    }
  }

  const handleJoinAs = async (asViewer: boolean) => {
    if (!selectedTeam || !memberName.trim()) return
    const name = memberName.trim()
    const role: TeamMember['role'] = asViewer ? 'viewer' : 'member'
    const newMember: TeamMember = { name, order: (selectedTeam.members?.length || 0) + 1, role }
    const updatedMembers = [...(selectedTeam.members || []), newMember]
    const updatedTeam: Team = { ...selectedTeam, members: updatedMembers }
    setTeam(updatedTeam, asViewer)
    if (!selectedTeam.id.startsWith('demo-')) {
      const saved = await updateTeamMembers(selectedTeam.id, updatedMembers)
      if (!saved) console.error('Failed to save member to Supabase')
    }
    onComplete(asViewer ? getLastBlock(existingWorkspace) : 1)
  }

  const handleJoinAsViewer = async () => {
    if (!selectedTeam || !memberName.trim()) return
    const name = memberName.trim()
    const newMember: TeamMember = { name, order: (selectedTeam.members?.length || 0) + 1, role: 'viewer' }
    const updatedMembers = [...(selectedTeam.members || []), newMember]
    const updatedTeam: Team = { ...selectedTeam, members: updatedMembers }
    setTeam(updatedTeam, true)
    restoreWorkspace(existingWorkspace)
    if (!selectedTeam.id.startsWith('demo-')) {
      await updateTeamMembers(selectedTeam.id, updatedMembers)
    }
    onComplete(getLastBlock(existingWorkspace))
  }


  const handleFirstSetup = async () => {
    if (!selectedTeam || !agencyName.trim() || !memberName.trim()) return
    const name = memberName.trim()
    const captain: TeamMember = { name, order: 1, role: 'member' }
    const updatedMembers = [captain]
    const updatedTeam: Team = { ...selectedTeam, name: agencyName.trim(), members: updatedMembers }
    setTeam(updatedTeam, false)
    if (!selectedTeam.id.startsWith('demo-')) await updateTeamMembers(selectedTeam.id, updatedMembers, agencyName.trim())
    onComplete(1)
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center px-5 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-xs font-bold tracking-widest uppercase text-slate-500 mb-3">CIM Level 4 · Digital Marketing</div>
          <h1 className="text-white text-3xl font-bold mb-2">Social Media Workshop</h1>
          <p className="text-slate-400 text-sm">BM7621 · Nike Agency Pitch</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">

          {/* Step 1: Enter code */}
          {step === 'code' && (
            <div className="p-8">
              <h2 className="text-lg font-bold text-slate-900 mb-1">Enter Access Code</h2>
              <p className="text-sm text-slate-500 mb-6">Your facilitator will give you your team code.</p>
              <input type="text" autoFocus
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-4 text-center text-2xl font-mono font-bold uppercase tracking-widest outline-none focus:border-brand-400 mb-4"
                placeholder="Enter Code" value={code}
                onChange={e => setCode(e.target.value.toUpperCase())}
                onKeyDown={e => e.key === 'Enter' && handleCode()} maxLength={10} />
              {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-4">{error}</div>}
              <button className="w-full bg-brand-600 text-white font-bold py-3.5 rounded-xl hover:bg-brand-700 transition-colors disabled:opacity-50 text-base"
                onClick={handleCode} disabled={loading}>
                {loading ? 'Checking…' : 'Enter Workshop →'}
              </button>
            </div>
          )}

          {step === 'returning_or_new' && selectedTeam && (
            <div className="p-8">
              <div className="bg-slate-900 rounded-xl p-4 text-center mb-5">
                <div className="text-[10px] font-bold tracking-widest uppercase text-slate-400 mb-1">Nike Account Pitch</div>
                <div className="text-white font-bold text-lg">{selectedTeam.name}</div>
              </div>

              {/* Returning member box */}
              <div className="border-2 border-slate-200 rounded-xl p-4 mb-3">
                <div className="text-sm font-bold text-slate-800 mb-0.5">↩ Already registered?</div>
                <p className="text-xs text-slate-500 mb-3">Enter your name exactly as you registered to restore your session and scores.</p>
                <input type="text" autoFocus
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-brand-400 mb-2"
                  placeholder="Your registered name" value={memberName}
                  onChange={e => { setMemberName(e.target.value); setError('') }}
                  onKeyDown={e => e.key === 'Enter' && handleReturning()} />
                {error && <div className="text-red-600 text-xs mb-2">{error}</div>}
                <button className="w-full bg-brand-600 text-white font-bold py-2.5 rounded-lg hover:bg-brand-700 transition-colors disabled:opacity-50 text-sm"
                  onClick={handleReturning} disabled={!memberName.trim()}>
                  Restore My Session →
                </button>
              </div>

              {/* New member — joins as viewer */}
              <div className="border-2 border-slate-200 rounded-xl p-4 mb-3">
                <div className="text-sm font-bold text-slate-800 mb-0.5">➕ New to this team?</div>
                <p className="text-xs text-slate-500 mb-3">Enter your name to join as a Viewer — you can follow the workshop but only the Team Captain can submit answers.</p>
                <input type="text"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-brand-400 mb-2"
                  placeholder="Your name" value={memberName}
                  onChange={e => { setMemberName(e.target.value); setError('') }} />
                <button className="w-full bg-slate-700 text-white font-bold py-2.5 rounded-lg hover:bg-slate-600 transition-colors disabled:opacity-50 text-sm"
                  onClick={handleJoinAsViewer} disabled={!memberName.trim()}>
                  Join as Viewer →
                </button>
              </div>

              <button className="w-full text-xs text-slate-400 hover:text-slate-600 py-1"
                onClick={() => { setStep('code'); setError('') }}>← Different code</button>
            </div>
          )}

                    {/* Step 2c: First person — full setup */}
          {step === 'first_setup' && selectedTeam && (
            <div className="p-8">
              <div className="bg-slate-900 rounded-xl p-4 text-center mb-6">
                <div className="text-[10px] font-bold tracking-widest uppercase text-slate-400 mb-1">Your Brief</div>
                <div className="text-white font-bold text-lg">Nike Social Media Account</div>
                <div className="text-slate-300 text-sm mt-1">5 agencies. 1 client. Best pitch wins.</div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Agency Name</label>
                <input className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 font-semibold outline-none focus:border-brand-400"
                  placeholder="e.g. Spark Social, Bold Agency…"
                  value={agencyName} onChange={e => setAgencyName(e.target.value)} />
              </div>
              <div className="mb-5">
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Your Name <span className="text-brand-600 font-normal text-xs">(Team Captain)</span></label>
                <input className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-brand-400"
                  placeholder="Enter your name"
                  value={memberName} onChange={e => setMemberName(e.target.value)} />
                <div className="text-xs text-slate-400 mt-1">As the first to join, you're the Team Captain.</div>
              </div>
              {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-4">{error}</div>}
              <button className="w-full bg-brand-600 text-white font-bold py-3.5 rounded-xl hover:bg-brand-700 transition-colors disabled:opacity-50"
                onClick={handleFirstSetup} disabled={!agencyName.trim() || !memberName.trim()}>
                Start Pitch →
              </button>
              {(!agencyName.trim() || !memberName.trim()) && (
                <div className="text-xs text-amber-600 mt-2 text-center">Enter agency name and your name to continue</div>
              )}
              <button className="w-full mt-2 text-xs text-slate-400 hover:text-slate-600 py-1"
                onClick={() => { setStep('code'); setError('') }}>← Back</button>
            </div>
          )}
        </div>
        <p className="text-center text-xs text-slate-600 mt-5">Kingston Business School · BM7621</p>
      </div>
    </div>
  )
}
