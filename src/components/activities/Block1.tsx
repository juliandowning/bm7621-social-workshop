import { useState, useMemo } from 'react'
import { useWorkspaceStore } from '../../store/workspace'
import { PROS_CONS_STATEMENTS, JOURNEY_ACTIVITIES, JOURNEY_STAGES, PLATFORMS_TO_CATEGORISE, PLATFORM_CATEGORIES_LIST } from '../../data/workshop'
import { ActivityCard, FeedbackPanel, Alert, confirmSubmit } from '../ui/shared'

export function Block1() {
  const { scores, responses, updateScore, updateResponse, lockActivity } = useWorkspaceStore()
  const isViewer = useWorkspaceStore(s => s.isViewer)

  // ── A1: Pros & Cons ─────────────────────────────────────────
  const a1Locked = !!(responses['b1a1_locked'])
  const [a1Picks, setA1Picks] = useState<Record<string, string>>((responses['b1a1_picks'] as Record<string, string>) || {})
  const shuffled = useMemo(() => {
    const arr = [...PROS_CONS_STATEMENTS]
    for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[arr[i], arr[j]] = [arr[j], arr[i]] }
    return arr
  }, [])

  const submitA1 = () => {
    const correct = PROS_CONS_STATEMENTS.filter(s => a1Picks[s.id] === s.correct).length
    const pts = Math.round(correct / PROS_CONS_STATEMENTS.length * 5)
    updateScore('b1a1', pts, 5)
    updateResponse({ b1a1_picks: a1Picks, b1a1_locked: true })
    lockActivity('b1a1')
  }

  // ── A2: Journey Mapping ──────────────────────────────────────
  const a2Locked = !!(responses['b1a2_locked'])
  const [a2Map, setA2Map] = useState<Record<string, string>>((responses['b1a2_map'] as Record<string, string>) || {})

  const submitA2 = () => {
    const correct = JOURNEY_ACTIVITIES.filter(a => a2Map[a.id] === a.stage).length
    const pts = Math.round(correct / JOURNEY_ACTIVITIES.length * 5)
    updateScore('b1a2', pts, 5)
    updateResponse({ b1a2_map: a2Map, b1a2_locked: true })
    lockActivity('b1a2')
  }

  // ── A3: Platform Classification ──────────────────────────────
  const a3Locked = !!(responses['b1a3_locked'])
  const [a3Map, setA3Map] = useState<Record<string, string>>((responses['b1a3_map'] as Record<string, string>) || {})

  const submitA3 = () => {
    const correct = PLATFORMS_TO_CATEGORISE.filter(p => a3Map[p.id] === p.correct).length
    const pts = Math.round(correct / PLATFORMS_TO_CATEGORISE.length * 5)
    updateScore('b1a3', pts, 5)
    updateResponse({ b1a3_map: a3Map, b1a3_locked: true })
    lockActivity('b1a3')
  }

  return (
    <div>
      {/* A1 */}
      <ActivityCard number={1} title="Pros & Cons Challenge" subtitle="Classify each statement as a benefit or limitation of social media marketing" points={scores.b1a1?.points || 0} locked={a1Locked}>
        <Alert type="info">🃏 For each statement, decide: is this a <strong>Benefit</strong> or a <strong>Limitation</strong> of social media for Nike?</Alert>
        <div className="space-y-3 mb-4">
          {shuffled.map(stmt => {
            const pick = a1Picks[stmt.id]
            const showResult = a1Locked
            const isCorrect = pick === stmt.correct
            return (
              <div key={stmt.id} className={`border-2 rounded-xl p-3 transition-all ${showResult ? (isCorrect ? 'border-emerald-300 bg-emerald-50' : 'border-red-300 bg-red-50') : 'border-slate-200'}`}>
                <div className="text-sm font-medium text-slate-800 mb-2">{stmt.text}</div>
                <div className="flex gap-2">
                  {(['benefit', 'limitation'] as const).map(opt => (
                    <button key={opt} disabled={a1Locked || isViewer}
                      onClick={() => setA1Picks(prev => ({ ...prev, [stmt.id]: opt }))}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold capitalize border-2 transition-all ${pick === opt ? (opt === 'benefit' ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-red-500 bg-red-500 text-white') : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'} disabled:cursor-default`}>
                      {opt === 'benefit' ? '✓ Benefit' : '✗ Limitation'}
                    </button>
                  ))}
                  {showResult && !isCorrect && <span className="text-xs text-slate-500 flex items-center px-1 capitalize">→ {stmt.correct}</span>}
                </div>
              </div>
            )
          })}
        </div>
        {!a1Locked && !isViewer && (
          <button className="btn-success" onClick={() => confirmSubmit(submitA1)} disabled={Object.keys(a1Picks).length < PROS_CONS_STATEMENTS.length}>Submit Answers</button>
        )}
        {!a1Locked && !isViewer && Object.keys(a1Picks).length < PROS_CONS_STATEMENTS.length && (
          <div className="text-xs text-amber-600 mt-2">Classify all {PROS_CONS_STATEMENTS.length} statements first ({Object.keys(a1Picks).length}/{PROS_CONS_STATEMENTS.length})</div>
        )}
        {a1Locked && scores.b1a1 && (
          <FeedbackPanel score={scores.b1a1.points} max={5} why={`${PROS_CONS_STATEMENTS.filter(s => a1Picks[s.id] === s.correct).length}/${PROS_CONS_STATEMENTS.length} correctly classified. Benefits include direct engagement, community building, real-time feedback and UGC power. Limitations include reputation risk, algorithm dependency, declining organic reach and content saturation.`}
            keyLearning={['Social media benefits are most powerful when content is authentic and community-focused.', 'Declining organic reach (often below 2% on Facebook) means brands must combine organic and paid strategies.', 'Algorithm changes are outside your control — always diversify your channel mix.']} />
        )}
      </ActivityCard>

      {/* A2 */}
      <ActivityCard number={2} title="Customer Journey Mapping" subtitle="Match each Nike social activity to the correct customer journey stage" points={scores.b1a2?.points || 0} locked={a2Locked}>
        <Alert type="info">🗺️ Social media plays a different role at each stage of the Nike customer journey. Place each activity in the right stage.</Alert>
        <div className="space-y-3 mb-4">
          {JOURNEY_ACTIVITIES.map(act => {
            const pick = a2Map[act.id]
            const showResult = a2Locked
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
          <button className="btn-success" onClick={() => confirmSubmit(submitA2)} disabled={Object.keys(a2Map).length < 5}>Submit Answers</button>
        )}
        {a2Locked && scores.b1a2 && (
          <FeedbackPanel score={scores.b1a2.points} max={5} why={`${JOURNEY_ACTIVITIES.filter(a => a2Map[a.id] === a.stage).length}/${JOURNEY_ACTIVITIES.length} correctly placed.`}
            example="Awareness: Viral campaign, TikTok challenge. Consideration: Influencer review, product comparison. Purchase: Shoppable post, flash sale story. Loyalty: Nike Run Club, NikePlus content. Advocacy: #JustDoIt UGC campaign, referral programme."
            keyLearning={['Most brands over-invest in awareness and under-invest in loyalty and advocacy.', 'Social commerce (shoppable posts) has collapsed the gap between consideration and purchase.', 'UGC is the most powerful advocacy tool — customers become your marketing team.']} />
        )}
      </ActivityCard>

      {/* A3 */}
      <ActivityCard number={3} title="Platform Classification" subtitle="Assign each platform to its correct category" points={scores.b1a3?.points || 0} locked={a3Locked}>
        <Alert type="info">🏷️ Understanding platform types helps Nike choose the right channels. Each platform is built around a different primary behaviour.</Alert>
        <div className="space-y-3 mb-4">
          {PLATFORMS_TO_CATEGORISE.map(platform => {
            const pick = a3Map[platform.id]
            const showResult = a3Locked
            const isCorrect = pick === platform.correct
            return (
              <div key={platform.id} className={`border-2 rounded-xl p-3 flex items-center gap-3 ${showResult ? (isCorrect ? 'border-emerald-300 bg-emerald-50' : 'border-red-300 bg-red-50') : 'border-slate-200'}`}>
                <div className="text-sm font-bold text-slate-800 w-32 flex-shrink-0">{platform.name}</div>
                <select disabled={a3Locked || isViewer} value={pick || ''}
                  onChange={e => setA3Map(prev => ({ ...prev, [platform.id]: e.target.value }))}
                  className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand-400 disabled:bg-slate-50">
                  <option value="">Select category…</option>
                  {PLATFORM_CATEGORIES_LIST.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                {showResult && (isCorrect ? <span className="text-xs text-emerald-600">✓</span> : <span className="text-xs text-red-600 flex-shrink-0">→ {platform.correct}</span>)}
              </div>
            )
          })}
        </div>
        {!a3Locked && !isViewer && (
          <button className="btn-success" onClick={() => confirmSubmit(submitA3)} disabled={Object.keys(a3Map).length < PLATFORMS_TO_CATEGORISE.length}>Submit Answers</button>
        )}
        {a3Locked && scores.b1a3 && (
          <FeedbackPanel score={scores.b1a3.points} max={5} why={`${PLATFORMS_TO_CATEGORISE.filter(p => a3Map[p.id] === p.correct).length}/${PLATFORMS_TO_CATEGORISE.length} correctly categorised.`}
            example="Social Networking: Instagram, Facebook (connections and content). Video Sharing: YouTube, TikTok (entertainment and discovery). Professional Networking: LinkedIn (B2B). Social Commerce: Instagram Shopping, TikTok Shop (discovery to purchase). Community Platforms: WhatsApp Communities (peer groups)."
            keyLearning={['Platform category determines user mindset — LinkedIn users are in professional mode, TikTok users are in entertainment mode.', 'Social commerce platforms have collapsed the customer journey — discovery and purchase in one step.', 'For Nike\'s 18–24 female audience, TikTok and Instagram are the primary discovery platforms.']} />
        )}
      </ActivityCard>
    </div>
  )
}
