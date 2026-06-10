import { useState } from 'react'
import { useWorkspaceStore } from '../../store/workspace'
import {
  ATTENTION_POSTS, STOP_FACTORS, ATTENTION_FACTORS_MAX,
  AUDIENCE_MOTIVATIONS, AUDIENCE_PAIN_POINTS, AUDIENCE_PLATFORMS, MOTIVATIONS_MAX, PAIN_POINTS_MAX, PLATFORMS_MAX,
  ETHICAL_SCENARIOS,
  COMMUNITY_TACTICS, COMMUNITY_TACTICS_MAX,
  OBJECTIVE_OPTIONS, OBJECTIVES_MAX,
  calcQualityScore, CAMPAIGN_KEYWORDS
} from '../../data/workshop'
import { ActivityCard, FeedbackPanel, Alert, confirmSubmit } from '../ui/shared'

function CapBadge({ current, max }: { current: number; max: number }) {
  return (
    <div className={`text-xs font-semibold mb-2 ${current >= max ? 'text-amber-600' : 'text-slate-400'}`}>
      {current}/{max} selected{current >= max ? ' — deselect one to change' : ''}
    </div>
  )
}

export function Block2() {
  const { scores, responses, updateScore, updateResponse, lockActivity } = useWorkspaceStore()
  const isViewer = useWorkspaceStore(s => s.isViewer)

  // A4: Attention Audit
  const a1Locked = !!(responses['b2a1_locked'])
  const [a1Verdicts, setA1Verdicts] = useState<Record<string, string>>((responses['b2a1_verdicts'] as Record<string, string>) || {})
  const [a1Factors, setA1Factors] = useState<Record<string, string[]>>((responses['b2a1_factors'] as Record<string, string[]>) || {})

  const submitA1 = () => {
    const correct = ATTENTION_POSTS.filter(p => a1Verdicts[p.id] === p.verdict).length
    const pts = Math.min(5, Math.round(correct / ATTENTION_POSTS.length * 5))
    updateScore('b2a1', pts, 5)
    updateResponse({ b2a1_verdicts: a1Verdicts, b2a1_factors: a1Factors, b2a1_locked: true })
    lockActivity('b2a1')
  }

  // A5: Behaviour Mapping
  const a2Locked = !!(responses['b2a2_locked'])
  const [a2Motivations, setA2Motivations] = useState<string[]>((responses['b2a2_motivations'] as string[]) || [])
  const [a2Pain, setA2Pain] = useState<string[]>((responses['b2a2_pain'] as string[]) || [])
  const [a2Platforms, setA2Platforms] = useState<string[]>((responses['b2a2_platforms'] as string[]) || [])

  const toggle = (arr: string[], setArr: (v: string[]) => void, id: string, max: number) => {
    if (arr.includes(id)) setArr(arr.filter(x => x !== id))
    else if (arr.length < max) setArr([...arr, id])
  }

  const submitA2 = () => {
    const motivHits = a2Motivations.filter(m => AUDIENCE_MOTIVATIONS.find(o => o.id === m)?.correct).length
    const painHits = a2Pain.filter(p => AUDIENCE_PAIN_POINTS.find(o => o.id === p)?.correct).length
    const platHits = a2Platforms.filter(p => AUDIENCE_PLATFORMS.find(o => o.id === p)?.correct).length
    const pts = Math.min(5, motivHits + painHits + platHits)
    updateScore('b2a2', pts, 5)
    updateResponse({ b2a2_motivations: a2Motivations, b2a2_pain: a2Pain, b2a2_platforms: a2Platforms, b2a2_locked: true })
    lockActivity('b2a2')
  }

  // A6: Ethical Dilemma
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

  // A7: Community Growth
  const a4Locked = !!(responses['b2a4_locked'])
  const [a4Selected, setA4Selected] = useState<string[]>((responses['b2a4_tactics'] as string[]) || [])

  const submitA4 = () => {
    const highImpact = a4Selected.filter(id => COMMUNITY_TACTICS.find(t => t.id === id)?.impact === 'high').length
    const medImpact = a4Selected.filter(id => COMMUNITY_TACTICS.find(t => t.id === id)?.impact === 'medium').length
    const hasMix = highImpact >= 1 && medImpact >= 1
    const pts = Math.min(5, highImpact + (hasMix ? 2 : 0))
    updateScore('b2a4', pts, 5)
    updateResponse({ b2a4_tactics: a4Selected, b2a4_locked: true })
    lockActivity('b2a4')
  }

  // A8: Campaign Objectives
  const a5Locked = !!(responses['b2a5_locked'])
  const [a5Selected, setA5Selected] = useState<string[]>((responses['b2a5_objectives'] as string[]) || [])

  const submitA5 = () => {
    const pts = Math.min(5, a5Selected.length >= 2 ? a5Selected.length + 1 : a5Selected.length)
    updateScore('b2a5', pts, 5)
    updateResponse({ b2a5_objectives: a5Selected, b2a5_locked: true })
    lockActivity('b2a5')
  }

  const CheckBox = ({ selected, disabled }: { selected: boolean; disabled: boolean }) => (
    <div className={`w-4 h-4 border-2 rounded flex-shrink-0 flex items-center justify-center transition-all ${selected ? 'border-brand-500 bg-brand-500' : disabled ? 'border-slate-200 bg-slate-50' : 'border-slate-300 bg-white'}`}>
      {selected && <svg viewBox="0 0 12 12" className="w-3 h-3"><path d="M10 3L5 8.5 2 5.5" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>}
    </div>
  )

  const ChoiceRow = ({ id, label, selected, disabled, onClick, showResult, correct }: { id: string; label: string; selected: boolean; disabled: boolean; onClick: () => void; showResult?: boolean; correct?: boolean }) => (
    <button onClick={onClick} disabled={disabled}
      className={`w-full text-left p-3 rounded-xl border-2 flex items-center gap-3 transition-all ${selected ? 'border-brand-500 bg-brand-50' : disabled && !selected ? 'border-slate-100 bg-slate-50 opacity-60' : 'border-slate-200 hover:border-brand-300 bg-white'} ${showResult && selected && correct === false ? 'border-red-300 bg-red-50' : ''} ${showResult && selected && correct ? 'border-emerald-400 bg-emerald-50' : ''} cursor-pointer disabled:cursor-default`}>
      <CheckBox selected={selected} disabled={disabled && !selected} />
      <span className={`text-sm font-medium ${selected ? 'text-brand-800' : disabled && !selected ? 'text-slate-400' : 'text-slate-800'}`}>{label}</span>
      {showResult && selected && <span className="ml-auto text-xs font-bold flex-shrink-0">{correct ? '✓' : '✗'}</span>}
    </button>
  )

  return (
    <div>
      {/* A4: Attention Audit */}
      <ActivityCard number={4} title="Attention Audit" subtitle="Stop or scroll? What makes Nike content earn attention?" points={scores.b2a1?.points || 0} locked={a1Locked}>
        <Alert type="info">👁️ For each Nike content concept: would you <strong>Stop</strong> or <strong>Scroll</strong>? Then pick the <strong>1–2 dominant factors</strong> that made you decide.</Alert>
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
                {showResult && <div className={`text-xs mb-2 font-semibold ${isCorrect ? 'text-emerald-700' : 'text-amber-700'}`}>{isCorrect ? '✓ Correct' : `Answer: ${post.verdict}`} — Key factors: {post.stopFactors.join(', ')}</div>}
                <div className="text-[10px] text-slate-400 mb-1.5">Pick up to {ATTENTION_FACTORS_MAX} dominant factors ({factors.length}/{ATTENTION_FACTORS_MAX})</div>
                <div className="flex flex-wrap gap-1.5">
                  {STOP_FACTORS.map(factor => {
                    const sel = factors.includes(factor)
                    const atMax = factors.length >= ATTENTION_FACTORS_MAX && !sel
                    return (
                      <button key={factor} disabled={a1Locked || isViewer || atMax}
                        onClick={() => {
                          if (a1Locked || isViewer || atMax) return
                          setA1Factors(prev => ({ ...prev, [post.id]: sel ? factors.filter(f => f !== factor) : [...factors, factor] }))
                        }}
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${sel ? 'border-brand-500 bg-brand-500 text-white' : atMax ? 'border-slate-100 text-slate-300 bg-slate-50' : 'border-slate-200 bg-white text-slate-600 hover:border-brand-300'} disabled:cursor-default`}>
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
          why="Quality based on correctly identifying stop vs scroll and the dominant attention factors."
          keyLearning={['The first frame determines everything — content is judged in under a second.', 'Emotion beats production quality — authentic moments outperform polished ads.', 'Nike\'s strongest content makes people feel something, not just know something.']} />}
      </ActivityCard>

      {/* A5: Behaviour Mapping */}
      <ActivityCard number={5} title="Behaviour Mapping" subtitle="Build Nike's 18–24 female audience profile — feeds your Agency Pitch" points={scores.b2a2?.points || 0} locked={a2Locked} isPitch>
        <Alert type="info">👥 Select what best describes Nike's 18–24 female target audience. Think carefully — not all options apply.</Alert>
        <div className="space-y-5 mb-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Key Motivations</div>
            <CapBadge current={a2Motivations.length} max={MOTIVATIONS_MAX} />
            <div className="space-y-2">
              {AUDIENCE_MOTIVATIONS.map(o => (
                <ChoiceRow key={o.id} id={o.id} label={o.label}
                  selected={a2Motivations.includes(o.id)}
                  disabled={a2Locked || isViewer || (a2Motivations.length >= MOTIVATIONS_MAX && !a2Motivations.includes(o.id))}
                  onClick={() => !a2Locked && !isViewer && toggle(a2Motivations, setA2Motivations, o.id, MOTIVATIONS_MAX)}
                  showResult={a2Locked} correct={o.correct} />
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Key Pain Points</div>
            <CapBadge current={a2Pain.length} max={PAIN_POINTS_MAX} />
            <div className="space-y-2">
              {AUDIENCE_PAIN_POINTS.map(o => (
                <ChoiceRow key={o.id} id={o.id} label={o.label}
                  selected={a2Pain.includes(o.id)}
                  disabled={a2Locked || isViewer || (a2Pain.length >= PAIN_POINTS_MAX && !a2Pain.includes(o.id))}
                  onClick={() => !a2Locked && !isViewer && toggle(a2Pain, setA2Pain, o.id, PAIN_POINTS_MAX)}
                  showResult={a2Locked} correct={o.correct} />
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Primary Platforms</div>
            <CapBadge current={a2Platforms.length} max={PLATFORMS_MAX} />
            <div className="space-y-2">
              {AUDIENCE_PLATFORMS.map(o => (
                <ChoiceRow key={o.id} id={o.id} label={o.label}
                  selected={a2Platforms.includes(o.id)}
                  disabled={a2Locked || isViewer || (a2Platforms.length >= PLATFORMS_MAX && !a2Platforms.includes(o.id))}
                  onClick={() => !a2Locked && !isViewer && toggle(a2Platforms, setA2Platforms, o.id, PLATFORMS_MAX)}
                  showResult={a2Locked} correct={o.correct} />
              ))}
            </div>
          </div>
        </div>
        {!a2Locked && !isViewer && <button className="btn-success" onClick={() => confirmSubmit(submitA2)} disabled={a2Motivations.length === 0 || a2Pain.length === 0 || a2Platforms.length === 0}>Submit Profile</button>}
        {!a2Locked && !isViewer && <div className="text-xs text-amber-600 mt-2">Select at least one in each section before submitting</div>}
        {a2Locked && scores.b2a2 && <FeedbackPanel score={scores.b2a2.points} max={5}
          why="Nike's 18–24 female audience is motivated by achievement, identity, inspiration and community. Primary platforms are Instagram and TikTok."
          keyLearning={['Motivation drives behaviour more than demographics alone.', 'Nike\'s audience is sceptical of corporate advertising — authenticity is non-negotiable.', 'Platform choice must follow the audience, not habit.']} />}
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
          why="Social media ethics have legal and commercial consequences, not just moral ones."
          keyLearning={['ASA requires clear upfront disclosure — #ad must be visible without scrolling.', 'Ethical targeting aligns with brand values — Nike is about empowerment, not body anxiety.', 'Accessibility is both ethical and commercial — captions increase reach significantly.']} />}
      </ActivityCard>

      {/* A7: Community Growth */}
      <ActivityCard number={7} title="Community Growth Strategy" subtitle="Select Nike's community-building tactics — feeds your Agency Pitch" points={scores.b2a4?.points || 0} locked={a4Locked} isPitch>
        <Alert type="info">🌱 Choose <strong>up to 4 tactics</strong> for Nike. A strong strategy mixes high-impact and medium-impact approaches — prioritise carefully.</Alert>
        <CapBadge current={a4Selected.length} max={COMMUNITY_TACTICS_MAX} />
        <div className="space-y-2 mb-4">
          {COMMUNITY_TACTICS.map(tactic => {
            const selected = a4Selected.includes(tactic.id)
            const atMax = a4Selected.length >= COMMUNITY_TACTICS_MAX && !selected
            return (
              <button key={tactic.id} disabled={a4Locked || isViewer || atMax}
                onClick={() => { if (!a4Locked && !isViewer && !atMax) setA4Selected(prev => selected ? prev.filter(id => id !== tactic.id) : [...prev, tactic.id]) }}
                className={`w-full text-left p-3 rounded-xl border-2 transition-all flex items-start gap-3 ${selected ? 'border-brand-500 bg-brand-50' : atMax ? 'border-slate-100 bg-slate-50 opacity-50' : 'border-slate-200 hover:border-brand-300'} disabled:cursor-default`}>
                <div className={`w-4 h-4 border-2 rounded flex-shrink-0 mt-0.5 flex items-center justify-center ${selected ? 'border-brand-500 bg-brand-500' : 'border-slate-300'}`}>
                  {selected && <svg viewBox="0 0 12 12" className="w-3 h-3"><path d="M10 3L5 8.5 2 5.5" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>}
                </div>
                <div className="flex-1">
                  <div className={`font-semibold text-sm ${selected ? 'text-brand-700' : atMax ? 'text-slate-400' : 'text-slate-800'}`}>{tactic.label}</div>
                  <div className="text-xs text-slate-500">{tactic.desc}</div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 mt-0.5 ${tactic.impact === 'high' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{tactic.impact}</span>
              </button>
            )
          })}
        </div>
        {!a4Locked && !isViewer && <button className="btn-success" onClick={() => confirmSubmit(submitA4)} disabled={a4Selected.length < 2}>Submit Strategy</button>}
        {!a4Locked && a4Selected.length < 2 && !isViewer && <div className="text-xs text-amber-600 mt-2">Select at least 2 tactics</div>}
        {a4Locked && scores.b2a4 && <FeedbackPanel score={scores.b2a4.points} max={5}
          why="Quality rewards a strategic mix — combining high-impact (UGC, challenges) with medium-impact (polls, exclusives) creates a sustainable community strategy."
          keyLearning={['UGC turns customers into content creators — free authentic content that outperforms brand content.', 'Challenges create cultural moments — participation is the product.', 'High-impact and medium-impact tactics work together: viral moments bring people in, sustained engagement keeps them.']} />}
      </ActivityCard>

      {/* A8: Campaign Objectives */}
      <ActivityCard number={8} title="Campaign Objectives" subtitle="Set Nike's objectives — these guide your entire pitch strategy" points={scores.b2a5?.points || 0} locked={a5Locked} isPitch>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-4 text-sm text-slate-700 leading-relaxed">
          <div className="font-bold text-slate-900 mb-2">Nike Situation Brief</div>
          <p>Organic reach down 40% in 18 months. Adidas and New Balance gaining ground with Gen Z. Strong existing community but not growing. Priority: 18–24 female segment — underrepresented despite being the fastest-growing sports participation group.</p>
          <p className="mt-2 font-semibold text-slate-800">Select 2–3 objectives that will drive this year's social strategy. Your choices will shape platform recommendations and budget guidance later.</p>
        </div>
        <CapBadge current={a5Selected.length} max={OBJECTIVES_MAX} />
        <div className="space-y-3 mb-4">
          {OBJECTIVE_OPTIONS.map(obj => {
            const selected = a5Selected.includes(obj.id)
            const atMax = a5Selected.length >= OBJECTIVES_MAX && !selected
            return (
              <button key={obj.id} disabled={a5Locked || isViewer || atMax}
                onClick={() => { if (!a5Locked && !isViewer && !atMax) setA5Selected(prev => selected ? prev.filter(id => id !== obj.id) : [...prev, obj.id]) }}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${selected ? 'border-brand-500 bg-brand-50' : atMax ? 'border-slate-100 opacity-50' : 'border-slate-200 hover:border-brand-300'} disabled:cursor-default`}>
                <div className="flex items-start gap-3">
                  <div className={`w-4 h-4 border-2 rounded flex-shrink-0 mt-0.5 flex items-center justify-center ${selected ? 'border-brand-500 bg-brand-500' : 'border-slate-300'}`}>
                    {selected && <svg viewBox="0 0 12 12" className="w-3 h-3"><path d="M10 3L5 8.5 2 5.5" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`font-semibold text-sm mb-0.5 ${selected ? 'text-brand-700' : atMax ? 'text-slate-400' : 'text-slate-800'}`}>{obj.label}</div>
                    <div className="text-xs text-slate-400 font-mono break-words">{obj.metric}</div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${obj.type === 'Awareness' ? 'bg-blue-100 text-blue-700' : obj.type === 'Engagement' ? 'bg-violet-100 text-violet-700' : obj.type === 'Conversion' ? 'bg-emerald-100 text-emerald-700' : obj.type === 'Retention' ? 'bg-amber-100 text-amber-700' : 'bg-pink-100 text-pink-700'}`}>{obj.type}</span>
                </div>
              </button>
            )
          })}
        </div>
        {!a5Locked && !isViewer && <button className="btn-success" onClick={() => confirmSubmit(submitA5)} disabled={a5Selected.length < 2}>Submit Objectives</button>}
        {!a5Locked && a5Selected.length < 2 && !isViewer && <div className="text-xs text-amber-600 mt-2">Select 2–3 objectives before submitting</div>}
        {a5Locked && scores.b2a5 && <FeedbackPanel score={scores.b2a5.points} max={5}
          why="Objectives drive everything that follows — platform selection, content format, budget allocation and measurement KPIs all flow from your objectives."
          keyLearning={['SMART objectives connect social activity to business outcomes.', 'Your objectives should balance short-term commercial goals with long-term community building.', 'These objectives will pre-populate platform recommendations in Block 3 and budget guidance in Block 5.']} />}
      </ActivityCard>
    </div>
  )
}
