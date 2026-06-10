import { useState } from 'react'
import { useWorkspaceStore } from '../../store/workspace'
import { PLATFORMS_TO_PRIORITISE, PLATFORM_PRIORITY_OPTIONS, ALGORITHM_SCENARIOS, ALGORITHM_FACTORS, OBJECTIVE_OPTIONS } from '../../data/workshop'
import { ActivityCard, FeedbackPanel, Alert, confirmSubmit } from '../ui/shared'

export function Block3() {
  const { scores, responses, updateScore, updateResponse, lockActivity } = useWorkspaceStore()
  const isViewer = useWorkspaceStore(s => s.isViewer)
  const objectives = (responses['b2a5_objectives'] as string[]) || []

  // b3a2: Algorithm Detective (shown first as A9)
  const algLocked = !!(responses['b3a2_locked'])
  const [algPicks, setAlgPicks] = useState<Record<string, string>>((responses['b3a2_picks'] as Record<string, string>) || {})

  const submitAlg = () => {
    const correct = ALGORITHM_SCENARIOS.filter(s => algPicks[s.id] === s.dominantFactor).length
    const pts = Math.min(5, correct + (correct === ALGORITHM_SCENARIOS.length ? 2 : 0))
    updateScore('b3a2', pts, 5)
    updateResponse({ b3a2_picks: algPicks, b3a2_locked: true })
    lockActivity('b3a2')
  }

  // b3a1: Platform Selection (shown second as A10)
  const platLocked = !!(responses['b3a1_locked'])
  const [platPriorities, setPlatPriorities] = useState<Record<string, string>>((responses['b3a1_priorities'] as Record<string, string>) || {})

  const submitPlat = () => {
    const correctByObj = PLATFORMS_TO_PRIORITISE.filter(p =>
      objectives.some(obj => p.objectiveFit.includes(obj)) && platPriorities[p.id] === 'Primary'
    ).length
    const primaries = Object.values(platPriorities).filter(v => v === 'Primary').length
    const goodSpread = primaries >= 2 && primaries <= 3
    const pts = Math.min(5, correctByObj + (goodSpread ? 1 : 0) + (Object.keys(platPriorities).length >= 5 ? 1 : 0))
    updateScore('b3a1', pts, 5)
    updateResponse({ b3a1_priorities: platPriorities, b3a1_locked: true })
    lockActivity('b3a1')
  }

  const priorityColors: Record<string, string> = {
    'Primary': 'border-brand-500 bg-brand-500 text-white',
    'Secondary': 'border-teal-500 bg-teal-50 text-teal-700',
    'Monitor': 'border-amber-400 bg-amber-50 text-amber-700',
    'Not relevant': 'border-slate-300 bg-slate-100 text-slate-500',
  }

  const objectiveLabels = objectives.map(id => OBJECTIVE_OPTIONS.find(o => o.id === id)?.type || id).join(' + ')

  return (
    <div>

      {/* A9: Algorithm Detective — first */}
      <ActivityCard number={9} title="Algorithm Detective" subtitle="Identify the dominant algorithm factor behind each Nike content success" points={scores.b3a2?.points || 0} locked={algLocked}>
        <Alert type="info">🔍 Each scenario shows a surprising Nike content result. Which algorithm factor was most responsible? Submit to see the answers.</Alert>
        <div className="space-y-5 mb-4">
          {ALGORITHM_SCENARIOS.map(scenario => {
            const pick = algPicks[scenario.id]
            const showResult = algLocked
            const isCorrect = pick === scenario.dominantFactor
            return (
              <div key={scenario.id} className={`border-2 rounded-xl p-4 ${showResult ? (isCorrect ? 'border-emerald-300 bg-emerald-50' : 'border-red-200 bg-red-50') : 'border-slate-200'}`}>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-700">{scenario.platform}</span>
                <div className="text-sm text-slate-700 italic mt-2 mb-3 bg-white border border-slate-100 rounded-lg p-3">"{scenario.description}"</div>
                <div className="flex flex-wrap gap-2">
                  {ALGORITHM_FACTORS.map(factor => (
                    <button key={factor} disabled={algLocked || isViewer}
                      onClick={() => setAlgPicks(prev => ({ ...prev, [scenario.id]: factor }))}
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
        {!algLocked && !isViewer && <button className="btn-success" onClick={() => confirmSubmit(submitAlg)} disabled={Object.keys(algPicks).length < ALGORITHM_SCENARIOS.length}>Submit Answers</button>}
        {algLocked && scores.b3a2 && <FeedbackPanel score={scores.b3a2.points} max={5}
          why={`${ALGORITHM_SCENARIOS.filter(s => algPicks[s.id] === s.dominantFactor).length}/${ALGORITHM_SCENARIOS.length} correct. Each platform rewards different behaviours.`}
          keyLearning={['TikTok rewards completion rate — 15 seconds watched beats 60 seconds abandoned.', 'Instagram weights saves as the highest engagement signal — saveable content gets distributed wider.', 'YouTube tracks Average View Duration — longer watch time = more algorithmic reward.']} />}
      </ActivityCard>

      {/* A10: Platform Selection — second */}
      <ActivityCard number={10} title="Platform Selection" subtitle="Set priority levels for Nike across each platform — feeds your Agency Pitch" points={scores.b3a1?.points || 0} locked={platLocked} isPitch>
        {objectives.length > 0 && (
          <div className="bg-brand-50 border border-brand-200 rounded-xl p-3 mb-4 text-xs text-brand-700">
            <strong>Your objectives:</strong> {objectiveLabels}. Think about which platforms best reach your target audience and support these goals.
          </div>
        )}
        <Alert type="info">📊 Assign a priority to each platform for Nike's campaign. Aim for 2–3 Primary platforms — consider your target audience, your objectives, and where Nike can make the most impact. Spreading too thin hurts performance.</Alert>
        <div className="space-y-3 mb-4">
          {PLATFORMS_TO_PRIORITISE.map(platform => {
            const pick = platPriorities[platform.id]
            return (
              <div key={platform.id} className={`border-2 rounded-xl p-3 transition-all ${platLocked && pick === 'Primary' ? 'border-emerald-300' : 'border-slate-200'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="text-sm font-bold text-slate-800 flex-1">{platform.name}</div>
                  {platLocked && <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${platform.audienceFit === 'high' ? 'bg-emerald-100 text-emerald-700' : platform.audienceFit === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>{platform.audienceFit} audience fit</span>}
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  {PLATFORM_PRIORITY_OPTIONS.map(level => (
                    <button key={level} disabled={platLocked || isViewer}
                      onClick={() => setPlatPriorities(prev => ({ ...prev, [platform.id]: level }))}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold border-2 transition-all ${pick === level ? priorityColors[level] : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'} disabled:cursor-default`}>
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
        {!platLocked && !isViewer && <button className="btn-success" onClick={() => confirmSubmit(submitPlat)} disabled={Object.keys(platPriorities).length < 4}>Submit Strategy</button>}
        {platLocked && scores.b3a1 && <FeedbackPanel score={scores.b3a1.points} max={5}
          why="For Nike's 18–24 female audience: Instagram and TikTok should be Primary. YouTube is strong Secondary. LinkedIn is not relevant."
          keyLearning={['Depth beats breadth — Primary platforms get 70% of content and budget.', 'Platform selection must follow your audience and objectives, not habit.', 'For Nike\'s target: TikTok for discovery, Instagram for community, YouTube for depth.']} />}
      </ActivityCard>

    </div>
  )
}
