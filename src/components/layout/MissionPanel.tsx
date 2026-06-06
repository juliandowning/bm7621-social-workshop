import { useWorkspaceStore } from '../../store/workspace'
import { BRAND_CONTEXT, BLOCK_STRUCTURE, ACTIVITY_ORDER } from '../../data/workshop'
import { selectTotalScore, selectCompletedCount } from '../../store/workspace'

export function MissionPanel() {
  const { team, scores } = useWorkspaceStore()
  const brand = team?.brand || 'Nike'
  const context = BRAND_CONTEXT[brand]
  const total = selectTotalScore(scores)
  const completed = selectCompletedCount(scores)

  return (
    <div>
      {/* Hero */}
      <div className="bg-gradient-to-br from-brand-600 to-brand-800 rounded-2xl p-8 text-white mb-6">
        <div className="text-[10px] font-bold tracking-widest uppercase text-brand-200 mb-2">BM7621 · Social Media Workshop</div>
        <h1 className="text-3xl font-bold mb-2">Welcome, {team?.name || 'Team'}</h1>
        <p className="text-brand-100 text-sm mb-4">
          You are representing <strong className="text-white">{brand}</strong> today — a leading brand in {context.industry}.
        </p>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold">{total}</div>
            <div className="text-[10px] text-brand-200 uppercase tracking-wider">Points</div>
          </div>
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold">{completed}</div>
            <div className="text-[10px] text-brand-200 uppercase tracking-wider">Completed</div>
          </div>
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold">{ACTIVITY_ORDER.length}</div>
            <div className="text-[10px] text-brand-200 uppercase tracking-wider">Activities</div>
          </div>
        </div>
      </div>

      {/* Brand context */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-6 shadow-sm">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">Your Brand Brief</div>
        <div className="grid grid-cols-1 gap-3">
          <div>
            <div className="text-xs font-semibold text-slate-500 mb-0.5">Industry</div>
            <div className="text-sm text-slate-800">{context.industry}</div>
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 mb-0.5">Primary Platforms</div>
            <div className="flex flex-wrap gap-1.5">
              {context.mainPlatforms.map(p => (
                <span key={p} className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-100 text-brand-700">{p}</span>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 mb-0.5">Target Audience</div>
            <div className="text-sm text-slate-800">{context.audience}</div>
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 mb-0.5">Brand Tone</div>
            <div className="text-sm text-slate-800">{context.tone}</div>
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 mb-0.5">Key Challenge</div>
            <div className="text-sm text-slate-800">{context.challenge}</div>
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
                  <div className="text-xs text-slate-400">{block.description}</div>
                </div>
                <div className="text-xs font-semibold text-slate-400">
                  {blockCompleted}/{blockTotal}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
