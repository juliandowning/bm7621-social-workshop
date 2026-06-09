import { useState } from 'react'
import { useWorkspaceStore } from '../../store/workspace'
import { ATTENTION_POSTS, STOP_FACTORS, AUDIENCE_MOTIVATIONS, AUDIENCE_PAIN_POINTS, AUDIENCE_PLATFORMS, ETHICAL_SCENARIOS, COMMUNITY_TACTICS, OBJECTIVE_OPTIONS, calcQualityScore, CAMPAIGN_KEYWORDS } from '../../data/workshop'
import { ActivityCard, FeedbackPanel, Alert, MultiChoice, confirmSubmit } from '../ui/shared'

export function Block2() {
  const { scores, responses, updateScore, updateResponse, lockActivity } = useWorkspaceStore()
  const isViewer = useWorkspaceStore(s => s.isViewer)

  // A4 Attention Audit
  const a1Locked = !!(responses['b2a1_locked'])
  const [a1Verdicts, setA1Verdicts] = useState<Record<string, string>>((responses['b2a1_verdicts'] as Record<string, string>) || {})
  const [a1Factors, setA1Factors] = useState<Record<string, string[]>>((responses['b2a1_factors'] as Record<string, string[]>) || {})

  const submitA1 = () => {
    const correct = ATTENTION_POSTS.filter(p => a1Verdicts[p.id] === p.verdict).length
    const totalFactors = Object.values(a1Factors).reduce((s, f) => s + f.length, 0)
    const pts = Math.min(5, Math.round(correct / ATTENTION_POSTS.length * 3) + Math.min(2, Math.floor(totalFactors / 3)))
    updateScore('b2a1', pts, 5)
    updateResponse({ b2a1_verdicts: a1Verdicts, b2a1_factors: a1Factors, b2a1_locked: true })
    lockActivity('b2a1')
  }

  // A5 Behaviour Mapping (PITCH)
  const a2Locked = !!(responses['b2a2_locked'])
  const [a2Motivations, setA2Motivations] = useState<string[]>((responses['b2a2_motivations'] as string[]) || [])
  const [a2Pain, setA2Pain] = useState<string[]>((responses['b2a2_pain'] as string[]) || [])
  const [a2Platforms, setA2Platforms] = useState<string[]>((responses['b2a2_platforms'] as string[]) || [])

  const submitA2 = () => {
    const motivHits = a2Motivations.filter(m => AUDIENCE_MOTIVATIONS.find(o => o.id === m)?.correct).length
    const painHits = a2Pain.filter(p => AUDIENCE_PAIN_POINTS.find(o => o.id === p)?.correct).length
    const platHits = a2Platforms.filter(p => AUDIENCE_PLATFORMS.find(o => o.id === p)?.correct).length
    const pts = Math.min(5, motivHits + painHits + platHits)
    updateScore('b2a2', pts, 5)
    updateResponse({ b2a2_motivations: a2Motivations, b2a2_pain: a2Pain, b2a2_platforms: a2Platforms, b2a2_locked: true })
    lockActivity('b2a2')
  }

  // A6 Ethical Dilemma
  const a3Locked = !!(responses['b2a3_locked'])
  const [a3Picks, setA3Picks] = useState<Record<string, string>>((responses['b2a3_picks'] as Record<string, string>) || {})

  const submitA3 = () => {
    const correct = ETHICAL_SCENARIOS.filter(s => {
      const correctOpts = s.options.filter(o => o.correct).map(o => o.id)
      return correctOpts.includes(a3Picks[s.id])
    }).length
    const pts = Math.min(5, Math.round(correct / ETHICAL_SCENARIOS.length * 5))
    updateScore('b2a3', pts, 5)
    updateResponse({ b2a3_picks: a3Picks, b2a3_locked: true })
    lockActivity('b2a3')
  }

  // A7 Community Growth (PITCH)
  const a4Locked = !!(responses['b2a4_locked'])
  const [a4Selected, setA4Selected] = useState<string[]>((responses['b2a4_tactics'] as string[]) || [])

  const submitA4 = () => {
    const highImpact = a4Selected.filter(id => COMMUNITY_TACTICS.find(t => t.id === id)?.impact === 'high').length
    const medImpact = a4Selected.filter(id => COMMUNITY_TACTICS.find(t => t.id === id)?.impact === 'medium').length
    const hasMix = highImpact >= 1 && medImpact >= 1
    const pts = Math.min(5, highImpact + (hasMix ? 1 : 0) + (a4Selected.length >= 4 ? 1 : 0))
    updateScore('b2a4', pts, 5)
    updateResponse({ b2a4_tactics: a4Selected, b2a4_locked: true })
    lockActivity('b2a4')
  }

  // A8 Campaign Objectives (PITCH)
  const a5Locked = !!(responses['b2a5_locked'])
  const [a5Selected, setA5Selected] = useState<string[]>((responses['b2a5_objectives'] as string[]) || [])

  const submitA5 = () => {
    const pts = Math.min(5, a5Selected.length >= 2 ? a5Selected.length + 1 : a5Selected.length)
    updateScore('b2a5', pts, 5)
    updateResponse({ b2a5_objectives: a5Selected, b2a5_locked: true })
    lockActivity('b2a5')
  }

  const objectives = a5Selected.length > 0 ? a5Selected : []

  return (
    <div>
      {/* A4: Attention Audit */}
      <ActivityCard number={4} title="Attention Audit" subtitle="Stop or scroll? Analyse what makes Nike content earn attention" points={scores.b2a1?.points || 0} locked={a1Locked}>
        <Alert type="info">👁️ Review each Nike content concept. Would you <strong>Stop</strong> or <strong>Scroll</strong>? Then identify which attention factors made you decide.</Alert>
        <div className="space-y-5 mb-4">
          {ATTENTION_POSTS.map(post => {
            const verdict = a1Verdicts[post.id]
            const factors = a1Factors[post.id] || []
            const showResult = a1Locked
            const isCorrect = verdict === post.verdict
            return (
              <div key={post.id} className={`border-2 rounded-xl p-4 ${showResult ? (isCorrect ? 'border-emerald-300 bg-emerald-50' : 'border-amber-200 bg-amber-50') : 'border-slate-200'}`}>
                <div className="text-[10px] font-bold uppercase tracking-wider text-brand-600 mb-1">{post.format}</div>
                <div className="bg-white border border-slate-100 rounded-xl p-3 text-sm text-slate-700 italic mb-3">"{post.description}"</div>
                <div className="flex gap-2 mb-3">
                  {(['stop', 'scroll'] as const).map(v => (
                    <button key={v} disabled={a1Locked || isViewer}
                      onClick={() => setA1Verdicts(prev => ({ ...prev, [post.id]: v }))}
                      className={`flex-1 py-2 rounded-xl text-sm font-bold border-2 transition-all ${verdict === v ? (v === 'stop' ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-red-400 bg-red-400 text-white') : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'} disabled:cursor-default`}>
                      {v === 'stop' ? '⏸ Stop' : '↓ Scroll'}
                    </button>
                  ))}
                </div>
                {showResult && <div className={`text-xs mb-2 font-semibold ${isCorrect ? 'text-emerald-700' : 'text-amber-700'}`}>{isCorrect ? '✓ Correct' : `Expected: ${post.verdict}`} — Key factors: {post.stopFactors.join(', ')}</div>}
                <div className="flex flex-wrap gap-1.5">
                  {STOP_FACTORS.map(factor => {
                    const sel = factors.includes(factor)
                    return (
                      <button key={factor} disabled={a1Locked || isViewer}
                        onClick={() => {
                          if (a1Locked || isViewer) return
                          setA1Factors(prev => ({ ...prev, [post.id]: sel ? factors.filter(f => f !== factor) : [...factors, factor] }))
                        }}
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${sel ? 'border-brand-500 bg-brand-500 text-white' : 'border-slate-200 bg-white text-slate-600 hover:border-brand-300'} disabled:cursor-default`}>
                        {factor}
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
        {!a1Locked && !isViewer && <button className="btn-success" onClick={() => confirmSubmit(submitA1)} disabled={ATTENTION_POSTS.some(p => !a1Verdicts[p.id])}>Submit Answers</button>}
        {a1Locked && scores.b2a1 && <FeedbackPanel score={scores.b2a1.points} max={5}
          why="Quality based on correctly identifying stop vs scroll and identifying the dominant attention factors. Emotion + Surprise is the most powerful combination."
          keyLearning={['The first frame determines everything — content is judged in under a second.', 'Emotion beats production quality — authentic moments outperform polished ads.', 'Relevance is platform-specific — what stops the scroll on TikTok differs from Instagram.', 'Nike\'s strongest content makes people feel something, not just know something.']} />}
      </ActivityCard>

      {/* A5: Behaviour Mapping - PITCH */}
      <ActivityCard number={5} title="Behaviour Mapping" subtitle="Build Nike's audience profile — feeds your Agency Pitch" points={scores.b2a2?.points || 0} locked={a2Locked} isPitch>
        <Alert type="info">👥 Select the motivations, pain points and platforms that best describe Nike's 18–24 female target audience. This feeds directly into your pitch.</Alert>
        <div className="space-y-4 mb-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Key Motivations (select up to 4)</div>
            <MultiChoice disabled={a2Locked || isViewer} selected={a2Motivations} onChange={setA2Motivations} max={4}
              options={AUDIENCE_MOTIVATIONS.map(o => ({ id: o.id, label: o.label }))} />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Key Pain Points (select up to 3)</div>
            <MultiChoice disabled={a2Locked || isViewer} selected={a2Pain} onChange={setA2Pain} max={3}
              options={AUDIENCE_PAIN_POINTS.map(o => ({ id: o.id, label: o.label }))} />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Primary Platforms (select up to 3)</div>
            <MultiChoice disabled={a2Locked || isViewer} selected={a2Platforms} onChange={setA2Platforms} max={3}
              options={AUDIENCE_PLATFORMS.map(o => ({ id: o.id, label: o.label }))} />
          </div>
        </div>
        {!a2Locked && !isViewer && <button className="btn-success" onClick={() => confirmSubmit(submitA2)} disabled={a2Motivations.length === 0}>Submit Profile</button>}
        {a2Locked && scores.b2a2 && <FeedbackPanel score={scores.b2a2.points} max={5}
          why="Nike's 18–24 female audience is motivated by achievement, identity and community. Their pain points centre on motivation and authenticity scepticism. Their primary platforms are Instagram and TikTok."
          example="Strong profile: Motivations — Achievement, Identity, Inspiration, Community. Pain points — Motivation gaps, Scepticism of corporate brands, Expense. Platforms — Instagram, TikTok, YouTube."
          keyLearning={['Motivation drives behaviour more than demographics — two 22-year-olds can have completely different motivations.', 'Nike\'s audience is sceptical of corporate advertising — authenticity is non-negotiable.', 'Platform choice must follow the audience, not habit.']} />}
      </ActivityCard>

      {/* A6: Ethical Dilemma */}
      <ActivityCard number={6} title="Ethical Dilemma Workshop" subtitle="Choose the right response to real Nike social media ethics challenges" points={scores.b2a3?.points || 0} locked={a3Locked}>
        <Alert type="info">⚖️ Three scenarios. Choose the most ethical and legally appropriate response for Nike in each.</Alert>
        <div className="space-y-5 mb-4">
          {ETHICAL_SCENARIOS.map(scenario => {
            const pick = a3Picks[scenario.id]
            return (
              <div key={scenario.id} className="border border-slate-200 rounded-xl p-4">
                <div className="font-bold text-slate-900 text-sm mb-1">{scenario.title}</div>
                <div className="text-sm text-slate-600 italic mb-3 bg-slate-50 rounded-lg p-3">{scenario.scenario}</div>
                <div className="space-y-2">
                  {scenario.options.map(opt => {
                    const selected = pick === opt.id
                    return (
                      <button key={opt.id} disabled={a3Locked || isViewer}
                        onClick={() => setA3Picks(prev => ({ ...prev, [scenario.id]: opt.id }))}
                        className={`w-full text-left p-3 rounded-xl border-2 text-sm transition-all ${selected ? 'border-brand-500 bg-brand-50' : 'border-slate-200 hover:border-brand-300'} ${a3Locked && opt.correct ? 'ring-2 ring-emerald-400' : ''} ${a3Locked && selected && !opt.correct ? 'border-red-300 bg-red-50' : ''} disabled:cursor-default`}>
                        <div className={`font-medium ${selected ? 'text-brand-800' : 'text-slate-700'}`}>{opt.text}</div>
                        {a3Locked && opt.correct && <div className="text-xs text-emerald-700 mt-1">✓ {scenario.learning}</div>}
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
        {!a3Locked && !isViewer && <button className="btn-success" onClick={() => confirmSubmit(submitA3)} disabled={Object.keys(a3Picks).length < ETHICAL_SCENARIOS.length}>Submit Answers</button>}
        {a3Locked && scores.b2a3 && <FeedbackPanel score={scores.b2a3.points} max={5}
          why="Social media ethics have legal and commercial consequences — not just moral ones."
          keyLearning={['ASA requires clear upfront disclosure — #ad must be visible without scrolling.', 'Ethical targeting aligns with brand values — Nike is about empowerment, not body anxiety.', 'Accessibility is both ethical and commercial — captions increase reach by 85%.']} />}
      </ActivityCard>

      {/* A7: Community Growth - PITCH */}
      <ActivityCard number={7} title="Community Growth Strategy" subtitle="Select Nike's community-building tactics — feeds your Agency Pitch" points={scores.b2a4?.points || 0} locked={a4Locked} isPitch>
        <Alert type="info">🌱 Choose community tactics for Nike. A strong strategy mixes <strong>high-impact</strong> and <strong>medium-impact</strong> approaches — don't just pick all high-impact.</Alert>
        <div className="space-y-2 mb-4">
          {COMMUNITY_TACTICS.map(tactic => {
            const selected = a4Selected.includes(tactic.id)
            return (
              <button key={tactic.id} disabled={a4Locked || isViewer}
                onClick={() => { if (!a4Locked && !isViewer) setA4Selected(prev => selected ? prev.filter(id => id !== tactic.id) : [...prev, tactic.id]) }}
                className={`w-full text-left p-3 rounded-xl border-2 transition-all flex items-start gap-3 ${selected ? 'border-brand-500 bg-brand-50' : 'border-slate-200 hover:border-brand-300'} disabled:cursor-default`}>
                <div className={`w-4 h-4 border-2 rounded flex-shrink-0 mt-0.5 flex items-center justify-center ${selected ? 'border-brand-500 bg-brand-500' : 'border-slate-300'}`}>
                  {selected && <svg viewBox="0 0 12 12" className="w-3 h-3 fill-white"><path d="M10 3L5 8.5 2 5.5" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>}
                </div>
                <div className="flex-1">
                  <div className={`font-semibold text-sm ${selected ? 'text-brand-700' : 'text-slate-800'}`}>{tactic.label}</div>
                  <div className="text-xs text-slate-500">{tactic.desc}</div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 mt-0.5 ${tactic.impact === 'high' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{tactic.impact}</span>
              </button>
            )
          })}
        </div>
        <div className="text-xs text-slate-400 mb-3">{a4Selected.length} tactics selected · Include a mix of high and medium impact</div>
        {!a4Locked && !isViewer && <button className="btn-success" onClick={() => confirmSubmit(submitA4)} disabled={a4Selected.length < 3}>Submit Strategy</button>}
        {!a4Locked && a4Selected.length < 3 && !isViewer && <div className="text-xs text-amber-600 mt-2">Select at least 3 tactics</div>}
        {a4Locked && scores.b2a4 && <FeedbackPanel score={scores.b2a4.points} max={5}
          why="Quality rewards a strategic mix — all high-impact with no medium is less effective than a balanced portfolio. Nike needs both viral moments and sustained engagement."
          keyLearning={['UGC turns customers into content creators — free authentic content that outperforms brand content.', 'Challenges create cultural moments — participation is the product.', 'Combining high-reach tactics (challenges) with sustained engagement tactics (run club) compounds community value.']} />}
      </ActivityCard>

      {/* A8: Campaign Objectives - PITCH */}
      <ActivityCard number={8} title="Campaign Objectives" subtitle="Set Nike's social media objectives — these will guide your entire pitch strategy" points={scores.b2a5?.points || 0} locked={a5Locked} isPitch>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-4 text-sm text-slate-700 leading-relaxed">
          <div className="font-bold text-slate-900 mb-2">Nike Situation Brief</div>
          <p>Organic reach down 40% in 18 months. Adidas and New Balance gaining ground with Gen Z. Strong existing community but not growing. Priority: 18–24 female segment — underrepresented in Nike's social following despite being the fastest-growing sports participation group.</p>
          <p className="mt-2 font-semibold text-slate-800">Your brief: Select 2–3 objectives that will drive this year's social strategy.</p>
        </div>
        <Alert type="info">🎯 Choose 2–3 objectives. <strong>Your selection will pre-populate platform recommendations and budget guidance</strong> later in the workshop.</Alert>
        <div className="space-y-3 mb-4">
          {OBJECTIVE_OPTIONS.map(obj => {
            const selected = a5Selected.includes(obj.id)
            const atMax = a5Selected.length >= 3 && !selected
            return (
              <button key={obj.id} disabled={a5Locked || isViewer || atMax}
                onClick={() => { if (!a5Locked && !isViewer && !atMax) setA5Selected(prev => selected ? prev.filter(id => id !== obj.id) : [...prev, obj.id]) }}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${selected ? 'border-brand-500 bg-brand-50' : 'border-slate-200 hover:border-brand-300'} ${atMax ? 'opacity-50' : ''} disabled:cursor-default`}>
                <div className="flex items-start gap-3">
                  <div className={`w-4 h-4 border-2 rounded flex-shrink-0 mt-0.5 flex items-center justify-center ${selected ? 'border-brand-500 bg-brand-500' : 'border-slate-300'}`}>
                    {selected && <svg viewBox="0 0 12 12" className="w-3 h-3 fill-white"><path d="M10 3L5 8.5 2 5.5" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>}
                  </div>
                  <div className="flex-1">
                    <div className={`font-semibold text-sm mb-0.5 ${selected ? 'text-brand-700' : 'text-slate-800'}`}>{obj.label}</div>
                    <div className="text-xs text-slate-500">{obj.type} objective</div>
                    <div className="text-xs text-slate-400 mt-1 font-mono">{obj.metric}</div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 mt-0.5 ${
                    obj.type === 'Awareness' ? 'bg-blue-100 text-blue-700' :
                    obj.type === 'Engagement' ? 'bg-violet-100 text-violet-700' :
                    obj.type === 'Conversion' ? 'bg-emerald-100 text-emerald-700' :
                    obj.type === 'Retention' ? 'bg-amber-100 text-amber-700' :
                    'bg-pink-100 text-pink-700'
                  }`}>{obj.type}</span>
                </div>
              </button>
            )
          })}
        </div>
        {objectives.length > 0 && !a5Locked && (
          <div className="bg-brand-50 border border-brand-200 rounded-xl p-3 mb-3 text-xs text-brand-700">
            <strong>Selected:</strong> {a5Selected.map(id => OBJECTIVE_OPTIONS.find(o => o.id === id)?.type).join(' + ')} strategy. This will influence your recommended platforms and budget allocation.
          </div>
        )}
        {!a5Locked && !isViewer && <button className="btn-success" onClick={() => confirmSubmit(submitA5)} disabled={a5Selected.length < 2}>Submit Objectives</button>}
        {!a5Locked && a5Selected.length < 2 && !isViewer && <div className="text-xs text-amber-600 mt-2">Select 2–3 objectives before submitting</div>}
        {a5Locked && scores.b2a5 && <FeedbackPanel score={scores.b2a5.points} max={5}
          why="Objectives drive everything that follows — platform selection, content format, budget allocation and measurement KPIs all flow from your objectives."
          keyLearning={['SMART objectives connect social activity to business outcomes — executives need numbers, not vibes.', 'Your objectives should balance short-term commercial goals with long-term community building.', 'These objectives will shape your platform selection and budget recommendations in Blocks 3 and 5.']} />}
      </ActivityCard>
    </div>
  )
}
