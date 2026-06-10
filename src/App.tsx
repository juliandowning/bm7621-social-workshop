import { useState, useEffect } from 'react'
import { useWorkspaceStore } from './store/workspace'
import { SetupScreen } from './components/layout/SetupScreen'
import { Sidebar } from './components/layout/Sidebar'
import { MissionPanel } from './components/layout/MissionPanel'
import { Block1 } from './components/activities/Block1'
import { Block2 } from './components/activities/Block2'
import { Block3 } from './components/activities/Block3'
import { Block4 } from './components/activities/Block4'
import { Block5 } from './components/activities/Block5'
import { Block6 } from './components/activities/Block6'
import { Block7 } from './components/activities/Block7'
import { AgencyPitch } from './components/activities/AgencyPitch'
import { LeaderboardPanel } from './components/leaderboard/LeaderboardPanel'
import { TeamPanel } from './components/leaderboard/TeamPanel'
import { ExportsPanel } from './components/exports/ExportsPanel'
import { FacilitatorDashboard } from './components/facilitator/FacilitatorDashboard'
import { BroadcastToast, ConfirmModal } from './components/ui/shared'
import { subscribeToBroadcast, subscribeToTeamWorkspace, supabase } from './lib/supabase'
import type { BroadcastMessage } from './types'

type Panel = 'mission' | 'block1' | 'block2' | 'block3' | 'block4' | 'block5' | 'block6' | 'block7' | 'final' | 'leaderboard' | 'exports'

const PANEL_TITLES: Record<Panel, { title: string; subtitle: string }> = {
  mission: { title: 'Mission Brief', subtitle: 'Workshop Overview' },
  block1: { title: 'Social Media Foundations', subtitle: 'Block 1 · Situation Analysis' },
  block2: { title: 'Consumer Behaviour & Ethics', subtitle: 'Block 2 · Audience & Community Analysis' },
  block3: { title: 'Platforms & Algorithms', subtitle: 'Block 3 · Channel Strategy' },
  block4: { title: 'Content & Influencer Strategy', subtitle: 'Block 4 · Campaign Platform' },
  block5: { title: 'Paid Social & Commerce', subtitle: 'Block 5 · Paid Strategy' },
  block6: { title: 'Analytics & Measurement', subtitle: 'Block 6 · Measurement Framework' },
  block7: { title: 'AI & Future Social', subtitle: 'Block 7 · Future Roadmap' },
  final: { title: 'Agency Pitch', subtitle: 'Final Deliverable · 3-Minute Presentation' },
  leaderboard: { title: 'Workshop Leaderboard', subtitle: 'Live Rankings' },
  exports: { title: 'Export Centre', subtitle: 'Download your workshop data' },
}

