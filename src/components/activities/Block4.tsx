import { useState } from 'react'
import { useWorkspaceStore } from '../../store/workspace'
import { CONTENT_EXAMPLES, CAMPAIGN_PLATFORMS, CONTENT_FORMATS, INFLUENCER_TIERS, ACTIVITY_DISPLAY_NUM, BRAND_CONTEXT } from '../../data/workshop'
import { ActivityCard, FeedbackPanel, Alert, CharCount, confirmSubmit } from '../ui/shared'
import type { Brand } from '../../types'

const N = ACTIVITY_DISPLAY_NUM

export function Block4() {
  const { team, scores, responses, updateScore, updateResponse, lockActivity } = useWorkspaceStore()
  const isViewer = useWorkspaceStore(s => s.isViewer)
  const brand = (team?.brand || 'Nike') as Brand
  const examples = CONTENT_EXAMPLES[brand]
  const campaigns = CAMPAIGN_PLATFORMS[brand]

  // ── B4A1: 3-Second Test ───────────────────────────────────
  const a1Locked = !!(responses['b4a1_locked'])
  const [a1Verdicts, setA1Verdicts] = useState<Record<string, 'stop' | 'engage' | 'ignore'>>(
    (responses['b4a1_verdicts'] as Record<string, 'stop' | 'engage' | 'ignore'>) || {}
  )

  const submitA1 = () => {
    const all = examples.length
    const done = Object.keys(a1Verdicts).length
    const correct = examples.filter(e => a1Verdicts[e.id] === e.verdict).length
    const cPts = done >= all ? 2 : done >= 1 ? 1 : 0
    const qPts = Math.min(3, correct + Math.floor(correct / all))
    updateScore('b4a1', Math.min(5, cPts + qPts), 5, cPts, qPts)
    updateResponse({ b4a1_verdicts: a1Verdicts, b4a1_locked: true })
    lockActivity('b4a1')
  }

  // ── B4A2: Campaign Platform Workshop ─────────────────────
  const a2Locked = !!(responses['b4a2_locked'])
  const [a2Pick, setA2Pick] = useState<string>((responses['b4a2_campaign'] as string) || '')
  const [a2Name, setA2Name] = useState<string>((responses['b4a2_name'] as string) || '')
  const [a2Message, setA2Message] = useState<string>((responses['b4a2_message'] as string) || '')
  const [a2Promise, setA2Promise] = useState<string>((responses['b4a2_promise'] as string) || '')

  const submitA2 = () => {
    const hasCustom = a2Name.trim().length >= 5 && a2Message.trim().length >= 10
    const hasPlatform = !!a2Pick
    const cPts = hasCustom && hasPlatform ? 2 : hasPlatform || hasCustom ? 1 : 0
    const qPts = Math.min(3, (a2Name.trim().length >= 5 ? 1 : 0) + (a2Message.trim().length >= 20 ? 1 : 0) + (a2Promise.trim().length >= 20 ? 1 : 0))
    updateScore('b4a2', Math.min(5, cPts + qPts), 5, cPts, qPts)
    updateResponse({ b4a2_campaign: a2Pick, b4a2_name: a2Name, b4a2_message: a2Message, b4a2_promise: a2Promise, b4a2_locked: true })
    lockActivity('b4a2')
  }

  // ── B4A3: Content Mix Planning ────────────────────────────
  const a3Locked = !!(responses['b4a3_locked'])
  const [a3Mix, setA3Mix] = useState<Record<string, number>>(
    (responses['b4a3_mix'] as Record<string, number>) || {}
  )

  const a3Total = Object.values(a3Mix).reduce((s, v) => s + v, 0)

  const submitA3 = () => {
    const assigned = Object.values(a3Mix).filter(v => v > 0).length
    const totalOk = a3Total === 100
    const hasVideo = (a3Mix['reels'] || 0) + (a3Mix['livestreams'] || 0) > 0
    const cPts = assigned >= 4 && totalOk ? 2 : assigned >= 2 ? 1 : 0
    const qPts = Math.min(3, (totalOk ? 1 : 0) + (hasVideo ? 1 : 0) + (assigned >= 5 ? 1 : 0))
    updateScore('b4a3', Math.min(5, cPts + qPts), 5, cPts, qPts)
    updateResponse({ b4a3_mix: a3Mix, b4a3_locked: true })
    lockActivity('b4a3')
  }

  // ── B4A4: Influencer Selection ────────────────────────────
  const a4Locked = !!(responses['b4a4_locked'])
  const [a4Pick, setA4Pick] = useState<string>((responses['b4a4_tier'] as string) || '')
  const [a4Rationale, setA4Rationale] = useState<string>((responses['b4a4_rationale'] as string) || '')

  const submitA4 = () => {
    const hasPick = !!a4Pick
    const hasRationale = a4Rationale.trim().length >= 30
    const cPts = hasPick && hasRationale ? 2 : hasPick ? 1 : 0
    const qPts = Math.min(3, (hasPick ? 1 : 0) + (a4Rationale.length >= 60 ? 1 : 0) + (a4Rationale.length >= 100 ? 1 : 0))
    updateScore('b4a4', Math.min(5, cPts + qPts), 5, cPts, qPts)
    updateResponse({ b4a4_tier: a4Pick, b4a4_rationale: a4Rationale, b4a4_locked: true })
    lockActivity('b4a4')
  }

  const context = BRAND_CONTEXT[brand]

  return (
    <div>
      {/* B4A1: 3-Second Test */}
      <ActivityCard number={N.b4a1} title="3-Second Test" subtitle="Evaluate what makes content stop, engage or get ignored" points={scores.b4a1?.points || 0} locked={a1Locked}>
        <Alert type="info">⚡ You have 3 seconds. For each {brand} content example, decide: would you Stop, Engage or Ignore?</Alert>
        <div className="space-y-4 mb-4">
          {examples.map(example => {
            const pick = a1Verdicts[example.id]
            const showResult = a1Locked
            const isCorrect = pick === example.verdict
            return (
              <div key={example.id} className={`border-2 rounded-xl p-4 ${showResult ? (isCorrect ? 'border-emerald-300 bg-emerald-50' : 'border-amber-200 bg-amber-50') : 'border-slate-200'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-100 text-brand-700">{example.format}</span>
                </div>
                <div className="text-sm text-slate-700 italic mb-3">"{example.description}"</div>
                <div className="flex gap-2">
                  {(['stop', 'engage', 'ignore'] as const).map(v => (
                    <button key={v} disabled={a1Locked || isViewer}
                      onClick={() => setA1Verdicts(prev => ({ ...prev, [example.id]: v }))}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border-2 capitalize transition-all ${pick === v ? (v === 'stop' ? 'border-emerald-500 bg-emerald-500 text-white' : v === 'engage' ? 'border-brand-500 bg-brand-500 text-white' : 'border-slate-400 bg-slate-400 text-white') : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'} ${(a1Locked || isViewer) ? 'cursor-default' : ''}`}>
                      {v === 'stop' ? '⏸ Stop' : v === 'engage' ? '❤️ Engage' : '↓ Ignore'}
                    </button>
                  ))}
                </div>
                {showResult && (
                  <div className={`text-xs mt-2 ${isCorrect ? 'text-emerald-700' : 'text-amber-700'}`}>
                    {isCorrect ? '✓ ' : `Expected: ${example.verdict} — `}{example.reason}
                  </div>
                )}
              </div>
            )
          })}
        </div>
        {!a1Locked && !isViewer && (
          <button className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-700 disabled:opacity-50"
            onClick={() => confirmSubmit(submitA1)} disabled={Object.keys(a1Verdicts).length < examples.length}>
            Submit Answers
          </button>
        )}
        {a1Locked && scores.b4a1 && (
          <FeedbackPanel score={scores.b4a1.points} max={5}
            completionPts={scores.b4a1.completionPts} qualityPts={scores.b4a1.qualityPts}
            why="Content that combines emotional resonance with an immediate visual hook consistently outperforms polished but generic brand content."
            example={`For ${brand}: content that shows real people, real moments and brand personality outperforms product shots and announcements. The scroll-stopper is always the first frame — if the hook isn't in second 1, the content fails.`}
            keyLearning={[
              'The first frame is everything — content is judged in under a second.',
              'Relatability beats production quality — authentic moments outperform polished ads.',
              'Content that makes people feel something (any emotion) gets shared; content that informs gets scrolled.',
              'Platform context matters — the same content performs differently on TikTok vs Instagram.',
            ]}
          />
        )}
      </ActivityCard>

      {/* B4A2: Campaign Platform Workshop */}
      <ActivityCard number={N.b4a2} title="Campaign Platform Workshop" subtitle="Develop a unifying campaign concept for your brand" points={scores.b4a2?.points || 0} locked={a2Locked}>
        <Alert type="info">💡 Choose a campaign platform to build on, then make it your own by refining the name, core message and audience promise for <strong>{brand}</strong>.</Alert>

        <div className="mb-5">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Choose a starting point</div>
          <div className="space-y-2">
            {campaigns.map(campaign => (
              <button key={campaign.name} disabled={a2Locked || isViewer}
                onClick={() => {
                  if (a2Locked || isViewer) return
                  setA2Pick(campaign.name)
                  if (!a2Name) setA2Name(campaign.name)
                  if (!a2Message) setA2Message(campaign.message)
                  if (!a2Promise) setA2Promise(campaign.promise)
                }}
                className={`w-full text-left p-4 border-2 rounded-xl transition-all ${a2Pick === campaign.name ? 'border-brand-500 bg-brand-50' : 'border-slate-200 hover:border-brand-300'} ${(a2Locked || isViewer) ? 'cursor-default' : ''}`}>
                <div className={`font-bold text-sm mb-0.5 ${a2Pick === campaign.name ? 'text-brand-700' : 'text-slate-800'}`}>{campaign.name}</div>
                <div className="text-xs text-slate-500">{campaign.message}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4 mb-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 block">Campaign Name</label>
            <input disabled={a2Locked || isViewer} value={a2Name}
              onChange={e => setA2Name(e.target.value)}
              placeholder="e.g. Move More Together"
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-400 disabled:bg-slate-50" />
            <CharCount value={a2Name} min={5} max={50} />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 block">Core Message</label>
            <input disabled={a2Locked || isViewer} value={a2Message}
              onChange={e => setA2Message(e.target.value)}
              placeholder="The one sentence that captures your campaign idea"
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-400 disabled:bg-slate-50" />
            <CharCount value={a2Message} min={10} max={120} />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 block">Audience Promise</label>
            <input disabled={a2Locked || isViewer} value={a2Promise}
              onChange={e => setA2Promise(e.target.value)}
              placeholder="What does the brand promise to deliver through this campaign?"
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-400 disabled:bg-slate-50" />
            <CharCount value={a2Promise} min={10} max={120} />
          </div>
        </div>

        {!a2Locked && !isViewer && (
          <button className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-700 disabled:opacity-50"
            onClick={() => confirmSubmit(submitA2)} disabled={!a2Pick || a2Name.trim().length < 5}>
            Submit Campaign
          </button>
        )}
        {a2Locked && scores.b4a2 && (
          <FeedbackPanel score={scores.b4a2.points} max={5}
            completionPts={scores.b4a2.completionPts} qualityPts={scores.b4a2.qualityPts}
            why="A strong campaign platform has a memorable name, a clear message and a specific promise. The promise is most important — it tells the audience what they get."
            example={`${brand} example: "${campaigns[0].name}" — Name: memorable and action-oriented. Message: "${campaigns[0].message}" — specific and human. Promise: "${campaigns[0].promise}" — brand accountability, not just aspiration.`}
            keyLearning={[
              'A campaign platform is the big idea that connects all content — without it, content feels disconnected.',
              'The strongest names are action-oriented and emotionally resonant.',
              'The audience promise creates accountability — it should be something the brand can genuinely deliver.',
              'A good campaign platform can run for years and still feel fresh through different executions.',
            ]}
          />
        )}
      </ActivityCard>

      {/* B4A3: Content Mix Planning */}
      <ActivityCard number={N.b4a3} title="Content Mix Planning" subtitle="Allocate your content effort across formats (must total 100%)" points={scores.b4a3?.points || 0} locked={a3Locked}>
        <Alert type="info">📅 Distribute your content effort across formats for <strong>{brand}</strong>. Total must equal 100%. Consider your campaign platform and primary platforms.</Alert>
        <div className="space-y-3 mb-3">
          {CONTENT_FORMATS.map(format => {
            const val = a3Mix[format.id] || 0
            return (
              <div key={format.id} className="flex items-center gap-3">
                <div className="w-32 flex-shrink-0">
                  <div className="text-sm font-semibold text-slate-800">{format.label}</div>
                  <div className="text-[10px] text-slate-400 leading-tight">{format.desc}</div>
                </div>
                <input type="range" min={0} max={60} step={5} disabled={a3Locked || isViewer} value={val}
                  onChange={e => setA3Mix(prev => ({ ...prev, [format.id]: parseInt(e.target.value) }))}
                  className="flex-1 accent-brand-500" />
                <input type="number" min={0} max={60} step={5} disabled={a3Locked || isViewer} value={val}
                  onChange={e => setA3Mix(prev => ({ ...prev, [format.id]: parseInt(e.target.value) || 0 }))}
                  className="w-16 text-center font-bold border border-slate-200 rounded-lg py-1.5 text-sm outline-none focus:border-brand-400 disabled:bg-slate-50" />
                <span className="text-xs text-slate-400">%</span>
              </div>
            )
          })}
        </div>
        <div className={`flex justify-between items-center px-4 py-2.5 rounded-lg font-bold text-sm mb-3 ${a3Total === 100 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : a3Total > 100 ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
          <span>Total</span>
          <span>{a3Total}% {a3Total === 100 ? '✓' : a3Total > 100 ? '— over 100%' : `— ${100 - a3Total}% remaining`}</span>
        </div>
        {!a3Locked && !isViewer && (
          <button className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-700 disabled:opacity-50"
            onClick={() => confirmSubmit(submitA3)} disabled={a3Total !== 100}>
            Submit Mix
          </button>
        )}
        {!a3Locked && a3Total !== 100 && !isViewer && (
          <div className="text-xs text-amber-600 mt-2">Allocations must total exactly 100% before submitting</div>
        )}
        {a3Locked && scores.b4a3 && (
          <FeedbackPanel score={scores.b4a3.points} max={5}
            completionPts={scores.b4a3.completionPts} qualityPts={scores.b4a3.qualityPts}
            why="Completion: 4+ formats used with 100% total. Quality: including video formats (Reels/Livestreams), using 5+ formats, hitting 100% exactly."
            example={`Typical strong mix for ${brand}: Reels/Short Video 35% (highest algorithmic reach), Stories 20% (daily touchpoints), Static Posts 15% (brand consistency), Carousels 15% (educational/high engagement), Polls & Interactive 10% (community), UGC 5% (authenticity). Livestreams for major moments only.`}
            keyLearning={[
              'Short video (Reels, TikTok) should represent at least 30% of mix for most brands in 2025.',
              'Stories create daily presence without cluttering the main feed.',
              'Carousels have the highest save rate — save is the strongest engagement signal.',
              'UGC content performs better than brand content — allocate budget to facilitating it, not just using it.',
            ]}
          />
        )}
      </ActivityCard>

      {/* B4A4: Influencer Selection */}
      <ActivityCard number={N.b4a4} title="Influencer Selection" subtitle="Choose the right influencer tier for your brand strategy" points={scores.b4a4?.points || 0} locked={a4Locked}>
        <Alert type="info">🤝 Select the influencer tier that best fits <strong>{brand}'s</strong> strategy, then explain your rationale.</Alert>
        <div className="space-y-2 mb-4">
          {INFLUENCER_TIERS.map(tier => (
            <button key={tier.id} disabled={a4Locked || isViewer}
              onClick={() => !a4Locked && !isViewer && setA4Pick(tier.id)}
              className={`w-full text-left p-3.5 border-2 rounded-xl transition-all ${a4Pick === tier.id ? 'border-brand-500 bg-brand-50' : 'border-slate-200 hover:border-brand-300'} ${(a4Locked || isViewer) ? 'cursor-default' : ''}`}>
              <div className={`font-bold text-sm ${a4Pick === tier.id ? 'text-brand-700' : 'text-slate-800'}`}>{tier.label}</div>
              <div className="text-xs text-slate-500 mt-0.5">{tier.desc}</div>
              <div className="text-[10px] text-brand-600 mt-1">Best for: {tier.best}</div>
            </button>
          ))}
        </div>
        <div className="mb-4">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 block">Why is this right for {brand}?</label>
          <textarea disabled={a4Locked || isViewer} value={a4Rationale}
            onChange={e => setA4Rationale(e.target.value)}
            placeholder={`Explain why this influencer tier aligns with ${brand}'s audience, tone and campaign goals... (min 30 chars)`}
            rows={3}
            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-400 resize-none disabled:bg-slate-50" />
          <CharCount value={a4Rationale} min={30} max={300} />
        </div>
        {!a4Locked && !isViewer && (
          <button className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-700 disabled:opacity-50"
            onClick={() => confirmSubmit(submitA4)} disabled={!a4Pick || a4Rationale.trim().length < 30}>
            Submit Strategy
          </button>
        )}
        {a4Locked && scores.b4a4 && (
          <FeedbackPanel score={scores.b4a4.points} max={5}
            completionPts={scores.b4a4.completionPts} qualityPts={scores.b4a4.qualityPts}
            why="Completion: tier selected with rationale. Quality: depth of rationale and alignment with brand strategy."
            example={`${brand}: ${context.tone} tone suggests Micro or Nano influencers for authenticity, or Brand Ambassador for long-term consistency. ${brand}'s audience (${context.audience}) trusts niche voices over celebrity endorsements. Celebrity partnerships work for major launches but micro-influencers drive higher purchase intent.`}
            keyLearning={[
              'Micro-influencers (10K–100K) have 60% higher engagement rates than macro-influencers.',
              'Celebrity partnerships build awareness but rarely drive direct purchase — they\'re brand signals.',
              'The right tier depends on objective: awareness = macro, authenticity = nano/micro, sustained growth = ambassador.',
              'One ambassador is often more valuable than ten one-off posts — relationship depth beats volume.',
            ]}
          />
        )}
      </ActivityCard>
    </div>
  )
}
