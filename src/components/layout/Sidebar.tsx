import { useWorkspaceStore, selectTotalScore, selectCompletedCount } from '../../store/workspace'
import { BLOCK_STRUCTURE, ACTIVITY_LABELS, ACTIVITY_DISPLAY_NUM } from '../../data/workshop'
import type { ActivityKey } from '../../types'

interface SidebarProps {
  currentPanel: string
  onNavigate: (panel: string) => void
  onClose?: () => void
}

const SYNC_ICONS = {
  idle: '○',
  saving: '↑',
  saved: '●',
  error: '⚠',
  offline: '○',
}

export function Sidebar({ currentPanel, onNavigate, onClose }: SidebarProps) {
  const { team, scores, isViewer, syncStatus, lastSaved } = useWorkspaceStore()
  const total = selectTotalScore(scores)
  const completed = selectCompletedCount(scores)
  const totalActs = 22

  const isActivityDone = (key: ActivityKey) => !!scores[key]?.completed
  const isActivityLocked = (key: ActivityKey) => !!scores[key]?.locked

  const navigate = (panel: string) => {
    onNavigate(panel)
    onClose?.()
  }

  const blockColors: Record<string, string> = {
    blue: 'text-blue-400', violet: 'text-violet-400', teal: 'text-teal-400',
    amber: 'text-amber-400', red: 'text-red-400', emerald: 'text-emerald-400', purple: 'text-purple-400',
  }

  return (
    <aside className="w-64 h-screen bg-slate-900 flex flex-col fixed top-0 left-0 z-50 overflow-y-auto">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/10">
        <div className="text-[10px] font-bold tracking-widest text-slate-500 uppercase mb-1">BM7621</div>
        <div className="text-white text-base font-bold leading-snug">Social Media Workshop</div>
        <div className="text-[10px] text-slate-500 mt-1">CIM Level 4 · Digital Marketing</div>
      </div>

      {/* Team info */}
      {team && (
        <div className="px-5 py-3 border-b border-white/10">
          <div className="text-[10px] font-bold tracking-widest text-slate-500 uppercase mb-0.5">{team.brand}</div>
          <div className="text-white text-sm font-bold">{team.name}</div>
          {isViewer && <div className="text-[10px] text-amber-400 mt-0.5">👁 Viewer mode</div>}
          <div className="mt-2">
            <div className="flex justify-between text-[10px] text-slate-500 mb-1">
              <span>Score: <span className="text-brand-400 font-bold">{total}</span></span>
              <span>{completed}/{totalActs} done</span>
            </div>
            <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-brand-500 rounded-full transition-all" style={{ width: `${Math.round(completed / totalActs * 100)}%` }} />
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-3">
        <button onClick={() => navigate('mission')}
          className={`w-full text-left px-3 py-2 rounded-lg text-sm mb-3 flex items-center gap-2 transition-colors ${currentPanel === 'mission' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
          <span>📋</span> Mission Brief
        </button>

        {BLOCK_STRUCTURE.map(block => (
          <div key={block.id} className="mb-3">
            <button onClick={() => navigate(`block${block.id}`)}
              className={`w-full text-left px-3 py-1.5 rounded-lg mb-1 transition-colors ${currentPanel === `block${block.id}` ? 'bg-white/10' : 'hover:bg-white/5'}`}>
              <div className={`text-[9px] font-bold uppercase tracking-widest ${blockColors[block.color] || 'text-slate-500'}`}>
                Block {block.id} — {block.label}
              </div>
            </button>
            {block.activities.map(actKey => {
              const done = isActivityDone(actKey)
              const locked = isActivityLocked(actKey)
              return (
                <button key={actKey} onClick={() => navigate(`block${block.id}`)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg flex items-center gap-2 transition-colors ${currentPanel === `block${block.id}` ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}>
                  <span className="text-[10px] flex-shrink-0">
                    {done ? (locked ? '🔒' : '✓') : '○'}
                  </span>
                  <span className="text-xs truncate">
                    A{ACTIVITY_DISPLAY_NUM[actKey]} — {ACTIVITY_LABELS[actKey]}
                  </span>
                </button>
              )
            })}
          </div>
        ))}

        {/* Final challenge */}
        <button onClick={() => navigate('final')}
          className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 transition-colors mb-1 ${currentPanel === 'final' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
          <span className="text-sm">🏆</span>
          <span className="text-xs font-semibold">Social Masters Challenge</span>
        </button>

        {/* Tools */}
        <div className="border-t border-white/10 mt-3 pt-3">
          <div className="text-[9px] font-bold uppercase tracking-widest text-slate-600 px-3 mb-1">Tools</div>
          {[
            { id: 'leaderboard', icon: '📊', label: 'Leaderboard' },
            { id: 'exports', icon: '↓', label: 'Export Centre' },
          ].map(item => (
            <button key={item.id} onClick={() => navigate(item.id)}
              className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 text-sm transition-colors ${currentPanel === item.id ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
              <span>{item.icon}</span>{item.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Sync status */}
      <div className="px-4 py-3 border-t border-white/10">
        <div className="flex items-center gap-2 text-[10px] text-slate-600">
          <span>{SYNC_ICONS[syncStatus]}</span>
          <span>
            {syncStatus === 'saved' && lastSaved ? `Saved ${new Date(lastSaved).toLocaleTimeString()}` :
             syncStatus === 'saving' ? 'Saving...' :
             syncStatus === 'error' ? 'Sync error — saved locally' :
             'Auto-save on'}
          </span>
        </div>
      </div>

      {/* Switch team */}
      <div className="px-4 pb-4 pt-2 border-t border-white/10">
        <button
          onClick={() => {
            if (window.confirm('Leave workshop? Your progress is saved.')) {
              useWorkspaceStore.getState().clearWorkspace()
              window.location.reload()
            }
          }}
          className="w-full text-left text-[11px] text-slate-600 hover:text-slate-400 transition-colors flex items-center gap-1.5 py-1">
          <span>⇄</span> Switch Team / Sign Out
        </button>
      </div>
    </aside>
  )
}