function WorkshopApp({ initialPanel }: { initialPanel?: string }) {
  const [panel, setPanel] = useState<Panel>((initialPanel as Panel) || 'mission')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { broadcastMessage, setBroadcast, team, isViewer, syncFromServer } = useWorkspaceStore()

  useEffect(() => {
    const unsub = subscribeToBroadcast((payload: unknown) => {
      const p = payload as { new?: { message?: string; type?: string; id?: string; created_at?: string } }
      if (p?.new?.message) {
        const msg: BroadcastMessage = {
          id: p.new.id || Date.now().toString(),
          text: p.new.message,
          type: (p.new.type as 'info' | 'warning' | 'success') || 'info',
          created_at: p.new.created_at || new Date().toISOString(),
        }
        setBroadcast(msg)
        setTimeout(() => setBroadcast(null), 8000)
      }
    })
    return () => { unsub() }
  }, [setBroadcast])

  // Manual refresh for viewers
  const refreshViewer = async () => {
    if (!team?.id || team.id.startsWith('demo-') || !isViewer) return
    const { data } = await supabase
      .from('bm7621social_workspace_data')
      .select('scores, responses')
      .eq('team_id', team.id)
      .maybeSingle()
    if (data?.scores != null) {
      syncFromServer(
        data.scores as import('./types').ScoreMap,
        (data.responses || {}) as import('./types').ResponseMap
      )
    }
  }

  // Poll for workspace updates for viewers (every 8s)
  useEffect(() => {
    if (!team?.id || team.id.startsWith('demo-') || !isViewer) return
    const poll = async () => {
      try {
        const { data, error } = await supabase
          .from('bm7621social_workspace_data')
          .select('scores, responses')
          .eq('team_id', team.id)
          .maybeSingle()
        if (error) { console.error('Viewer poll error:', error.message); return }
        if (data?.scores != null) {
          syncFromServer(
            data.scores as import('./types').ScoreMap,
            (data.responses || {}) as import('./types').ResponseMap
          )
        }
      } catch (e) { console.error('Viewer poll exception:', e) }
    }
    poll()
    const interval = setInterval(poll, 8000)
    return () => clearInterval(interval)
  }, [team?.id, isViewer, syncFromServer])

  const navigate = (p: string) => { setPanel(p as Panel); setSidebarOpen(false); window.scrollTo(0, 0) }
  const meta = PANEL_TITLES[panel] || PANEL_TITLES.mission

  const renderPanel = () => {
    switch (panel) {
      case 'mission': return <MissionPanel onStart={() => navigate('block1')} />
      case 'block1': return <Block1 />
      case 'block2': return <Block2 />
      case 'block3': return <Block3 />
      case 'block4': return <Block4 />
      case 'block5': return <Block5 />
      case 'block6': return <Block6 />
      case 'block7': return <Block7 />
      case 'final': return <AgencyPitch />
      case 'leaderboard': return <><TeamPanel /><LeaderboardPanel /></>
      case 'exports': return <ExportsPanel />
      default: return <MissionPanel />
    }
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <ConfirmModal />
      {broadcastMessage && (
        <BroadcastToast message={broadcastMessage.text} type={broadcastMessage.type} onDismiss={() => setBroadcast(null)} />
      )}

      {/* Mobile nav overlay — completely standalone, no Sidebar component */}
      {sidebarOpen && (
        <div style={{position:'fixed',inset:0,zIndex:9999,display:'flex'}} className="md:hidden">
          <div style={{width:'280px',height:'100%',background:'#0f172a',display:'flex',flexDirection:'column',overflowY:'auto'}}>
            {/* Close button — very first element */}
            <button
              style={{background:'#1e293b',color:'white',padding:'16px',fontSize:'18px',fontWeight:'bold',textAlign:'left',border:'none',cursor:'pointer',flexShrink:0}}
              onClick={() => setSidebarOpen(false)}
            >✕ &nbsp;Close Menu</button>
            {/* Nav links */}
            {[
              { id: 'mission', label: '📋 Mission Brief' },
              { id: 'block1', label: 'Block 1 — Foundations' },
              { id: 'block2', label: 'Block 2 — Behaviour & Ethics' },
              { id: 'block3', label: 'Block 3 — Platforms' },
              { id: 'block4', label: 'Block 4 — Content & Influencer' },
              { id: 'block5', label: 'Block 5 — Paid Social' },
              { id: 'block6', label: 'Block 6 — Analytics' },
              { id: 'block7', label: 'Block 7 — AI & Future' },
              { id: 'final', label: '🏆 Agency Pitch' },
              { id: 'leaderboard', label: '👥 Teams & Leaderboard' },
              { id: 'exports', label: '↓ Export Centre' },
            ].map(item => (
              <button key={item.id}
                style={{color: panel === item.id ? '#818cf8' : '#94a3b8', padding:'12px 16px',textAlign:'left',border:'none',background:'transparent',fontSize:'14px',cursor:'pointer',borderBottom:'1px solid rgba(255,255,255,0.05)'}}
                onClick={() => { navigate(item.id); setSidebarOpen(false) }}
              >{item.label}</button>
            ))}
            <button
              style={{color:'#ef4444',padding:'12px 16px',textAlign:'left',border:'none',background:'transparent',fontSize:'14px',cursor:'pointer',borderTop:'1px solid rgba(255,255,255,0.1)',marginTop:'8px',width:'100%'}}
              onClick={() => {
                setSidebarOpen(false)
                if (window.confirm('Leave workshop? Your progress is saved.')) {
                  useWorkspaceStore.getState().clearWorkspace()
                  window.location.reload()
                }
              }}
            >⇄ Switch Team / Sign Out</button>
          </div>
          {/* Tap outside */}
          <div style={{flex:1,background:'rgba(0,0,0,0.6)'}} onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Desktop sidebar — always visible */}
      <div className="hidden md:block fixed top-0 left-0 h-full z-50">
        <Sidebar currentPanel={panel} onNavigate={navigate} />
      </div>
      {isViewer && (
        <button onClick={refreshViewer}
          className="hidden md:flex fixed top-3 right-4 z-50 items-center gap-1.5 px-3 py-1.5 bg-brand-50 border border-brand-200 text-brand-600 text-xs font-semibold rounded-lg hover:bg-brand-100 transition-colors"
          title="Refresh to see latest answers">
          ↻ Refresh
        </button>
      )}

      <div className="flex-1 md:ml-64">
        <div className="md:hidden sticky top-0 z-[60] bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-3">
          <button onClick={() => setSidebarOpen(s => !s)}
            className="w-10 h-10 flex items-center justify-center rounded-lg bg-slate-100 text-slate-700 text-xl font-bold flex-shrink-0">
            {sidebarOpen ? '✕' : '☰'}
          </button>
          <div className="text-sm font-bold text-slate-900 truncate flex-1">{meta.title}</div>
          {isViewer && (
            <button onClick={refreshViewer}
              className="w-9 h-9 flex items-center justify-center rounded-lg bg-brand-50 text-brand-600 text-base flex-shrink-0"
              title="Refresh to see latest answers">
              ↻
            </button>
          )}
        </div>
        <div className="px-4 pt-6 pb-2 border-b border-slate-200 bg-white hidden md:block">
          <div className="text-[10px] font-bold tracking-widest uppercase text-brand-500 mb-0.5">{meta.subtitle}</div>
          <h1 className="text-2xl font-bold text-slate-900">{meta.title}</h1>
        </div>
        <div className="px-4 md:px-8 py-6 max-w-3xl">
          {renderPanel()}
          {panel.startsWith('block') && (() => {
            const num = parseInt(panel.replace('block', ''))
            const prev = num > 1 ? `block${num - 1}` : 'mission'
            const next = num < 7 ? `block${num + 1}` : 'final'
            const prevLabel = num > 1 ? `Block ${num - 1}` : 'Mission Brief'
            const nextLabel = num < 7 ? `Block ${num + 1}` : 'Agency Pitch'
            return (
              <div className="flex justify-between mt-8 pt-4 border-t border-slate-200">
                <button className="px-4 py-2 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50" onClick={() => navigate(prev)}>← {prevLabel}</button>
                <button className="px-4 py-2 bg-brand-600 text-white rounded-xl text-sm font-bold hover:bg-brand-700" onClick={() => navigate(next)}>{nextLabel} →</button>
              </div>
            )
          })()}
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const { team } = useWorkspaceStore()
  const [isFacilitator, setIsFacilitator] = useState(false)
  const [resumePanel, setResumePanel] = useState<string | undefined>(undefined)

  if (isFacilitator) return <FacilitatorDashboard />
  if (!team) return (
    <SetupScreen
      onComplete={(block) => { if (block && block > 1) setResumePanel(`block${block}`) }}
      onFacilitator={() => setIsFacilitator(true)}
    />
  )
  return <WorkshopApp initialPanel={resumePanel} />
}
