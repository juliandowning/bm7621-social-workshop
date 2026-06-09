import { useState } from 'react'
import { useWorkspaceStore } from '../../store/workspace'
import { PLATFORMS_TO_PRIORITISE, PLATFORM_PRIORITY_OPTIONS, ALGORITHM_SCENARIOS, ALGORITHM_FACTORS, OBJECTIVE_OPTIONS, calcQualityScore } from '../../data/workshop'
import { ActivityCard, FeedbackPanel, Alert, confirmSubmit } from '../ui/shared'

function simPts(avg: number) { return avg >= 90 ? 5 : avg >= 80 ? 4 : avg >= 70 ? 3 : avg >= 60 ? 2 : 1 }

export function Block3() {
  const { scores, responses, updateScore, updateResponse, lockActivity } = useWorkspaceStore()
  const isViewer = useWorkspaceStore(s => s.isViewer)
  const objectives = (responses['b2a5_objectives'] as string[]) || []

  // A9 Platform Selection
  const a1Locked = !!(responses['b3a1_locked'])
  const [a1Priorities, setA1Priorities] = useState<Record<string, string>>((responses['b3a1_priorities'] as Record<string, string>) || {})

  const submitA1 = () => {
    const correctByObj = PLATFORMS_TO_PRIORITISE.filter(p =>
      objectives.some(obj => p.objectiveFit.includes(obj)) && a1Priorities[p.id] === 'Primary'
    ).length
    const primaries = Object.values(a1Priorities).filter(v => v === 'Primary').length
    const goodSpread = primaries >= 2 && primaries <= 3
    const pts = Math.min(5, correctByObj + (goodSpread ? 1 : 0) + (Object.keys(a1Priorities).length >= 6 ? 1 : 0))
    updateScore('b3a1', pts, 5)
    updateResponse({ b3a1_priorities: a1Priorities, b3a1_locked: true })
    lockActivity('b3a1')
  }

  // A10 Algorithm Detective
  const a2Locked = !!(responses['b3a2_locked'])
  const [a2Picks, setA2Picks] = useState<Record<string, string>>((responses['b3a2_picks'] as Record<string, string>) || {})

  const submitA2 = () => {
    const correct = ALGORITHM_SCENARIOS.filter(s => a2Picks[s.id] === s.dominantFactor).length
    const pts = Math.min(5, correct + (correct === ALGORITHM_SCENARIOS.length ? 2 : 0))
    updateScore('b3a2', pts, 5)
    updateResponse({ b3a2_picks: a2Picks, b3a2_locked: true })
    lockActivity('b3a2')
  }

  // A11 Simulator
  const [simVals, setSimVals] = useState<(number | null)[]>((responses['b3a3_scores'] as (number | null)[]) || [null, null, null, null, null])
  const validSims = simVals.filter((v): v is number => v !== null)
  const simAvg = validSims.length > 0 ? validSims.reduce((a, b) => a + b, 0) / validSims.length : null

  const handleSim = (idx: number, val: string) => {
    const next = [...simVals]
    next[idx] = val === '' ? null : Math.min(100, Math.max(0, parseFloat(val) || 0))
    setSimVals(next)
    const v = next.filter((x): x is number => x !== null)
    if (v.length > 0) { const avg = v.reduce((a, b) => a + b, 0) / v.length; updateScore('b3a3', simPts(avg)); updateResponse({ b3a3_scores: next }) }
  }

  const priorityColors: Record<string, string> = { 'Primary': 'border-brand-500 bg-brand-500 text-white', 'Secondary': 'border-teal-500 bg-teal-50 text-teal-700', 'Monitor': 'border-amber-400 bg-amber-50 text-amber-700', 'Not relevant': 'border-slate-300 bg-slate-100 text-slate-500' }

  const objectiveLabels = objectives.map(id => OBJECTIVE_OPTIONS.find(o => o.id === id)?.type || id).join(' + ')

  return (
    <div>
      {/* A9: Platform Selection */}
      <ActivityCard number={9} title="Platform Selection" subtitle="Set strategic priority levels for Nike across each platform — feeds your Agency Pitch" points={scores.b3a1?.points || 0} locked={a1Locked} isPitch>
        {objectives.length > 0 && (
          <div className="bg-brand-50 border border-brand-200 rounded-xl p-3 mb-4 text-xs text-brand-700">
            <strong>Your objectives:</strong> {objectiveLabels} → This should guide which platforms you prioritise.
            {objectives.map(id => {
              const obj = OBJECTIVE_OPTIONS.find(o => o.id === id)
              if (!obj) return null
              return <div key={id} className="mt-1">For <strong>{obj.type}</strong>: recommended platforms are <strong>{obj.cascades.platforms.join(', ')}</strong></div>
            })}
          </div>
        )}
        <Alert type="info">📊 Assign a priority to each platform for Nike's 18–24 female audience campaign. Aim for 2–3 Primary platforms — spread resource too thin and performance suffers.</Alert>
        <div className="space-y-3 mb-4">
          {PLATFORMS_TO_PRIORITISE.map(platform => {
            const pick = a1Priorities[platform.id]
            const isObjFit = objectives.some(obj => platform.objectiveFit.includes(obj))
            return (
              <div key={platform.id} className={`border-2 rounded-xl p-3 transition-all ${a1Locked && isObjFit && pick === 'Primary' ? 'border-emerald-300' : 'border-slate-200'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="text-sm font-bold text-slate-800 flex-1">{platform.name}</div>
                  {isObjFit && <span className="text-[10px] text-brand-600 font-semibold">Fits objectives</span>}
                  {a1Locked && <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${platform.audienceFit === 'high' ? 'bg-emerald-100 text-emerald-700' : platform.audienceFit === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>{platform.audienceFit} audience fit</span>}
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  {PLATFORM_PRIORITY_OPTIONS.map(level => (
                    <button key={level} disabled={a1Locked || isViewer}
                      onClick={() => setA1Priorities(prev => ({ ...prev, [platform.id]: level }))}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold border-2 transition-all ${pick === level ? priorityColors[level] : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'} disabled:cursor-default`}>
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
        {!a1Locked && !isViewer && <button className="btn-success" onClick={() => confirmSubmit(submitA1)} disabled={Object.keys(a1Priorities).length < 4}>Submit Strategy</button>}
        {a1Locked && scores.b3a1 && <FeedbackPanel score={scores.b3a1.points} max={5}
          why="Quality based on platform-objective alignment and strategic spread. For Nike's 18–24 female audience, Instagram and TikTok should be Primary. YouTube is strong Secondary. LinkedIn is not relevant."
          keyLearning={['Depth beats breadth — Primary platforms get 70% of content and budget.', 'Platform selection must follow your audience and objectives, not habit.', 'For Nike\'s target: TikTok for discovery, Instagram for community, YouTube for depth.']} />}
      </ActivityCard>

      {/* A10: Algorithm Detective */}
      <ActivityCard number={10} title="Algorithm Detective" subtitle="Identify the dominant algorithm factor behind each Nike content success" points={scores.b3a2?.points || 0} locked={a2Locked}>
        <Alert type="info">🔍 Each scenario shows a surprising Nike content result. Which algorithm factor was most responsible?</Alert>
        <div className="space-y-5 mb-4">
          {ALGORITHM_SCENARIOS.map(scenario => {
            const pick = a2Picks[scenario.id]
            const showResult = a2Locked
            const isCorrect = pick === scenario.dominantFactor
            return (
              <div key={scenario.id} className={`border-2 rounded-xl p-4 ${showResult ? (isCorrect ? 'border-emerald-300 bg-emerald-50' : 'border-red-200 bg-red-50') : 'border-slate-200'}`}>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-700">{scenario.platform}</span>
                <div className="text-sm text-slate-700 italic mt-2 mb-3 bg-white border border-slate-100 rounded-lg p-3">"{scenario.description}"</div>
                <div className="flex flex-wrap gap-2">
                  {ALGORITHM_FACTORS.map(factor => (
                    <button key={factor} disabled={a2Locked || isViewer}
                      onClick={() => setA2Picks(prev => ({ ...prev, [scenario.id]: factor }))}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border-2 transition-all ${pick === factor ? 'border-brand-500 bg-brand-500 text-white' : 'border-slate-200 bg-white text-slate-600 hover:border-brand-300'} ${showResult && factor === scenario.dominantFactor ? 'ring-2 ring-emerald-400' : ''} disabled:cursor-default`}>
                      {factor}
                    </button>
                  ))}
                </div>
                {showResult && <div className={`mt-2 text-xs ${isCorrect ? 'text-emerald-700' : 'text-red-700'}`}>{isCorrect ? '✓ ' : `Answer: ${scenario.dominantFactor} — `}{scenario.explanation}</div>}
              </div>
            )
          })}
        </div>
        {!a2Locked && !isViewer && <button className="btn-success" onClick={() => confirmSubmit(submitA2)} disabled={Object.keys(a2Picks).length < ALGORITHM_SCENARIOS.length}>Submit Answers</button>}
        {a2Locked && scores.b3a2 && <FeedbackPanel score={scores.b3a2.points} max={5}
          why={`${ALGORITHM_SCENARIOS.filter(s => a2Picks[s.id] === s.dominantFactor).length}/${ALGORITHM_SCENARIOS.length} correct. Each platform rewards different behaviours.`}
          keyLearning={['TikTok rewards completion rate — 15 seconds watched to the end beats 60 seconds abandoned.', 'Instagram weights saves as the highest engagement signal — saveable content gets distributed wider.', 'YouTube tracks Average View Duration — longer watch time = more ad revenue = algorithmic reward.']} />}
      </ActivityCard>

      {/* A11: Simulator */}
      <ActivityCard number={11} title="Social Lab — Simulator" subtitle="Enter your team's Social Lab simulator scores" points={scores.b3a3?.points || 0}>
        <Alert type="info">🎮 Run the Social Lab simulator separately. Enter each team member's score below — your team average converts to workshop points.</Alert>
        <div className="flex gap-3 flex-wrap mb-4">
          {[0,1,2,3,4].map(i => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className="text-[10px] text-slate-400 font-semibold">Score {i+1}</div>
              <input type="number" min={0} max={100} value={simVals[i] ?? ''} onChange={e => handleSim(i, e.target.value)}
                placeholder="—" disabled={isViewer}
                className="w-16 text-center font-bold text-base border-2 border-slate-200 rounded-lg py-2 outline-none focus:border-brand-400 disabled:bg-slate-50" />
            </div>
          ))}
        </div>
        {simAvg !== null && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-sm">
            Team average: <strong>{simAvg.toFixed(1)}</strong> → <strong>{simPts(simAvg)} workshop points</strong>
            <div className="text-xs text-slate-500 mt-0.5">90+ = 5pts · 80+ = 4pts · 70+ = 3pts · 60+ = 2pts · below 60 = 1pt</div>
          </div>
        )}
      </ActivityCard>
    </div>
  )
}
