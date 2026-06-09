import { useState } from 'react'
import { useWorkspaceStore } from '../../store/workspace'
import { TARGETING_OPTIONS, BUDGET_CATEGORIES, BUDGET_KEYWORDS, SOCIAL_COMMERCE_PLATFORMS, COMMERCE_KEYWORDS, OBJECTIVE_OPTIONS, calcQualityScore } from '../../data/workshop'
import { ActivityCard, FeedbackPanel, Alert, MultiChoice, CharCount, confirmSubmit } from '../ui/shared'

export function Block5() {
  const { scores, responses, updateScore, updateResponse, lockActivity } = useWorkspaceStore()
  const isViewer = useWorkspaceStore(s => s.isViewer)
  const objectives = (responses['b2a5_objectives'] as string[]) || []

  // A16: Targeting
  const a1Locked = !!(responses['b5a1_locked'])
  const [a1Demo, setA1Demo] = useState<string[]>((responses['b5a1_demo'] as string[]) || [])
  const [a1Interests, setA1Interests] = useState<string[]>((responses['b5a1_interests'] as string[]) || [])
  const [a1Behaviours, setA1Behaviours] = useState<string[]>((responses['b5a1_behaviours'] as string[]) || [])
  const [a1Retargeting, setA1Retargeting] = useState<string[]>((responses['b5a1_retargeting'] as string[]) || [])

  const submitA1 = () => {
    const recommended = (arr: string[], opts: { id: string; recommended: boolean }[]) => arr.filter(id => opts.find(o => o.id === id)?.recommended).length
    const score = recommended(a1Demo, TARGETING_OPTIONS.demographics) + recommended(a1Interests, TARGETING_OPTIONS.interests) + recommended(a1Behaviours, TARGETING_OPTIONS.behaviours) + (a1Retargeting.length >= 2 ? 2 : a1Retargeting.length)
    const pts = Math.min(5, score)
    updateScore('b5a1', pts, 5)
    updateResponse({ b5a1_demo: a1Demo, b5a1_interests: a1Interests, b5a1_behaviours: a1Behaviours, b5a1_retargeting: a1Retargeting, b5a1_locked: true })
    lockActivity('b5a1')
  }

  // A17: Budget
  const a2Locked = !!(responses['b5a2_locked'])
  const [a2Budget, setA2Budget] = useState<Record<string, number>>((responses['b5a2_budget'] as Record<string, number>) || {})
  const [a2Rationale, setA2Rationale] = useState<string>((responses['b5a2_rationale'] as string) || '')
  const a2Total = Object.values(a2Budget).reduce((s, v) => s + v, 0)

  // Objective cascade - suggested budget split
  const suggestedBudget = objectives.length > 0
    ? objectives.reduce((acc, id) => {
        const obj = OBJECTIVE_OPTIONS.find(o => o.id === id)
        if (!obj) return acc
        return Object.fromEntries(Object.entries(obj.cascades.budget).map(([k, v]) => [k, Math.round(((acc[k] || 0) + v) / (objectives.indexOf(id) + 1))]))
      }, {} as Record<string, number>)
    : null

  const submitA2 = () => {
    const totalOk = a2Total === 100
    const pts = Math.min(5, (totalOk ? 2 : 0) + calcQualityScore(a2Rationale, BUDGET_KEYWORDS))
    updateScore('b5a2', pts, 5)
    updateResponse({ b5a2_budget: a2Budget, b5a2_rationale: a2Rationale, b5a2_locked: true })
    lockActivity('b5a2')
  }

  // A18: Social Commerce
  const a3Locked = !!(responses['b5a3_locked'])
  const [a3Selected, setA3Selected] = useState<string[]>((responses['b5a3_platforms'] as string[]) || [])
  const [a3Rationale, setA3Rationale] = useState<string>((responses['b5a3_rationale'] as string) || '')

  const submitA3 = () => {
    const highFit = a3Selected.filter(id => SOCIAL_COMMERCE_PLATFORMS.find(p => p.id === id)?.nikeFit === 'high').length
    const pts = Math.min(5, highFit + calcQualityScore(a3Rationale, COMMERCE_KEYWORDS))
    updateScore('b5a3', pts, 5)
    updateResponse({ b5a3_platforms: a3Selected, b5a3_rationale: a3Rationale, b5a3_locked: true })
    lockActivity('b5a3')
  }

  return (
    <div>
      {/* A16: Targeting */}
      <ActivityCard number={16} title="Audience Targeting" subtitle="Build Nike's paid social targeting strategy — feeds your Agency Pitch" points={scores.b5a1?.points || 0} locked={a1Locked} isPitch>
        <Alert type="info">🎯 Build Nike's targeting stack. A strong strategy combines cold audiences (new people) with warm retargeting (people who already know Nike).</Alert>
        <div className="space-y-4 mb-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Demographics</div>
            <div className="text-[10px] text-slate-400 mb-2">Nike brief: 18–24 female, UK + US</div>
            <MultiChoice disabled={a1Locked || isViewer} selected={a1Demo} onChange={setA1Demo} max={5}
              options={TARGETING_OPTIONS.demographics.map(o => ({ id: o.id, label: o.label + (o.recommended ? ' ✓' : '') }))} />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Interests (up to 4)</div>
            <MultiChoice disabled={a1Locked || isViewer} selected={a1Interests} onChange={setA1Interests} max={4}
              options={TARGETING_OPTIONS.interests.map(o => ({ id: o.id, label: o.label + (o.recommended ? ' ✓' : '') }))} />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Behaviours</div>
            <MultiChoice disabled={a1Locked || isViewer} selected={a1Behaviours} onChange={setA1Behaviours} max={4}
              options={TARGETING_OPTIONS.behaviours.map(o => ({ id: o.id, label: o.label + (o.recommended ? ' ✓' : '') }))} />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Retargeting (warm audiences)</div>
            <MultiChoice disabled={a1Locked || isViewer} selected={a1Retargeting} onChange={setA1Retargeting} max={5}
              options={TARGETING_OPTIONS.retargeting.map(o => ({ id: o.id, label: o.label + (o.recommended ? ' ✓' : '') }))} />
          </div>
        </div>
        <div className="text-[10px] text-slate-400 mb-3">✓ = recommended for Nike's brief</div>
        {!a1Locked && !isViewer && <button className="btn-success" onClick={() => confirmSubmit(submitA1)} disabled={a1Demo.length + a1Interests.length < 3}>Submit Targeting</button>}
        {a1Locked && scores.b5a1 && <FeedbackPanel score={scores.b5a1.points} max={5}
          why="Quality based on selecting recommended options for Nike's 18–24 female brief and including retargeting audiences."
          keyLearning={['Cold audiences (demographics + interests) need awareness messaging — don\'t send them straight to product pages.', 'Warm retargeting converts 3–5x higher than cold — they already know Nike.', 'Lookalike audiences based on NikePlus members finds new people who behave like your best customers.']} />}
      </ActivityCard>

      {/* A17: Budget */}
      <ActivityCard number={17} title="Budget Allocation" subtitle="Allocate 100 budget points for Nike's social campaign — feeds your Agency Pitch" points={scores.b5a2?.points || 0} locked={a2Locked} isPitch>
        {suggestedBudget && !a2Locked && (
          <div className="bg-brand-50 border border-brand-200 rounded-xl p-3 mb-4 text-xs text-brand-700">
            <strong>Based on your objectives</strong>, suggested starting point: {Object.entries(suggestedBudget).map(([k, v]) => `${k} ${v}%`).join(' · ')}
            <button onClick={() => setA2Budget(suggestedBudget)} className="ml-2 underline hover:no-underline">Apply suggestion</button>
          </div>
        )}
        <Alert type="info">💰 Distribute 100 points across 5 investment areas. Total must equal exactly 100. Then explain your rationale.</Alert>
        <div className="space-y-3 mb-3">
          {BUDGET_CATEGORIES.map(cat => {
            const val = a2Budget[cat.id] || 0
            return (
              <div key={cat.id} className="flex items-center gap-3">
                <div className="w-36 flex-shrink-0">
                  <div className="text-sm font-semibold text-slate-800">{cat.label}</div>
                  <div className="text-[10px] text-slate-400">{cat.desc}</div>
                </div>
                <input type="range" min={0} max={60} step={5} disabled={a2Locked || isViewer} value={val}
                  onChange={e => setA2Budget(prev => ({ ...prev, [cat.id]: parseInt(e.target.value) }))}
                  className="flex-1 accent-brand-500" />
                <span className="font-bold text-sm w-8 text-right text-slate-700">{val}</span>
              </div>
            )
          })}
        </div>
        <div className={`flex justify-between items-center px-4 py-2.5 rounded-xl font-bold text-sm mb-4 ${a2Total === 100 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : a2Total > 100 ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
          <span>Total</span><span>{a2Total}/100 {a2Total === 100 ? '✓' : a2Total > 100 ? '— over budget' : `— ${100 - a2Total} remaining`}</span>
        </div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Budget Rationale</label>
        <textarea disabled={a2Locked || isViewer} value={a2Rationale} onChange={e => setA2Rationale(e.target.value)}
          placeholder="Explain your allocation priorities — why does content/paid/influencers get more or less? Reference your objectives and the 70/20/10 framework..."
          rows={3} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-400 resize-none disabled:bg-slate-50 mb-1" />
        <CharCount value={a2Rationale} min={40} max={300} />
        {!a2Locked && !isViewer && <button className="btn-success mt-2" onClick={() => confirmSubmit(submitA2)} disabled={a2Total !== 100 || a2Rationale.trim().length < 40}>Submit Budget</button>}
        {!a2Locked && !isViewer && <div className="text-xs text-amber-600 mt-1">{a2Total !== 100 ? `Total must be 100 (currently ${a2Total})` : a2Rationale.trim().length < 40 ? 'Add your rationale before submitting' : ''}</div>}
        {a2Locked && scores.b5a2 && <FeedbackPanel score={scores.b5a2.points} max={5}
          why="Scored on: total = 100 (required) + rationale quality (keyword bank: ROAS, CPA, content-first, amplify, organic, paid, funnel, 70/20/10, objective, attribution, etc)."
          example="Strong rationale: Content 30% (foundation — paid amplification only works with great content), Paid Social 35% (primary acquisition engine for objectives), Influencers 20% (trust-building with 18–24 audience), Community 10% (long-term retention), Analytics 5% (can\'t optimise what you don\'t measure)."
          keyLearning={['Paid social amplifies great content — if the content is weak, more spend makes it worse.', 'The 70/20/10 rule: 70% proven channels, 20% scaling experiments, 10% pure R&D.', 'Analytics is chronically under-resourced — you can\'t optimise what you don\'t measure.']} />}
      </ActivityCard>

      {/* A18: Social Commerce */}
      <ActivityCard number={18} title="Social Commerce Strategy" subtitle="Choose Nike's social commerce activation — feeds your Agency Pitch" points={scores.b5a3?.points || 0} locked={a3Locked} isPitch>
        <Alert type="info">🛒 Social commerce collapses discovery and purchase into one experience. Select the platforms Nike should activate and explain your strategy.</Alert>
        <div className="space-y-3 mb-4">
          {SOCIAL_COMMERCE_PLATFORMS.map(platform => {
            const selected = a3Selected.includes(platform.id)
            return (
              <button key={platform.id} disabled={a3Locked || isViewer}
                onClick={() => { if (!a3Locked && !isViewer) setA3Selected(prev => selected ? prev.filter(id => id !== platform.id) : [...prev, platform.id]) }}
                className={`w-full text-left p-4 border-2 rounded-xl transition-all ${selected ? 'border-brand-500 bg-brand-50' : 'border-slate-200 hover:border-brand-300'} disabled:cursor-default`}>
                <div className="flex items-start gap-3">
                  <div className={`w-4 h-4 border-2 rounded flex-shrink-0 mt-0.5 flex items-center justify-center ${selected ? 'border-brand-500 bg-brand-500' : 'border-slate-300'}`}>
                    {selected && <svg viewBox="0 0 12 12" className="w-3 h-3 fill-white"><path d="M10 3L5 8.5 2 5.5" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className={`font-bold text-sm ${selected ? 'text-brand-700' : 'text-slate-800'}`}>{platform.name}</div>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${platform.nikeFit === 'high' ? 'bg-emerald-100 text-emerald-700' : platform.nikeFit === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>{platform.nikeFit} Nike fit</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">{platform.desc}</div>
                    <div className="text-xs text-brand-600 mt-1">{platform.strength}</div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Social Commerce Rationale</label>
        <textarea disabled={a3Locked || isViewer} value={a3Rationale} onChange={e => setA3Rationale(e.target.value)}
          placeholder="Explain why these platforms work for Nike's 18–24 female audience and how they fit your campaign strategy. Reference frictionless purchase, in-app checkout, creator commerce..."
          rows={3} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-400 resize-none disabled:bg-slate-50 mb-1" />
        <CharCount value={a3Rationale} min={40} max={300} />
        {!a3Locked && !isViewer && <button className="btn-success mt-2" onClick={() => confirmSubmit(submitA3)} disabled={a3Selected.length === 0 || a3Rationale.trim().length < 40}>Submit Strategy</button>}
        {a3Locked && scores.b5a3 && <FeedbackPanel score={scores.b5a3.points} max={5}
          why="Quality based on selecting high Nike-fit platforms + rationale quality (keyword bank: frictionless, in-app, checkout, discovery, purchase, TikTok Shop, Instagram Shopping, live commerce, creator, affiliate, impulse, etc)."
          keyLearning={['In-app social commerce removes the biggest friction point — leaving the platform.', 'Every additional click between discovery and purchase loses ~20% of users.', 'Creator affiliate commerce turns influencers into zero-risk performance-based sales channels.']} />}
      </ActivityCard>
    </div>
  )
}
