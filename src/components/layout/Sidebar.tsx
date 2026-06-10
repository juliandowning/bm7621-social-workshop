import { useWorkspaceStore, selectTotalScore, selectCompletedCount } from '../../store/workspace'
import { BLOCK_STRUCTURE, ACTIVITY_LABELS, TOTAL_ACTIVITIES } from '../../data/workshop'
import type { ActivityKey } from '../../types'

const SYNC_ICONS = { idle: '●', saving: '↑', saved: '✓', error: '!', offline: '○' }

interface SidebarProps {
  currentPanel: string
  onNavigate: (panel: string) => void
  onClose?: () => void
}

export function Sidebar({ currentPanel, onNavigate, onClose }: SidebarProps) {
  const { team, scores, isViewer, syncStatus, lastSaved } = useWorkspaceStore()
  const total = selectTotalScore(scores)
  const completed = selectCompletedCount(scores)

  const navigate = (id: string) => { onNavigate(id); onClose?.() }

  const isBlock = (blockId: number) => {
    const block = BLOCK_STRUCTURE.find(b => b.id === blockId)
    return block?.activities.some(a => currentPanel === `block${blockId}`) || false
  }

  return (
    <aside className="w-64 h-full bg-slate-950 flex flex-col border-r border-slate-800">

      {/* Header */}
      <div className="flex-shrink-0 px-5 py-5 border-b border-slate-800">
        {onClose && (
          <button onPointerDown={() => onClose()}
            className="md:hidden w-8 h-8 mb-3 flex items-center justify-center rounded-lg bg-slate-800 text-slate-400 hover:text-white text-sm font-bold">✕</button>
        )}
        <div className="text-[10px] font-bold tracking-widest uppercase text-slate-500 mb-1">BM7621</div>
        <div className="text-white text-sm font-bold leading-snug">Social Media Workshop</div>
        <div className="text-[10px] text-slate-500 mt-0.5">CIM Level 4 · Digital Marketing</div>
      </div>

      {/* Team info */}
      {team && (
        <div className="flex-shrink-0 px-5 py-3 border-b border-slate-800">
          <div className="text-[10px] font-bold tracking-widest uppercase text-slate-500 mb-0.5">NIKE</div>
          <div className="text-white text-sm font-bold">{team.name}</div>
          {isViewer && <div className="text-[10px] text-amber-400 mt-0.5">👁 Viewer mode</div>}
          <div className="mt-2.5">
            <div className="flex justify-between text-[10px] text-slate-500 mb-1">
              <span>Score: <span className="text-emerald-400 font-bold">{total}</span></span>
              <span className="text-slate-600">{completed}/{TOTAL_ACTIVITIES}</span>
            </div>
            <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${Math.round(completed / TOTAL_ACTIVITIES * 100)}%` }} />
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-3">

        {/* Mission Brief */}
        <button onClick={() => navigate('mission')}
          className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-2.5 text-sm transition-colors mb-3 ${currentPanel === 'mission' ? 'bg-brand-600 text-white font-semibold' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
          <span className="text-base">📋</span>
          <span className="font-medium">Mission Brief</span>
        </button>

        {/* Blocks */}
        {BLOCK_STRUCTURE.map(block => {
          const blockKey = `block${block.id}`
          const isActive = currentPanel === blockKey
          const blockCompleted = block.activities.filter(a => scores[a as ActivityKey]?.completed).length
          const blockTotal = block.activities.length
          const allDone = blockCompleted === blockTotal

          return (
            <div key={block.id} className="mb-1">
              <button onClick={() => navigate(blockKey)}
                className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors ${isActive ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold w-5 h-5 rounded flex items-center justify-center flex-shrink-0 ${isActive ? 'bg-brand-500 text-white' : 'bg-slate-800 text-slate-500'}`}>{block.id}</span>
                    <span className={`text-xs font-medium leading-snug ${isActive ? 'text-white' : ''}`}>
                      {block.label.replace('Social Media ', '').replace(' & ', ' & ')}
                    </span>
                  </div>
                  <span className={`text-[10px] flex-shrink-0 ml-1 ${allDone ? 'text-emerald-400' : 'text-slate-600'}`}>
                    {allDone ? '✓' : `${blockCompleted}/${blockTotal}`}
                  </span>
                </div>
              </button>

              {/* Activity list when block is active */}
              {isActive && (
                <div className="ml-3 mt-1 mb-2 pl-3 border-l border-slate-800 space-y-0.5">
                  {block.activities.map(actKey => {
                    const done = scores[actKey as ActivityKey]?.completed
                    return (
                      <div key={actKey} className={`text-[11px] py-1 flex items-center gap-1.5 ${done ? 'text-emerald-400' : 'text-slate-500'}`}>
                        <span className="flex-shrink-0">{done ? '✓' : '○'}</span>
                        <span className="truncate">{ACTIVITY_LABELS[actKey as ActivityKey]}</span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}

        <div className="h-px bg-slate-800 my-3" />

        {/* Agency Pitch */}
        <button onClick={() => navigate('final')}
          className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-2.5 text-sm transition-colors mb-1 ${currentPanel === 'final' ? 'bg-violet-600 text-white font-semibold' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
          <span className="text-base">🏆</span>
          <span className="font-medium">Agency Pitch</span>
        </button>

        <div className="text-[10px] font-bold uppercase tracking-widest text-slate-600 px-3 mb-1.5 mt-3">Tools</div>
        {[
          { id: 'leaderboard', icon: '👥', label: 'Teams & Leaderboard' },
          { id: 'exports', icon: '↓', label: 'Export Centre' },
        ].map(item => (
          <button key={item.id} onClick={() => navigate(item.id)}
            className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 text-xs transition-colors ${currentPanel === item.id ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-white hover:bg-slate-800/60'}`}>
            <span>{item.icon}</span>{item.label}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="flex-shrink-0 border-t border-slate-800 px-4 py-3">
        <div className="flex items-center gap-2 text-[10px] text-slate-600 mb-2">
          <span className={syncStatus === 'saved' ? 'text-emerald-500' : syncStatus === 'error' ? 'text-red-500' : 'text-slate-500'}>{SYNC_ICONS[syncStatus]}</span>
          <span>{syncStatus === 'saved' && lastSaved ? `Saved ${new Date(lastSaved).toLocaleTimeString()}` : syncStatus === 'saving' ? 'Saving…' : syncStatus === 'error' ? 'Sync error' : 'Auto-save on'}</span>
        </div>
        <button onClick={() => {
          if (window.confirm('Leave workshop? Your progress is saved.')) {
            useWorkspaceStore.getState().clearWorkspace()
            window.location.reload()
          }
        }} className="w-full text-left text-[11px] text-slate-600 hover:text-slate-400 transition-colors flex items-center gap-1.5 py-1">
          <span>⇄</span> Switch Team / Sign Out
        </button>
      </div>
    </aside>
  )
}
