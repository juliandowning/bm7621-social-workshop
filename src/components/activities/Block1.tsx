import { useState } from 'react'
import { useWorkspaceStore } from '../../store/workspace'
import { PROS_CONS_STATEMENTS, JOURNEY_ACTIVITIES, JOURNEY_STAGES, PLATFORMS_TO_CATEGORISE, PLATFORM_CATEGORIES_LIST, ACTIVITY_DISPLAY_NUM } from '../../data/workshop'
import { ActivityCard, FeedbackPanel, Alert, confirmSubmit } from '../ui/shared'

const N = ACTIVITY_DISPLAY_NUM

export function Block1() {
  const { team, scores, responses, updateScore, updateResponse, lockActivity } = useWorkspaceStore()
  const isViewer = useWorkspaceStore(s => s.isViewer)

  // ── B1A1: Pros & Cons Card Sort ──────────────────────────────
  const a1Locked = !!(responses['b1a1_locked'])
  const [a1Picks, setA1Picks] = useState<Record<string, string>>(
    (responses['b1a1_picks'] as Record<string, string>) || {}
  )
  const [a1Fb, setA1Fb] = useState<{ correct: number; total: number } | null>(null)

  const submitA1 = () => {
    const correct = PROS_CONS_STATEMENTS.filter(s => a1Picks[s.id] === s.correct).length
    const attempted = Object.keys(a1Picks).length
    const cPts = attempted >= PROS_CONS_STATEMENTS.length ? 2 : attempted >= 5 ? 1 : 0
    const qPts = Math.min(3, Math.round(correct / PROS_CONS_STATEMENTS.length * 3))
    const pts = cPts + qPts
    updateScore('b1a1', pts, 5, cPts, qPts)
    updateResponse({ b1a1_picks: a1Picks, b1a1_locked: true })
    lockActivity('b1a1')
    setA1Fb({ correct, total: PROS_CONS_STATEMENTS.length })
  }

  // ── B1A2: Customer Journey Mapping ───────────────────────────
  const a2Locked = !!(responses['b1a2_locked'])
  const [a2Map, setA2Map] = useState<Record<string, string>>(
    (responses['b1a2_map'] as Record<string, string>) || {}
  )
  const [a2Fb, setA2Fb] = useState<{ correct: number } | null>(null)

  const submitA2 = () => {
    const correct = JOURNEY_ACTIVITIES.filter(a => a2Map[a.id] === a.stage).length
    const attempted = Object.keys(a2Map).length
    const cPts = attempted >= JOURNEY_ACTIVITIES.length ? 2 : attempted >= 5 ? 1 : 0
    const qPts = Math.min(3, Math.round(correct / JOURNEY_ACTIVITIES.length * 3))
    updateScore('b1a2', cPts + qPts, 5, cPts, qPts)
    updateResponse({ b1a2_map: a2Map, b1a2_locked: true })
    lockActivity('b1a2')
    setA2Fb({ correct })
  }

  // ── B1A3: Platform Classification ────────────────────────────
  const a3Locked = !!(responses['b1a3_locked'])
  const [a3Map, setA3Map] = useState<Record<string, string>>(
    (responses['b1a3_map'] as Record<string, string>) || {}
  )
  const [a3Fb, setA3Fb] = useState<{ correct: number } | null>(null)

  const submitA3 = () => {
    const correct = PLATFORMS_TO_CATEGORISE.filter(p => a3Map[p.id] === p.correct).length
    const attempted = Object.keys(a3Map).length
    const cPts = attempted >= PLATFORMS_TO_CATEGORISE.length ? 2 : attempted >= 4 ? 1 : 0
    const qPts = Math.min(3, Math.round(correct / PLATFORMS_TO_CATEGORISE.length * 3))
    updateScore('b1a3', cPts + qPts, 5, cPts, qPts)
    updateResponse({ b1a3_map: a3Map, b1a3_locked: true })
    lockActivity('b1a3')
    setA3Fb({ correct })
  }

  const brand = team?.brand || 'Nike'

  return (
    <div>
      {/* B1A1: Pros & Cons */}
      <ActivityCard number={N.b1a1} title="Pros & Cons Challenge" subtitle="Classify each statement as a benefit or limitation of social media" points={scores.b1a1?.points || 0} locked={a1Locked}>
        <Alert type="info">🃏 For each statement, decide: is this a <strong>Benefit</strong> or a <strong>Limitation</strong> of social media for {brand}?</Alert>
        <div className="space-y-3 mb-4">
          {PROS_CONS_STATEMENTS.map(stmt => {
            const pick = a1Picks[stmt.id]
            const showResult = a1Locked && a1Fb
            const isCorrect = pick === stmt.correct
            return (
              <div key={stmt.id} className={`border-2 rounded-xl p-3 transition-all ${showResult ? (isCorrect ? 'border-emerald-300 bg-emerald-50' : 'border-red-300 bg-red-50') : 'border-slate-200'}`}>
                <div className="text-sm font-medium text-slate-800 mb-2">{stmt.text}</div>
                <div className="flex gap-2">
                  {['benefit', 'limitation'].map(opt => (
                    <button key={opt} disabled={a1Locked || isViewer}
                      onClick={() => setA1Picks(prev => ({ ...prev, [stmt.id]: opt }))}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold capitalize transition-all border-2 ${pick === opt ? (opt === 'benefit' ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-red-500 bg-red-500 text-white') : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'} ${(a1Locked || isViewer) ? 'cursor-default' : ''}`}>
                      {opt === 'benefit' ? '✓ Benefit' : '✗ Limitation'}
                    </button>
                  ))}
                  {showResult && <span className="text-xs font-bold px-2 flex items-center">{isCorrect ? '✓' : `→ ${stmt.correct}`}</span>}
                </div>
              </div>
            )
          })}
        </div>
        {!a1Locked && !isViewer && (
          <button className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-700 disabled:opacity-50"
            onClick={() => confirmSubmit(submitA1)} disabled={Object.keys(a1Picks).length < PROS_CONS_STATEMENTS.length}>
            Submit Answers
          </button>
        )}
        {!a1Locked && Object.keys(a1Picks).length < PROS_CONS_STATEMENTS.length && (
          <div className="text-xs text-amber-600 mt-2">Classify all {PROS_CONS_STATEMENTS.length} statements before submitting ({Object.keys(a1Picks).length}/{PROS_CONS_STATEMENTS.length} done)</div>
        )}
        {a1Locked && a1Fb && (
          <FeedbackPanel score={scores.b1a1?.points || 0} max={5}
            completionPts={scores.b1a1?.completionPts} qualityPts={scores.b1a1?.qualityPts}
            why={`${a1Fb.correct}/${a1Fb.total} correctly classified. Social media has genuine benefits (direct engagement, community building, real-time feedback) and real limitations (reputation risk, algorithm dependency, content saturation).`}
            example="Benefit: Direct customer engagement — brands like Nike can respond to individual customers at scale, building loyalty that was previously impossible. Limitation: Algorithm dependency — organic reach has dropped by ~60% over 5 years, making brands increasingly dependent on paid promotion."
            keyLearning={[
              'Social media\'s benefits are most powerful when content is authentic and community-focused.',
              'Reputation risk is real — a single viral complaint can damage years of brand building.',
              'Content saturation means quality beats quantity — fewer, better posts outperform high-volume output.',
              'Algorithm changes are outside your control — diversify channels to avoid single-platform dependency.',
            ]}
          />
        )}
      </ActivityCard>

      {/* B1A2: Customer Journey Mapping */}
      <ActivityCard number={N.b1a2} title="Customer Journey Mapping" subtitle="Match each social media activity to the correct customer journey stage" points={scores.b1a2?.points || 0} locked={a2Locked}>
        <Alert type="info">🗺️ Place each social media activity at the right stage of the customer journey for <strong>{brand}</strong>.</Alert>
        <div className="space-y-3 mb-4">
          {JOURNEY_ACTIVITIES.map(act => {
            const pick = a2Map[act.id]
            const showResult = a2Locked && a2Fb
            const isCorrect = pick === act.stage
            return (
              <div key={act.id} className={`border-2 rounded-xl p-3 ${showResult ? (isCorrect ? 'border-emerald-300 bg-emerald-50' : 'border-red-300 bg-red-50') : 'border-slate-200'}`}>
                <div className="text-sm font-medium text-slate-800 mb-2">{act.text}</div>
                <select disabled={a2Locked || isViewer} value={pick || ''}
                  onChange={e => setA2Map(prev => ({ ...prev, [act.id]: e.target.value }))}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand-400 disabled:bg-slate-50">
                  <option value="">Select stage…</option>
                  {JOURNEY_STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                {showResult && !isCorrect && <div className="text-xs text-red-600 mt-1">→ Correct: {act.stage}</div>}
              </div>
            )
          })}
        </div>
        {!a2Locked && !isViewer && (
          <button className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-700 disabled:opacity-50"
            onClick={() => confirmSubmit(submitA2)} disabled={Object.keys(a2Map).length < JOURNEY_ACTIVITIES.length}>
            Submit Answers
          </button>
        )}
        {a2Locked && a2Fb && (
          <FeedbackPanel score={scores.b1a2?.points || 0} max={5}
            completionPts={scores.b1a2?.completionPts} qualityPts={scores.b1a2?.qualityPts}
            why={`${a2Fb.correct}/${JOURNEY_ACTIVITIES.length} correctly placed. Social media plays a different role at each stage — from broad awareness to advocacy.`}
            example="Awareness: Viral video campaign (broad reach, no purchase intent). Consideration: Influencer review content (trusted comparison). Purchase: Shoppable Instagram post (frictionless checkout). Loyalty: Exclusive member community (retention). Advocacy: UGC campaign (turns customers into creators)."
            keyLearning={[
              'Different content types serve different journey stages — mismatch reduces effectiveness.',
              'Most brands over-invest in Awareness and under-invest in Loyalty and Advocacy.',
              'Social commerce (shoppable posts) has collapsed the gap between Consideration and Purchase.',
              'Advocacy content from real customers is more trusted than any brand-produced content.',
            ]}
          />
        )}
      </ActivityCard>

      {/* B1A3: Platform Classification */}
      <ActivityCard number={N.b1a3} title="Platform Classification" subtitle="Assign each platform to its correct category" points={scores.b1a3?.points || 0} locked={a3Locked}>
        <Alert type="info">🏷️ Match each social platform to its primary category. Understanding platform types helps choose the right channels for {brand}.</Alert>
        <div className="space-y-3 mb-4">
          {PLATFORMS_TO_CATEGORISE.map(platform => {
            const pick = a3Map[platform.id]
            const showResult = a3Locked && a3Fb
            const isCorrect = pick === platform.correct
            return (
              <div key={platform.id} className={`border-2 rounded-xl p-3 flex items-center gap-3 ${showResult ? (isCorrect ? 'border-emerald-300 bg-emerald-50' : 'border-red-300 bg-red-50') : 'border-slate-200'}`}>
                <div className="text-sm font-bold text-slate-800 w-24 flex-shrink-0">{platform.name}</div>
                <select disabled={a3Locked || isViewer} value={pick || ''}
                  onChange={e => setA3Map(prev => ({ ...prev, [platform.id]: e.target.value }))}
                  className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand-400 disabled:bg-slate-50">
                  <option value="">Select category…</option>
                  {PLATFORM_CATEGORIES_LIST.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                {showResult && !isCorrect && <div className="text-xs text-red-600 flex-shrink-0">→ {platform.correct}</div>}
                {showResult && isCorrect && <div className="text-xs text-emerald-600 flex-shrink-0">✓</div>}
              </div>
            )
          })}
        </div>
        {!a3Locked && !isViewer && (
          <button className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-700 disabled:opacity-50"
            onClick={() => confirmSubmit(submitA3)} disabled={Object.keys(a3Map).length < PLATFORMS_TO_CATEGORISE.length}>
            Submit Answers
          </button>
        )}
        {a3Locked && a3Fb && (
          <FeedbackPanel score={scores.b1a3?.points || 0} max={5}
            completionPts={scores.b1a3?.completionPts} qualityPts={scores.b1a3?.qualityPts}
            why={`${a3Fb.correct}/${PLATFORMS_TO_CATEGORISE.length} correctly categorised. Platform categories determine audience type, content format and commercial opportunity.`}
            example="Facebook = Social Networking (personal connections, groups). YouTube/TikTok = Video Sharing (entertainment, discovery). LinkedIn = Professional Networking. Pinterest = Social Commerce (high purchase intent). Reddit/Discord = Community Platforms (niche interest groups)."
            keyLearning={[
              'Platform category determines the audience mindset — LinkedIn users are in professional mode, TikTok users are in entertainment mode.',
              'Social commerce platforms (Pinterest, TikTok Shop) have the highest purchase intent.',
              'Community platforms (Reddit, Discord) require authenticity — overt marketing is rejected.',
              'Video sharing platforms reward completion rate — short, compelling content outperforms long-form.',
            ]}
          />
        )}
      </ActivityCard>
    </div>
  )
}
