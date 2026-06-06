import { useState } from 'react'
import { useWorkspaceStore } from '../../store/workspace'
import { TARGETING_OPTIONS, BUDGET_CATEGORIES, ACTIVITY_DISPLAY_NUM, BRAND_CONTEXT } from '../../data/workshop'
import { ActivityCard, FeedbackPanel, Alert, MultiChoice, CharCount, confirmSubmit } from '../ui/shared'
import type { Brand } from '../../types'

const N = ACTIVITY_DISPLAY_NUM

export function Block5() {
  const { team, scores, responses, updateScore, updateResponse, lockActivity } = useWorkspaceStore()
  const isViewer = useWorkspaceStore(s => s.isViewer)
  const brand = (team?.brand || 'Nike') as Brand
  const context = BRAND_CONTEXT[brand]

  // ── B5A1: Audience Targeting ──────────────────────────────
  const a1Locked = !!(responses['b5a1_locked'])
  const [a1Demo, setA1Demo] = useState<string[]>((responses['b5a1_demo'] as string[]) || [])
  const [a1Interests, setA1Interests] = useState<string[]>((responses['b5a1_interests'] as string[]) || [])
  const [a1Behaviours, setA1Behaviours] = useState<string[]>((responses['b5a1_behaviours'] as string[]) || [])
  const [a1Retargeting, setA1Retargeting] = useState<string[]>((responses['b5a1_retargeting'] as string[]) || [])

  const submitA1 = () => {
    const total = a1Demo.length + a1Interests.length + a1Behaviours.length + a1Retargeting.length
    const hasColdAudience = a1Demo.length > 0 || a1Interests.length > 0
    const hasWarmAudience = a1Retargeting.length > 0
    const cPts = total >= 5 ? 2 : total >= 2 ? 1 : 0
    const qPts = Math.min(3, (hasColdAudience ? 1 : 0) + (hasWarmAudience ? 1 : 0) + (a1Behaviours.length > 0 ? 1 : 0))
    updateScore('b5a1', Math.min(5, cPts + qPts), 5, cPts, qPts)
    updateResponse({ b5a1_demo: a1Demo, b5a1_interests: a1Interests, b5a1_behaviours: a1Behaviours, b5a1_retargeting: a1Retargeting, b5a1_locked: true })
    lockActivity('b5a1')
  }

  // ── B5A2: Budget Allocation (100 points) ─────────────────
  const a2Locked = !!(responses['b5a2_locked'])
  const [a2Budget, setA2Budget] = useState<Record<string, number>>(
    (responses['b5a2_budget'] as Record<string, number>) || {}
  )
  const [a2Rationale, setA2Rationale] = useState<string>((responses['b5a2_rationale'] as string) || '')
  const a2Total = Object.values(a2Budget).reduce((s, v) => s + v, 0)

  const submitA2 = () => {
    const totalOk = a2Total === 100
    const hasRationale = a2Rationale.trim().length >= 30
    const cPts = totalOk && hasRationale ? 2 : totalOk || hasRationale ? 1 : 0
    const qPts = Math.min(3, (totalOk ? 1 : 0) + (hasRationale ? 1 : 0) + (a2Rationale.length >= 80 ? 1 : 0))
    updateScore('b5a2', Math.min(5, cPts + qPts), 5, cPts, qPts)
    updateResponse({ b5a2_budget: a2Budget, b5a2_rationale: a2Rationale, b5a2_locked: true })
    lockActivity('b5a2')
  }

  // ── B5A3: Social Commerce Journey ────────────────────────
  const a3Locked = !!(responses['b5a3_locked'])
  const JOURNEY_STAGES_SC = [
    { id: 'content', label: 'Content Discovery', desc: 'How does the customer first encounter your brand?' },
    { id: 'engagement', label: 'Engagement', desc: 'What triggers them to interact with the content?' },
    { id: 'commerce', label: 'Commerce Moment', desc: 'Where does the purchase intent form?' },
    { id: 'purchase', label: 'Purchase', desc: 'How does the transaction complete?' },
  ]
  const STAGE_OPTIONS: Record<string, { id: string; label: string }[]> = {
    content: [
      { id: 'organic_reel', label: 'Organic Reel in feed' },
      { id: 'influencer_post', label: 'Influencer post recommendation' },
      { id: 'paid_ad', label: 'Paid social ad' },
      { id: 'search_discovery', label: 'TikTok/Instagram search' },
    ],
    engagement: [
      { id: 'save_post', label: 'Save post for later' },
      { id: 'click_profile', label: 'Visit brand profile' },
      { id: 'comment_question', label: 'Ask question in comments' },
      { id: 'share_friend', label: 'Share to friend' },
    ],
    commerce: [
      { id: 'shoppable_tag', label: 'Click shoppable product tag' },
      { id: 'link_bio', label: 'Link in bio / Linktree' },
      { id: 'swipe_up', label: 'Story swipe-up to product' },
      { id: 'dm_enquiry', label: 'DM to enquire about product' },
    ],
    purchase: [
      { id: 'in_app', label: 'Complete in-app (Instagram/TikTok Shop)' },
      { id: 'website', label: 'Complete on brand website' },
      { id: 'direct_message', label: 'Purchase via DM' },
      { id: 'store', label: 'Visit physical store' },
    ],
  }
  const [a3Journey, setA3Journey] = useState<Record<string, string>>(
    (responses['b5a3_journey'] as Record<string, string>) || {}
  )
  const [a3Note, setA3Note] = useState<string>((responses['b5a3_note'] as string) || '')

  const submitA3 = () => {
    const stagesComplete = JOURNEY_STAGES_SC.filter(s => a3Journey[s.id]).length
    const cPts = stagesComplete >= 4 ? 2 : stagesComplete >= 2 ? 1 : 0
    const hasNote = a3Note.trim().length >= 20
    const qPts = Math.min(3, (stagesComplete >= 4 ? 1 : 0) + (hasNote ? 1 : 0) + (a3Journey['purchase'] === 'in_app' ? 1 : 0))
    updateScore('b5a3', Math.min(5, cPts + qPts), 5, cPts, qPts)
    updateResponse({ b5a3_journey: a3Journey, b5a3_note: a3Note, b5a3_locked: true })
    lockActivity('b5a3')
  }

  return (
    <div>
      {/* B5A1: Audience Targeting */}
      <ActivityCard number={N.b5a1} title="Audience Targeting" subtitle="Build your paid social targeting strategy" points={scores.b5a1?.points || 0} locked={a1Locked}>
        <Alert type="info">🎯 Build a targeting strategy for <strong>{brand}</strong>. A strong paid campaign combines cold audience targeting (new people) with warm retargeting (known people).</Alert>
        <div className="space-y-5 mb-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Demographics (select relevant)</div>
            <div className="text-[10px] text-slate-400 mb-2">{brand} audience: {context.audience}</div>
            <MultiChoice disabled={a1Locked || isViewer} selected={a1Demo} onChange={setA1Demo} max={5}
              options={TARGETING_OPTIONS.demographics.map(o => ({ id: o.id, label: o.label }))} />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Interests (select up to 4)</div>
            <MultiChoice disabled={a1Locked || isViewer} selected={a1Interests} onChange={setA1Interests} max={4}
              options={TARGETING_OPTIONS.interests.map(o => ({ id: o.id, label: o.label }))} />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Behaviours (select relevant)</div>
            <MultiChoice disabled={a1Locked || isViewer} selected={a1Behaviours} onChange={setA1Behaviours}
              options={TARGETING_OPTIONS.behaviours.map(o => ({ id: o.id, label: o.label }))} />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Retargeting (select relevant)</div>
            <MultiChoice disabled={a1Locked || isViewer} selected={a1Retargeting} onChange={setA1Retargeting}
              options={TARGETING_OPTIONS.retargeting.map(o => ({ id: o.id, label: o.label }))} />
          </div>
        </div>
        {!a1Locked && !isViewer && (
          <button className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-700 disabled:opacity-50"
            onClick={() => confirmSubmit(submitA1)} disabled={a1Demo.length + a1Interests.length + a1Retargeting.length < 3}>
            Submit Targeting
          </button>
        )}
        {a1Locked && scores.b5a1 && (
          <FeedbackPanel score={scores.b5a1.points} max={5}
            completionPts={scores.b5a1.completionPts} qualityPts={scores.b5a1.qualityPts}
            why="Quality: combining cold audience (demographics + interests) with warm retargeting. Behavioural targeting adds the third layer of precision."
            example={`${brand} targeting: Demographics (${context.audience.split(' ').slice(0,3).join(' ')}), Interests (relevant to ${context.industry}), Behaviours (Engaged Shoppers + App Users), Retargeting (Website Visitors 30 days + Video Viewers 75%). This full-funnel approach serves different messages to cold and warm audiences.`}
            keyLearning={[
              'Cold audiences (interest/demo targeting) need awareness messaging — don\'t send them to a product page.',
              'Warm retargeting audiences convert 3–5x higher than cold — they already know the brand.',
              'Lookalike audiences find new people who behave like your best customers.',
              'Behavioural targeting (online shoppers, app users) beats interest targeting for conversion campaigns.',
            ]}
          />
        )}
      </ActivityCard>

      {/* B5A2: Budget Allocation */}
      <ActivityCard number={N.b5a2} title="Budget Allocation" subtitle="Allocate 100 points across social media investment areas" points={scores.b5a2?.points || 0} locked={a2Locked}>
        <Alert type="info">💰 Distribute 100 budget points across the five investment areas for <strong>{brand}</strong>. Total must equal 100.</Alert>
        <div className="space-y-3 mb-3">
          {BUDGET_CATEGORIES.map(cat => {
            const val = a2Budget[cat.id] || 0
            return (
              <div key={cat.id} className="flex items-center gap-3">
                <div className="w-40 flex-shrink-0">
                  <div className="text-sm font-semibold text-slate-800">{cat.label}</div>
                  <div className="text-[10px] text-slate-400">{cat.desc}</div>
                </div>
                <input type="range" min={0} max={60} step={5} disabled={a2Locked || isViewer} value={val}
                  onChange={e => setA2Budget(prev => ({ ...prev, [cat.id]: parseInt(e.target.value) }))}
                  className="flex-1 accent-brand-500" />
                <span className="font-bold text-sm w-8 text-right">{val}</span>
              </div>
            )
          })}
        </div>
        <div className={`flex justify-between items-center px-4 py-2.5 rounded-lg font-bold text-sm mb-3 ${a2Total === 100 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : a2Total > 100 ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
          <span>Total</span><span>{a2Total}/100 points {a2Total === 100 ? '✓' : ''}</span>
        </div>
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 block">Rationale</label>
        <textarea disabled={a2Locked || isViewer} value={a2Rationale}
          onChange={e => setA2Rationale(e.target.value)}
          placeholder={`Explain your allocation priorities for ${brand} — why does content/paid/influencers get more or less? (min 30 chars)`}
          rows={3}
          className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-400 resize-none disabled:bg-slate-50 mb-1" />
        <CharCount value={a2Rationale} min={30} max={250} />
        {!a2Locked && !isViewer && (
          <button className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-700 disabled:opacity-50 mt-2"
            onClick={() => confirmSubmit(submitA2)} disabled={a2Total !== 100 || a2Rationale.trim().length < 30}>
            Submit Budget
          </button>
        )}
        {!a2Locked && !isViewer && (
          <div className="text-xs text-amber-600 mt-1">{a2Total !== 100 ? `Allocations must total 100 (currently ${a2Total})` : a2Rationale.trim().length < 30 ? 'Add your rationale before submitting' : ''}</div>
        )}
        {a2Locked && scores.b5a2 && (
          <FeedbackPanel score={scores.b5a2.points} max={5}
            completionPts={scores.b5a2.completionPts} qualityPts={scores.b5a2.qualityPts}
            why="Quality: total = 100, rationale explains strategic reasoning, rationale depth."
            example={`Strong allocation for ${brand}: Content Creation 30% (foundation of everything), Paid Social 35% (amplification), Influencers 20% (trust & reach), Community 10% (long-term growth), Analytics 5% (measurement). Rationale: content-first because without great content, paid spend is wasted.`}
            keyLearning={[
              'Paid social amplifies great content — if the content is weak, more spend makes it worse.',
              'Analytics is often under-resourced — you can\'t optimise what you don\'t measure.',
              'Community management is an investment in long-term retention, not short-term acquisition.',
              'Influencer budgets should be tied to campaign objectives — awareness vs. conversion need different tiers.',
            ]}
          />
        )}
      </ActivityCard>

      {/* B5A3: Social Commerce Journey */}
      <ActivityCard number={N.b5a3} title="Social Commerce Journey" subtitle="Map the customer path from content to purchase" points={scores.b5a3?.points || 0} locked={a3Locked}>
        <Alert type="info">🛒 Map the most likely customer journey for <strong>{brand}</strong> from first seeing content to completing a purchase. Select one option per stage.</Alert>
        <div className="space-y-4 mb-4">
          {JOURNEY_STAGES_SC.map(stage => {
            const pick = a3Journey[stage.id]
            const options = STAGE_OPTIONS[stage.id]
            return (
              <div key={stage.id} className="border border-slate-200 rounded-xl p-4">
                <div className="font-bold text-slate-900 text-sm mb-0.5">{stage.label}</div>
                <div className="text-xs text-slate-500 mb-3">{stage.desc}</div>
                <div className="space-y-1.5">
                  {options.map(opt => (
                    <button key={opt.id} disabled={a3Locked || isViewer}
                      onClick={() => setA3Journey(prev => ({ ...prev, [stage.id]: opt.id }))}
                      className={`w-full text-left px-3 py-2 rounded-lg border-2 text-sm transition-all ${pick === opt.id ? 'border-brand-500 bg-brand-50 text-brand-800' : 'border-slate-200 hover:border-brand-300 text-slate-700'} ${(a3Locked || isViewer) ? 'cursor-default' : ''}`}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 block">Key insight from this journey</label>
        <textarea disabled={a3Locked || isViewer} value={a3Note}
          onChange={e => setA3Note(e.target.value)}
          placeholder={`What does this journey tell you about how to optimise ${brand}'s social commerce? Where are the biggest friction points?`}
          rows={3}
          className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-400 resize-none disabled:bg-slate-50 mb-1" />
        <CharCount value={a3Note} min={20} max={250} />
        {!a3Locked && !isViewer && (
          <button className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-700 disabled:opacity-50 mt-2"
            onClick={() => confirmSubmit(submitA3)} disabled={JOURNEY_STAGES_SC.some(s => !a3Journey[s.id])}>
            Submit Journey
          </button>
        )}
        {a3Locked && scores.b5a3 && (
          <FeedbackPanel score={scores.b5a3.points} max={5}
            completionPts={scores.b5a3.completionPts} qualityPts={scores.b5a3.qualityPts}
            why="Quality: completing all 4 stages, including in-app purchase (lowest friction), and providing insight into journey friction."
            example={`${brand} optimal journey: Paid Ad (targeted awareness) → Save post (high-intent signal) → Shoppable product tag (zero-friction discovery) → Complete in-app (Instagram/TikTok Shop removes purchase barriers). Key insight: every additional click between discovery and purchase reduces conversion by ~20%.`}
            keyLearning={[
              'In-app social commerce removes the biggest friction point — leaving the platform.',
              'Saves are the strongest purchase intent signal — users who save are 3x more likely to buy.',
              'The journey from organic discovery to purchase should have as few steps as possible.',
              'Shoppable content has a longer conversion window than paid ads — users return days later.',
            ]}
          />
        )}
      </ActivityCard>
    </div>
  )
}
