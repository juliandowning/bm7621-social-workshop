import { useState } from 'react'
import { useWorkspaceStore } from '../../store/workspace'
import { ATTENTION_POSTS, STOP_FACTORS, AUDIENCE_MOTIVATIONS, ETHICAL_SCENARIOS, COMMUNITY_TACTICS, ACTIVITY_DISPLAY_NUM } from '../../data/workshop'
import { ActivityCard, FeedbackPanel, Alert, MultiChoice, confirmSubmit } from '../ui/shared'
import type { Brand } from '../../types'

const N = ACTIVITY_DISPLAY_NUM

export function Block2() {
  const { team, scores, responses, updateScore, updateResponse, lockActivity } = useWorkspaceStore()
  const isViewer = useWorkspaceStore(s => s.isViewer)
  const brand = (team?.brand || 'Nike') as Brand
  const posts = ATTENTION_POSTS[brand]
  const audienceData = AUDIENCE_MOTIVATIONS[brand]

  // ── B2A1: Attention Audit ─────────────────────────────────
  const a1Locked = !!(responses['b2a1_locked'])
  const [a1Verdicts, setA1Verdicts] = useState<Record<string, 'stop' | 'scroll'>>(
    (responses['b2a1_verdicts'] as Record<string, 'stop' | 'scroll'>) || {}
  )
  const [a1Factors, setA1Factors] = useState<Record<string, string[]>>(
    (responses['b2a1_factors'] as Record<string, string[]>) || {}
  )

  const submitA1 = () => {
    const allDone = posts.every(p => a1Verdicts[p.id] && (a1Factors[p.id] || []).length > 0)
    const cPts = allDone ? 2 : Object.keys(a1Verdicts).length > 0 ? 1 : 0
    const qPts = Math.min(3, Object.values(a1Factors).reduce((s, f) => s + f.length, 0))
    updateScore('b2a1', Math.min(5, cPts + qPts), 5, cPts, Math.min(3, qPts))
    updateResponse({ b2a1_verdicts: a1Verdicts, b2a1_factors: a1Factors, b2a1_locked: true })
    lockActivity('b2a1')
  }

  // ── B2A2: Behaviour Mapping ───────────────────────────────
  const a2Locked = !!(responses['b2a2_locked'])
  const [a2Motivations, setA2Motivations] = useState<string[]>(
    (responses['b2a2_motivations'] as string[]) || []
  )
  const [a2PainPoints, setA2PainPoints] = useState<string[]>(
    (responses['b2a2_pain'] as string[]) || []
  )
  const [a2Platforms, setA2Platforms] = useState<string[]>(
    (responses['b2a2_platforms'] as string[]) || []
  )

  const submitA2 = () => {
    const motivationHits = a2Motivations.filter(m => audienceData.motivations.includes(m)).length
    const painHits = a2PainPoints.filter(p => audienceData.painPoints.includes(p)).length
    const platformHits = a2Platforms.filter(p => audienceData.platforms.includes(p)).length
    const total = motivationHits + painHits + platformHits
    const cPts = (a2Motivations.length > 0 && a2PainPoints.length > 0 && a2Platforms.length > 0) ? 2 : 1
    const qPts = Math.min(3, Math.round(total / (audienceData.motivations.length + audienceData.painPoints.length + audienceData.platforms.length) * 3))
    updateScore('b2a2', Math.min(5, cPts + qPts), 5, cPts, qPts)
    updateResponse({ b2a2_motivations: a2Motivations, b2a2_pain: a2PainPoints, b2a2_platforms: a2Platforms, b2a2_locked: true })
    lockActivity('b2a2')
  }

  // ── B2A3: Ethical Dilemma ─────────────────────────────────
  const a3Locked = !!(responses['b2a3_locked'])
  const [a3Picks, setA3Picks] = useState<Record<string, string>>(
    (responses['b2a3_picks'] as Record<string, string>) || {}
  )
  const [a3Score, setA3Score] = useState<number | null>(null)

  const submitA3 = () => {
    let correct = 0
    ETHICAL_SCENARIOS.forEach(scenario => {
      const pick = a3Picks[scenario.id]
      const correctOpts = scenario.options.filter(o => o.correct).map(o => o.id)
      if (correctOpts.includes(pick)) correct++
    })
    const cPts = Object.keys(a3Picks).length >= ETHICAL_SCENARIOS.length ? 2 : 1
    const qPts = Math.min(3, correct)
    updateScore('b2a3', Math.min(5, cPts + qPts), 5, cPts, qPts)
    updateResponse({ b2a3_picks: a3Picks, b2a3_locked: true })
    lockActivity('b2a3')
    setA3Score(correct)
  }

  // ── B2A4: Community Growth Strategy ──────────────────────
  const a4Locked = !!(responses['b2a4_locked'])
  const [a4Selected, setA4Selected] = useState<string[]>(
    (responses['b2a4_tactics'] as string[]) || []
  )

  const submitA4 = () => {
    const highImpact = a4Selected.filter(id => COMMUNITY_TACTICS.find(t => t.id === id)?.impact === 'high').length
    const cPts = a4Selected.length >= 3 ? 2 : a4Selected.length >= 1 ? 1 : 0
    const qPts = Math.min(3, highImpact)
    updateScore('b2a4', Math.min(5, cPts + qPts), 5, cPts, qPts)
    updateResponse({ b2a4_tactics: a4Selected, b2a4_locked: true })
    lockActivity('b2a4')
  }

  const ALL_MOTIVATIONS = ['Achievement', 'Self-improvement', 'Community belonging', 'Athletic identity', 'Entertainment escape', 'Social connection through shared shows', 'Discovery of new content', 'FOMO avoidance', 'Unique experiences', 'Value vs hotels', 'Local authenticity', 'Travel inspiration', 'Mood enhancement', 'Discovery of new music', 'Personal identity expression', 'Social sharing', 'Health improvement', 'Convenience', 'Sustainability values', 'Taste enjoyment']
  const ALL_PAIN_POINTS = ['Lack of motivation', 'Injury fear', 'Expensive kit', 'Too much choice', 'Subscription fatigue', 'Trust & safety concerns', 'Unexpected costs', 'Algorithm getting it wrong', 'Price vs regular juice', 'Sugar content concerns', 'Time constraints', 'Spoilers', 'Cancellation anxiety', 'Plastic packaging']
  const ALL_PLATFORMS = ['Instagram', 'TikTok', 'YouTube', 'Twitter/X', 'Facebook', 'LinkedIn', 'Pinterest', 'Snapchat', 'Reddit']

  return (
    <div>
      {/* B2A1: Attention Audit */}
      <ActivityCard number={N.b2a1} title="Attention Audit" subtitle="Analyse what makes social content stop the scroll" points={scores.b2a1?.points || 0} locked={a1Locked}>
        <Alert type="info">👁️ Review each {brand} social post concept. Would you <strong>Stop</strong> or <strong>Scroll</strong>? Then identify which attention factors explain why.</Alert>
        <div className="space-y-5 mb-4">
          {posts.map(post => {
            const verdict = a1Verdicts[post.id]
            const factors = a1Factors[post.id] || []
            return (
              <div key={post.id} className="border border-slate-200 rounded-xl p-4">
                <div className="bg-slate-50 rounded-lg p-3 text-sm text-slate-700 italic mb-3">"{post.description}"</div>
                <div className="mb-3">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Your reaction:</div>
                  <div className="flex gap-2">
                    {(['stop', 'scroll'] as const).map(v => (
                      <button key={v} disabled={a1Locked || isViewer}
                        onClick={() => setA1Verdicts(prev => ({ ...prev, [post.id]: v }))}
                        className={`flex-1 py-2 rounded-xl text-sm font-bold border-2 transition-all ${verdict === v ? (v === 'stop' ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-red-400 bg-red-400 text-white') : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'} ${(a1Locked || isViewer) ? 'cursor-default' : ''}`}>
                        {v === 'stop' ? '⏸ Stop' : '↓ Scroll'}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Why? (select all that apply)</div>
                  <div className="flex flex-wrap gap-2">
                    {STOP_FACTORS.map(factor => {
                      const selected = factors.includes(factor)
                      const isCorrect = a1Locked && post.stopFactors.includes(factor)
                      return (
                        <button key={factor} disabled={a1Locked || isViewer}
                          onClick={() => {
                            if (a1Locked || isViewer) return
                            setA1Factors(prev => ({
                              ...prev,
                              [post.id]: selected ? factors.filter(f => f !== factor) : [...factors, factor]
                            }))
                          }}
                          className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${selected ? 'border-brand-500 bg-brand-500 text-white' : 'border-slate-200 bg-white text-slate-600 hover:border-brand-300'} ${a1Locked && isCorrect ? 'ring-2 ring-emerald-400' : ''} ${(a1Locked || isViewer) ? 'cursor-default' : ''}`}>
                          {factor}
                        </button>
                      )
                    })}
                  </div>
                  {a1Locked && <div className="text-xs text-emerald-600 mt-1">Key factors: {post.stopFactors.join(', ')}</div>}
                </div>
              </div>
            )
          })}
        </div>
        {!a1Locked && !isViewer && (
          <button className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-700 disabled:opacity-50"
            onClick={() => confirmSubmit(submitA1)} disabled={posts.some(p => !a1Verdicts[p.id])}>
            Submit Answers
          </button>
        )}
        {a1Locked && scores.b2a1 && (
          <FeedbackPanel score={scores.b2a1.points} max={5}
            completionPts={scores.b2a1.completionPts} qualityPts={scores.b2a1.qualityPts}
            why="Completion: all posts reviewed. Quality: identifying correct attention factors for each post."
            example="The most scroll-stopping content combines at least 2 attention factors. For Nike: emotional resonance (identity) + surprise (unexpected framing) outperforms product shots that only have visual impact."
            keyLearning={[
              'Emotion + Surprise is the most powerful combination for stopping the scroll.',
              'Pure visual impact (beautiful product shots) rarely performs as well as emotionally-resonant content.',
              'Relevance is platform-specific — what resonates on TikTok may not work on LinkedIn.',
              'The first 1-2 seconds determine whether content is watched — the hook must come immediately.',
            ]}
          />
        )}
      </ActivityCard>

      {/* B2A2: Behaviour Mapping */}
      <ActivityCard number={N.b2a2} title="Behaviour Mapping" subtitle="Build an audience profile for your brand" points={scores.b2a2?.points || 0} locked={a2Locked}>
        <Alert type="info">👥 Select the motivations, pain points and preferred platforms that best describe <strong>{brand}'s</strong> target audience.</Alert>
        <div className="space-y-5 mb-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Key Motivations (select up to 4)</div>
            <MultiChoice disabled={a2Locked || isViewer} selected={a2Motivations} onChange={setA2Motivations} max={4}
              options={ALL_MOTIVATIONS.filter(m => audienceData.motivations.includes(m) || ['Achievement','Entertainment escape','Unique experiences','Mood enhancement','Health improvement','Community belonging'].includes(m)).map(m => ({ id: m, label: m }))} />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Key Pain Points (select up to 4)</div>
            <MultiChoice disabled={a2Locked || isViewer} selected={a2PainPoints} onChange={setA2PainPoints} max={4}
              options={ALL_PAIN_POINTS.slice(0, 8).map(p => ({ id: p, label: p }))} />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Primary Platforms (select up to 3)</div>
            <MultiChoice disabled={a2Locked || isViewer} selected={a2Platforms} onChange={setA2Platforms} max={3}
              options={ALL_PLATFORMS.map(p => ({ id: p, label: p }))} />
          </div>
        </div>
        {!a2Locked && !isViewer && (
          <button className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-700 disabled:opacity-50"
            onClick={() => confirmSubmit(submitA2)} disabled={a2Motivations.length === 0}>
            Submit Answers
          </button>
        )}
        {a2Locked && scores.b2a2 && (
          <FeedbackPanel score={scores.b2a2.points} max={5}
            completionPts={scores.b2a2.completionPts} qualityPts={scores.b2a2.qualityPts}
            why={`Quality based on how well your selections match ${brand}'s actual audience profile. Key motivations: ${audienceData.motivations.join(', ')}. Primary platforms: ${audienceData.platforms.join(', ')}.`}
            example={`${brand} audience: Motivations — ${audienceData.motivations.slice(0,2).join(', ')}. Pain points — ${audienceData.painPoints.slice(0,2).join(', ')}. Key platforms — ${audienceData.platforms.join(', ')}.`}
            keyLearning={[
              'Understanding motivation is more valuable than demographics — people in the same age group have wildly different motivations.',
              'Pain points are content opportunities — address the pain directly and you immediately become relevant.',
              'Platform choice should follow the audience, not habit — be where your specific audience actually is.',
              'Audience profiles should be updated regularly — motivations shift with culture and context.',
            ]}
          />
        )}
      </ActivityCard>

      {/* B2A3: Ethical Dilemma */}
      <ActivityCard number={N.b2a3} title="Ethical Dilemma Workshop" subtitle="Choose the right response to real social media ethics challenges" points={scores.b2a3?.points || 0} locked={a3Locked}>
        <Alert type="info">⚖️ For each scenario, choose the most ethical and legally appropriate response. Answers lock on submission.</Alert>
        <div className="space-y-5 mb-4">
          {ETHICAL_SCENARIOS.map(scenario => {
            const pick = a3Picks[scenario.id]
            const correctOpt = scenario.options.find(o => o.correct)
            return (
              <div key={scenario.id} className="border border-slate-200 rounded-xl p-4">
                <div className="font-bold text-slate-900 text-sm mb-1">{scenario.title}</div>
                <div className="text-sm text-slate-600 italic mb-3">{scenario.scenario}</div>
                <div className="space-y-2">
                  {scenario.options.map(opt => {
                    const selected = pick === opt.id
                    const showResult = a3Locked
                    const isCorrect = opt.correct
                    return (
                      <button key={opt.id} disabled={a3Locked || isViewer}
                        onClick={() => setA3Picks(prev => ({ ...prev, [scenario.id]: opt.id }))}
                        className={`w-full text-left p-3 rounded-xl border-2 text-sm transition-all ${selected ? 'border-brand-500 bg-brand-50' : 'border-slate-200 hover:border-brand-300'} ${showResult && isCorrect ? 'ring-2 ring-emerald-400' : ''} ${showResult && selected && !isCorrect ? 'border-red-400 bg-red-50' : ''} ${(a3Locked || isViewer) ? 'cursor-default' : ''}`}>
                        <div className={`font-medium ${selected ? 'text-brand-800' : 'text-slate-700'}`}>{opt.text}</div>
                        {showResult && isCorrect && <div className="text-xs text-emerald-600 mt-1">✓ {scenario.learning}</div>}
                      </button>
                    )
                  })}
                </div>
                {a3Locked && pick && !scenario.options.find(o => o.id === pick)?.correct && (
                  <div className="text-xs text-amber-600 mt-2">Better answer: {correctOpt?.text}</div>
                )}
              </div>
            )
          })}
        </div>
        {!a3Locked && !isViewer && (
          <button className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-700 disabled:opacity-50"
            onClick={() => confirmSubmit(submitA3)} disabled={Object.keys(a3Picks).length < ETHICAL_SCENARIOS.length}>
            Submit Answers
          </button>
        )}
        {a3Locked && a3Score !== null && scores.b2a3 && (
          <FeedbackPanel score={scores.b2a3.points} max={5}
            why={`${a3Score}/${ETHICAL_SCENARIOS.length} correct. Social media ethics are not just moral choices — they have legal and commercial consequences.`}
            example="ASA disclosure rules: '#ad' must be visible without scrolling. GDPR consent: email list consent ≠ ad targeting consent. Accessibility: captions serve 85% of users who watch without sound, plus all users with hearing impairment."
            keyLearning={[
              'ASA guidelines require clear, upfront disclosure of all paid partnerships — #ad must be prominent.',
              'GDPR consent is specific — consent for email marketing doesn\'t extend to ad retargeting.',
              'Accessibility is both ethical and commercial — captions increase reach by 80%.',
              'Ethical decisions protect the brand long-term — short-term gains from grey areas create serious risk.',
            ]}
          />
        )}
      </ActivityCard>

      {/* B2A4: Community Growth Strategy */}
      <ActivityCard number={N.b2a4} title="Community Growth Strategy" subtitle="Select community-building tactics for your brand" points={scores.b2a4?.points || 0} locked={a4Locked}>
        <Alert type="info">🌱 Choose the community-building tactics that best suit <strong>{brand}</strong>. Select at least 3 — prioritise high-impact approaches.</Alert>
        <div className="space-y-2 mb-4">
          {COMMUNITY_TACTICS.map(tactic => {
            const selected = a4Selected.includes(tactic.id)
            return (
              <button key={tactic.id} disabled={a4Locked || isViewer}
                onClick={() => {
                  if (a4Locked || isViewer) return
                  setA4Selected(prev => selected ? prev.filter(id => id !== tactic.id) : [...prev, tactic.id])
                }}
                className={`w-full text-left p-3 rounded-xl border-2 transition-all ${selected ? 'border-brand-500 bg-brand-50' : 'border-slate-200 hover:border-brand-300'} ${(a4Locked || isViewer) ? 'cursor-default' : ''}`}>
                <div className="flex items-start gap-3">
                  <div className={`w-4 h-4 border-2 rounded flex-shrink-0 mt-0.5 flex items-center justify-center ${selected ? 'border-brand-500 bg-brand-500' : 'border-slate-300'}`}>
                    {selected && <svg viewBox="0 0 12 12" className="w-3 h-3 fill-white"><path d="M10 3L5 8.5 2 5.5" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>}
                  </div>
                  <div className="flex-1">
                    <div className={`font-semibold text-sm ${selected ? 'text-brand-700' : 'text-slate-800'}`}>{tactic.label}</div>
                    <div className="text-xs text-slate-500">{tactic.desc}</div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${tactic.impact === 'high' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                    {tactic.impact} impact
                  </span>
                </div>
              </button>
            )
          })}
        </div>
        <div className="text-xs text-slate-400 mb-3">Selected: {a4Selected.length} tactics</div>
        {!a4Locked && !isViewer && (
          <button className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-700 disabled:opacity-50"
            onClick={() => confirmSubmit(submitA4)} disabled={a4Selected.length < 3}>
            Submit Strategy
          </button>
        )}
        {!a4Locked && a4Selected.length < 3 && !isViewer && <div className="text-xs text-amber-600 mt-2">Select at least 3 tactics</div>}
        {a4Locked && scores.b2a4 && (
          <FeedbackPanel score={scores.b2a4.points} max={5}
            completionPts={scores.b2a4.completionPts} qualityPts={scores.b2a4.qualityPts}
            why="Completion: 3+ tactics selected. Quality: prioritising high-impact tactics (UGC, challenges, groups, ambassador programmes) scores higher than low-impact selections."
            example={`For ${brand}: UGC Campaigns (turns customers into content creators, free authentic content), Hashtag Challenges (viral participation moments), Ambassador Programmes (deepest brand advocacy) — this combination builds community, generates content and creates advocates simultaneously.`}
            keyLearning={[
              'UGC is the most cost-effective community tactic — users create content for free that outperforms branded content.',
              'Challenges create cultural moments — participation is the point, not the prize.',
              'Ambassador programmes outperform one-off influencer deals because authenticity compounds over time.',
              'Community building takes 6–12 months — brands that quit early never see the return.',
            ]}
          />
        )}
      </ActivityCard>
    </div>
  )
}
