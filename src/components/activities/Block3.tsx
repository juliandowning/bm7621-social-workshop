import { useState } from 'react'
import { useWorkspaceStore } from '../../store/workspace'
import { PLATFORMS_TO_PRIORITISE, PLATFORM_PRIORITY_LEVELS, ALGORITHM_SCENARIOS, ALGORITHM_FACTORS, ACTIVITY_DISPLAY_NUM, BRAND_CONTEXT } from '../../data/workshop'
import { ActivityCard, FeedbackPanel, Alert, confirmSubmit } from '../ui/shared'
import type { Brand } from '../../types'

const N = ACTIVITY_DISPLAY_NUM

function simAvgToPoints(avg: number): number {
  if (avg >= 90) return 5
  if (avg >= 80) return 4
  if (avg >= 70) return 3
  if (avg >= 60) return 2
  return 1
}

export function Block3() {
  const { team, scores, responses, updateScore, updateResponse, lockActivity } = useWorkspaceStore()
  const isViewer = useWorkspaceStore(s => s.isViewer)
  const brand = (team?.brand || 'Nike') as Brand
  const context = BRAND_CONTEXT[brand]

  // ── B3A1: Platform Selection Matrix ──────────────────────
  const a1Locked = !!(responses['b3a1_locked'])
  const [a1Priorities, setA1Priorities] = useState<Record<string, string>>(
    (responses['b3a1_priorities'] as Record<string, string>) || {}
  )

  const submitA1 = () => {
    const primaries = Object.values(a1Priorities).filter(v => v === 'Primary').length
    const assigned = Object.values(a1Priorities).filter(Boolean).length
    const correctPrimary = context.mainPlatforms.filter(p => a1Priorities[p] === 'Primary').length
    const cPts = assigned >= PLATFORMS_TO_PRIORITISE.length ? 2 : assigned >= 4 ? 1 : 0
    const qPts = Math.min(3, correctPrimary + (primaries >= 1 && primaries <= 3 ? 1 : 0))
    updateScore('b3a1', Math.min(5, cPts + qPts), 5, cPts, qPts)
    updateResponse({ b3a1_priorities: a1Priorities, b3a1_locked: true })
    lockActivity('b3a1')
  }

  // ── B3A2: Algorithm Detective ─────────────────────────────
  const a2Locked = !!(responses['b3a2_locked'])
  const [a2Picks, setA2Picks] = useState<Record<string, string>>(
    (responses['b3a2_picks'] as Record<string, string>) || {}
  )
  const [a2Score, setA2Score] = useState<number | null>(null)

  const submitA2 = () => {
    const correct = ALGORITHM_SCENARIOS.filter(s => a2Picks[s.id] === s.dominantFactor).length
    const cPts = Object.keys(a2Picks).length >= ALGORITHM_SCENARIOS.length ? 2 : 1
    const qPts = Math.min(3, correct)
    updateScore('b3a2', Math.min(5, cPts + qPts), 5, cPts, qPts)
    updateResponse({ b3a2_picks: a2Picks, b3a2_locked: true })
    lockActivity('b3a2')
    setA2Score(correct)
  }

  // ── B3A3: Social Lab Simulator ───────────────────────────
  const simScores = (responses['b3a3_scores'] as (number | null)[]) || [null, null, null, null, null]
  const [simVals, setSimVals] = useState<(number | null)[]>(simScores)

  const handleSim = (idx: number, val: string) => {
    const next = [...simVals]
    next[idx] = val === '' ? null : Math.min(100, Math.max(0, parseFloat(val) || 0))
    setSimVals(next)
    const valid = next.filter((v): v is number => v !== null)
    if (valid.length > 0) {
      const avg = valid.reduce((a, b) => a + b, 0) / valid.length
      updateScore('b3a3', simAvgToPoints(avg))
      updateResponse({ b3a3_scores: next })
    }
  }

  const simValid = simVals.filter((v): v is number => v !== null)
  const simAvg = simValid.length > 0 ? simValid.reduce((a, b) => a + b, 0) / simValid.length : null
  const memberCount = team?.members?.length || 5

  const priorityColors: Record<string, string> = {
    'Primary': 'border-brand-500 bg-brand-500 text-white',
    'Secondary': 'border-teal-500 bg-teal-500 text-white',
    'Monitor': 'border-amber-400 bg-amber-400 text-white',
    'Avoid': 'border-slate-400 bg-slate-400 text-white',
  }

  return (
    <div>
      {/* B3A1: Platform Selection */}
      <ActivityCard number={N.b3a1} title="Platform Selection" subtitle="Set strategic priority levels for each platform" points={scores.b3a1?.points || 0} locked={a1Locked}>
        <Alert type="info">📊 Assign a priority level to each platform for <strong>{brand}</strong>. You should have 2–3 Primary platforms, 2–3 Secondary, and the rest as Monitor or Avoid.</Alert>
        <div className="space-y-3 mb-4">
          {PLATFORMS_TO_PRIORITISE.map(platform => {
            const pick = a1Priorities[platform]
            const isCorrectPrimary = context.mainPlatforms.includes(platform)
            return (
              <div key={platform} className={`border-2 rounded-xl p-3 transition-all ${a1Locked && isCorrectPrimary && pick === 'Primary' ? 'border-emerald-300' : 'border-slate-200'}`}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-sm font-bold text-slate-800 w-28 flex-shrink-0">{platform}</div>
                  {a1Locked && isCorrectPrimary && <span className="text-[10px] text-emerald-600 font-bold">✓ Primary for {brand}</span>}
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  {PLATFORM_PRIORITY_LEVELS.map(level => (
                    <button key={level} disabled={a1Locked || isViewer}
                      onClick={() => setA1Priorities(prev => ({ ...prev, [platform]: level }))}
                      className={`px-3 py-1 rounded-lg text-xs font-bold border-2 transition-all ${pick === level ? priorityColors[level] || 'border-brand-500 bg-brand-500 text-white' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'} ${(a1Locked || isViewer) ? 'cursor-default' : ''}`}>
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
        {!a1Locked && !isViewer && (
          <button className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-700 disabled:opacity-50"
            onClick={() => confirmSubmit(submitA1)} disabled={Object.keys(a1Priorities).length < 4}>
            Submit Strategy
          </button>
        )}
        {a1Locked && scores.b3a1 && (
          <FeedbackPanel score={scores.b3a1.points} max={5}
            completionPts={scores.b3a1.completionPts} qualityPts={scores.b3a1.qualityPts}
            why={`Quality based on correctly identifying ${brand}'s primary platforms (${context.mainPlatforms.join(', ')}) and appropriate priority spread.`}
            example={`${brand} channel strategy: Primary: ${context.mainPlatforms.slice(0,2).join(', ')} — highest audience concentration and content fit. Secondary: ${context.mainPlatforms.slice(2).join(', ')} — relevant but not core. Monitor: emerging platforms. Avoid: platforms where audience doesn't exist.`}
            keyLearning={[
              'Trying to be active on all platforms is a strategy for mediocrity — depth beats breadth.',
              'Primary platforms should receive 70% of content and budget investment.',
              'Monitor platforms before committing — wait for proof of audience before investing.',
              'Platform priority should be reviewed quarterly — audience migration happens fast.',
            ]}
          />
        )}
      </ActivityCard>

      {/* B3A2: Algorithm Detective */}
      <ActivityCard number={N.b3a2} title="Algorithm Detective" subtitle="Identify the dominant algorithm factor behind each content success" points={scores.b3a2?.points || 0} locked={a2Locked}>
        <Alert type="info">🔍 Each scenario shows a surprising content performance result. Identify which algorithm factor was most responsible for the success.</Alert>
        <div className="space-y-5 mb-4">
          {ALGORITHM_SCENARIOS.map(scenario => {
            const pick = a2Picks[scenario.id]
            const showResult = a2Locked
            const isCorrect = pick === scenario.dominantFactor
            return (
              <div key={scenario.id} className={`border-2 rounded-xl p-4 ${showResult ? (isCorrect ? 'border-emerald-300 bg-emerald-50' : 'border-red-200 bg-red-50') : 'border-slate-200'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-700">{scenario.platform}</span>
                </div>
                <div className="text-sm text-slate-700 italic mb-3">"{scenario.description}"</div>
                <div className="flex flex-wrap gap-2">
                  {ALGORITHM_FACTORS.map(factor => (
                    <button key={factor} disabled={a2Locked || isViewer}
                      onClick={() => setA2Picks(prev => ({ ...prev, [scenario.id]: factor }))}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border-2 transition-all ${pick === factor ? 'border-brand-500 bg-brand-500 text-white' : 'border-slate-200 bg-white text-slate-600 hover:border-brand-300'} ${showResult && factor === scenario.dominantFactor ? 'ring-2 ring-emerald-400' : ''} ${(a2Locked || isViewer) ? 'cursor-default' : ''}`}>
                      {factor}
                    </button>
                  ))}
                </div>
                {showResult && (
                  <div className={`mt-2 text-xs ${isCorrect ? 'text-emerald-700' : 'text-red-700'}`}>
                    {isCorrect ? '✓ Correct — ' : `✗ Answer: ${scenario.dominantFactor} — `}{scenario.explanation}
                  </div>
                )}
              </div>
            )
          })}
        </div>
        {!a2Locked && !isViewer && (
          <button className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-700 disabled:opacity-50"
            onClick={() => confirmSubmit(submitA2)} disabled={Object.keys(a2Picks).length < ALGORITHM_SCENARIOS.length}>
            Submit Answers
          </button>
        )}
        {a2Locked && a2Score !== null && scores.b3a2 && (
          <FeedbackPanel score={scores.b3a2.points} max={5}
            completionPts={scores.b3a2.completionPts} qualityPts={scores.b3a2.qualityPts}
            why={`${a2Score}/${ALGORITHM_SCENARIOS.length} correct. Each platform has a dominant ranking signal — optimising for the wrong factor wastes resource.`}
            example="TikTok: completion rate + replays override follower count. A 12-second video with 100% completion outranks a 2-minute video with 50% completion. Instagram: engagement velocity in first hour determines distribution. LinkedIn: personal narrative drives 10x more reach than corporate posts."
            keyLearning={[
              'TikTok rewards completion rate above everything — shorter, more compelling content wins.',
              'Instagram\'s algorithm prioritises saves — content people want to revisit gets distributed more.',
              'LinkedIn\'s algorithm rewards personal authenticity — corporate messaging underperforms.',
              'Recency matters on Twitter/X — content has a 30-minute half-life.',
            ]}
          />
        )}
      </ActivityCard>

      {/* B3A3: Social Lab Simulator */}
      <ActivityCard number={N.b3a3} title="Social Lab — Simulator" subtitle="Enter your team's Social Lab simulator scores" points={scores.b3a3?.points || 0}>
        <Alert type="info">🎮 Enter each team member's score from the Social Lab simulator. Blanks are ignored. Your team's average is converted to workshop points.</Alert>
        <div className="flex gap-2 flex-wrap mb-4">
          {Array.from({ length: memberCount }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className="text-[10px] text-slate-400 font-semibold">Score {i + 1}</div>
              <input type="number" min={0} max={100} value={simVals[i] ?? ''} onChange={e => handleSim(i, e.target.value)}
                placeholder="—" disabled={isViewer}
                className="w-16 text-center font-bold text-base border border-slate-200 rounded-lg py-2 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 disabled:bg-slate-50" />
            </div>
          ))}
        </div>
        {simAvg !== null && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
            Team average: <strong>{simAvg.toFixed(1)}</strong> → <strong>{simAvgToPoints(simAvg)} workshop points</strong>
            <div className="text-xs text-slate-500 mt-0.5">90+=5pts · 80+=4pts · 70+=3pts · 60+=2pts · below 60=1pt</div>
          </div>
        )}
      </ActivityCard>
    </div>
  )
}
