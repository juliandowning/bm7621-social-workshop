import { useWorkspaceStore, selectTotalScore } from '../../store/workspace'
import { ACTIVITY_ORDER, BLOCK_STRUCTURE } from '../../data/workshop'
import { selectCompletedCount } from '../../store/workspace'

export function AgencyPitch() {
  const { team, scores, responses } = useWorkspaceStore()
  const brand = team?.brand || 'Nike'
  const total = selectTotalScore(scores)
  const completed = selectCompletedCount(scores)
  const pct = Math.round(completed / ACTIVITY_ORDER.length * 100)

  const SLIDES = [
    {
      id: 'situation',
      block: 1,
      title: 'Situation Analysis',
      content: () => {
        const journey = responses['b1a2_map'] as Record<string, string> | undefined
        const platforms = responses['b1a3_map'] as Record<string, string> | undefined
        if (!journey && !platforms) return null
        return (
          <div className="space-y-2">
            {journey && Object.keys(journey).length > 0 && (
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Customer Journey Mapped</div>
                <div className="flex flex-wrap gap-1.5">
                  {Object.entries(journey).map(([id, stage]) => (
                    <span key={id} className="text-[10px] px-2 py-0.5 rounded-full bg-brand-100 text-brand-700 font-semibold">{stage}</span>
                  ))}
                </div>
              </div>
            )}
            {platforms && Object.keys(platforms).length > 0 && (
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Platform Assessment</div>
                <div className="flex flex-wrap gap-1.5">
                  {Object.entries(platforms).slice(0, 4).map(([id, cat]) => (
                    <span key={id} className="text-[10px] px-2 py-0.5 rounded-full bg-teal-100 text-teal-700 font-semibold">{id} → {cat}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )
      }
    },
    {
      id: 'audience',
      block: 2,
      title: 'Audience & Community Analysis',
      content: () => {
        const motivations = responses['b2a2_motivations'] as string[] | undefined
        const tactics = responses['b2a4_tactics'] as string[] | undefined
        if (!motivations && !tactics) return null
        return (
          <div className="space-y-2">
            {motivations && motivations.length > 0 && (
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Audience Motivations</div>
                <div className="flex flex-wrap gap-1.5">
                  {motivations.map(m => <span key={m} className="text-[10px] px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 font-semibold">{m}</span>)}
                </div>
              </div>
            )}
            {tactics && tactics.length > 0 && (
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Community Strategy</div>
                <div className="flex flex-wrap gap-1.5">
                  {tactics.map(t => <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-semibold">{t}</span>)}
                </div>
              </div>
            )}
          </div>
        )
      }
    },
    {
      id: 'channel',
      block: 3,
      title: 'Channel Strategy',
      content: () => {
        const priorities = responses['b3a1_priorities'] as Record<string, string> | undefined
        if (!priorities) return null
        const primary = Object.entries(priorities).filter(([, v]) => v === 'Primary').map(([k]) => k)
        const secondary = Object.entries(priorities).filter(([, v]) => v === 'Secondary').map(([k]) => k)
        return (
          <div className="space-y-2">
            {primary.length > 0 && <div><div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Primary Platforms</div><div className="flex flex-wrap gap-1.5">{primary.map(p => <span key={p} className="text-[10px] px-2 py-0.5 rounded-full bg-brand-500 text-white font-semibold">{p}</span>)}</div></div>}
            {secondary.length > 0 && <div><div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Secondary Platforms</div><div className="flex flex-wrap gap-1.5">{secondary.map(p => <span key={p} className="text-[10px] px-2 py-0.5 rounded-full bg-teal-100 text-teal-700 font-semibold">{p}</span>)}</div></div>}
          </div>
        )
      }
    },
    {
      id: 'campaign',
      block: 4,
      title: 'Campaign Platform (Big Idea)',
      content: () => {
        const name = responses['b4a2_name'] as string | undefined
        const message = responses['b4a2_message'] as string | undefined
        const promise = responses['b4a2_promise'] as string | undefined
        if (!name) return null
        return (
          <div className="bg-gradient-to-r from-brand-600 to-brand-700 rounded-xl p-4 text-white">
            <div className="text-lg font-bold mb-1">{name}</div>
            {message && <div className="text-brand-100 text-sm mb-2">"{message}"</div>}
            {promise && <div className="text-xs text-brand-200">Promise: {promise}</div>}
          </div>
        )
      }
    },
    {
      id: 'content',
      block: 4,
      title: 'Content & Influencer Strategy',
      content: () => {
        const mix = responses['b4a3_mix'] as Record<string, number> | undefined
        const tier = responses['b4a4_tier'] as string | undefined
        if (!mix && !tier) return null
        return (
          <div className="space-y-2">
            {mix && Object.keys(mix).length > 0 && (
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Content Mix</div>
                <div className="flex flex-wrap gap-1.5">
                  {Object.entries(mix).filter(([, v]) => v > 0).sort(([, a], [, b]) => b - a).map(([k, v]) => (
                    <span key={k} className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-semibold">{k}: {v}%</span>
                  ))}
                </div>
              </div>
            )}
            {tier && <div><div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Influencer Tier</div><span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 font-semibold">{tier}</span></div>}
          </div>
        )
      }
    },
    {
      id: 'paid',
      block: 5,
      title: 'Paid Social & Commerce Strategy',
      content: () => {
        const budget = responses['b5a2_budget'] as Record<string, number> | undefined
        const rationale = responses['b5a2_rationale'] as string | undefined
        if (!budget) return null
        return (
          <div className="space-y-2">
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(budget).filter(([, v]) => v > 0).sort(([, a], [, b]) => b - a).map(([k, v]) => (
                <span key={k} className="text-[10px] px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-semibold">{k}: {v}%</span>
              ))}
            </div>
            {rationale && <div className="text-xs text-slate-600 italic">"{rationale.slice(0, 120)}{rationale.length > 120 ? '…' : ''}"</div>}
          </div>
        )
      }
    },
    {
      id: 'measurement',
      block: 6,
      title: 'Measurement Framework',
      content: () => {
        const kpis = responses['b6a3_kpis'] as Record<string, string[]> | undefined
        if (!kpis) return null
        return (
          <div className="space-y-2">
            {Object.entries(kpis).map(([stage, kpiList]) => (
              kpiList.length > 0 && (
                <div key={stage}>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{stage}</div>
                  <div className="flex flex-wrap gap-1.5">
                    {kpiList.map(k => <span key={k} className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-semibold">{k}</span>)}
                  </div>
                </div>
              )
            ))}
          </div>
        )
      }
    },
    {
      id: 'creative',
      block: 7,
      title: 'Creative Concepts',
      content: () => {
        const ad = responses['b7a3_ad'] as string | undefined
        const reel = responses['b7a3_reel'] as string | undefined
        if (!ad && !reel) return null
        return (
          <div className="space-y-2">
            {ad && <div><div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Social Ad</div><div className="text-xs text-slate-700 italic">"{ad.slice(0, 150)}{ad.length > 150 ? '…' : ''}"</div></div>}
            {reel && <div><div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Reel Concept</div><div className="text-xs text-slate-700 italic">"{reel.slice(0, 150)}{reel.length > 150 ? '…' : ''}"</div></div>}
          </div>
        )
      }
    },
    {
      id: 'future',
      block: 7,
      title: 'AI & Future Development Roadmap',
      content: () => {
        const ranked = responses['b7a2_ranked'] as string[] | undefined
        const rationale = responses['b7a2_rationale'] as string | undefined
        if (!ranked || ranked.length === 0) return null
        const TREND_LABELS: Record<string, string> = {
          gen_ai: 'Generative AI', social_search: 'Social Search', automation: 'Full Campaign Automation',
          synthetic_influencers: 'Synthetic Influencers', predictive: 'Predictive Analytics', ar_social: 'AR Social', social_commerce: 'Full Social Commerce'
        }
        return (
          <div className="space-y-2">
            <div><div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Priority Trends</div>
            <div className="flex flex-wrap gap-1.5">
              {ranked.slice(0, 3).map((id, i) => (
                <span key={id} className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-semibold">#{i+1} {TREND_LABELS[id] || id}</span>
              ))}
            </div></div>
            {rationale && <div className="text-xs text-slate-600 italic">"{rationale.slice(0, 120)}{rationale.length > 120 ? '…' : ''}"</div>}
          </div>
        )
      }
    },
  ]

  const completedSlides = SLIDES.filter(s => {
    const blockCompleted = BLOCK_STRUCTURE.find(b => b.id === s.block)?.activities.some(a => scores[a]?.completed)
    return blockCompleted
  })

  return (
    <div>
      {/* Hero */}
      <div className="bg-gradient-to-br from-violet-700 to-brand-700 rounded-2xl p-8 text-white mb-6 text-center">
        <div className="text-[10px] font-bold tracking-widest uppercase text-violet-200 mb-2">Final Deliverable</div>
        <h2 className="text-2xl font-bold mb-2">Agency Pitch</h2>
        <div className="text-violet-100 text-sm mb-4">{brand} · Social Media Marketing Plan</div>
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="bg-white/10 rounded-xl p-3">
            <div className="text-xl font-bold">{total}</div>
            <div className="text-[10px] text-violet-200 uppercase tracking-wider">Workshop Points</div>
          </div>
          <div className="bg-white/10 rounded-xl p-3">
            <div className="text-xl font-bold">{pct}%</div>
            <div className="text-[10px] text-violet-200 uppercase tracking-wider">Complete</div>
          </div>
          <div className="bg-white/10 rounded-xl p-3">
            <div className="text-xl font-bold">{completedSlides.length}/9</div>
            <div className="text-[10px] text-violet-200 uppercase tracking-wider">Slides Ready</div>
          </div>
        </div>
      </div>

      {/* Slide deck */}
      <div className="space-y-4">
        {SLIDES.map((slide, i) => {
          const slideContent = slide.content()
          const isComplete = !!slideContent
          return (
            <div key={slide.id} className={`bg-white border-2 rounded-2xl p-5 shadow-sm transition-all ${isComplete ? 'border-brand-200' : 'border-dashed border-slate-200'}`}>
              <div className="flex items-start gap-3 mb-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${isComplete ? 'bg-brand-500 text-white' : 'bg-slate-200 text-slate-400'}`}>
                  {i + 1}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-slate-900 text-sm">{slide.title}</div>
                  {!isComplete && <div className="text-xs text-slate-400 mt-0.5">Complete Block {slide.block} activities to populate this slide</div>}
                </div>
                {isComplete && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">✓ Ready</span>}
              </div>
              {slideContent && <div className="ml-11">{slideContent}</div>}
            </div>
          )
        })}
      </div>

      <div className="mt-6 bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center text-sm text-slate-500">
        <div className="font-bold text-slate-700 mb-1">3-Minute Pitch</div>
        Each slide = ~20 seconds. Walk the client through your strategy from situation to creative to future roadmap. Keep it sharp, keep it confident.
      </div>
    </div>
  )
}
