import { useWorkspaceStore } from '../../store/workspace'
import { BLOCK_STRUCTURE, ACTIVITY_ORDER, NIKE_BRIEF } from '../../data/workshop'
import { selectTotalScore, selectCompletedCount } from '../../store/workspace'

interface MissionPanelProps { onStart?: () => void }

export function MissionPanel({ onStart }: MissionPanelProps) {
  const { team, scores } = useWorkspaceStore()
  const total = selectTotalScore(scores)
  const completed = selectCompletedCount(scores)

  return (
    <div>
      {/* Hero */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 text-white mb-6">
        <div className="text-[10px] font-bold tracking-widest uppercase text-slate-400 mb-2">BM7621 · Social Media Workshop</div>
        <h1 className="text-3xl font-bold mb-1">{team?.name || 'Your Agency'}</h1>
        <p className="text-slate-300 text-sm mb-1">Pitching for: <strong className="text-white">Nike</strong> — {NIKE_BRIEF.tagline}</p>
        <p className="text-slate-400 text-xs mb-5">CIM Level 4 · Digital Marketing</p>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold">{total}</div>
            <div className="text-[10px] text-slate-300 uppercase tracking-wider">Points</div>
          </div>
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold">{completed}</div>
            <div className="text-[10px] text-slate-300 uppercase tracking-wider">Done</div>
          </div>
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold">{ACTIVITY_ORDER.length - 1}</div>
            <div className="text-[10px] text-slate-300 uppercase tracking-wider">Activities</div>
          </div>
        </div>
      </div>

      {/* Nike brief */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-6 shadow-sm">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">The Brief</div>
        <div className="space-y-3">
          <div>
            <div className="text-xs font-semibold text-slate-500 mb-0.5">Situation</div>
            <div className="text-sm text-slate-800">{NIKE_BRIEF.situation}</div>
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 mb-0.5">Your Challenge</div>
            <div className="text-sm text-slate-800 font-semibold">{NIKE_BRIEF.challenge}</div>
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 mb-0.5">Primary Audience</div>
            <div className="text-sm text-slate-800">{NIKE_BRIEF.audience.primary}</div>
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 mb-0.5">Audience Insight</div>
            <div className="text-sm text-slate-600 italic">{NIKE_BRIEF.audience.insight}</div>
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 mb-0.5">Current Platforms</div>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {NIKE_BRIEF.currentPlatforms.map(p => (
                <span key={p} className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">{p}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Block overview */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-4">Workshop Structure</div>
        <div className="space-y-2">
          {BLOCK_STRUCTURE.map(block => {
            const blockCompleted = block.activities.filter(a => scores[a]?.completed).length
            const blockTotal = block.activities.length
            return (
              <div key={block.id} className="flex items-center gap-3 py-2 border-b border-slate-50">
                <div className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 text-xs font-bold flex items-center justify-center flex-shrink-0">
                  {block.id}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-slate-800">{block.label}</div>
                  <div className="text-xs text-slate-400">{block.deliverable}</div>
                </div>
                <div className="text-xs font-semibold text-slate-400">{blockCompleted}/{blockTotal}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Start button */}
      {onStart && (
        <div className="mt-6 text-center">
          <button onClick={onStart}
            className="bg-brand-600 text-white font-bold px-8 py-4 rounded-2xl text-base hover:bg-brand-700 transition-colors shadow-lg">
            Start Block 1 →
          </button>
        </div>
      )}
    </div>
  )
}
