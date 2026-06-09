import { useState } from 'react'
import { useWorkspaceStore } from '../../store/workspace'
import { CAMPAIGN_DATA, FUNNEL_DATA, FUNNEL_OPTIMISATION_ACTIONS, KPI_OPTIONS } from '../../data/workshop'
import { ActivityCard, FeedbackPanel, Alert, MultiChoice, confirmSubmit } from '../ui/shared'

export function Block6() {
  const { scores, responses, updateScore, updateResponse, lockActivity } = useWorkspaceStore()
  const isViewer = useWorkspaceStore(s => s.isViewer)
  const objectives = (responses['b2a5_objectives'] as string[]) || []

  // A19: Campaign Diagnosis
  const a1Locked = !!(responses['b6a1_locked'])
  const [a1Strengths, setA1Strengths] = useState<string[]>((responses['b6a1_strengths'] as string[]) || [])
  const [a1Weaknesses, setA1Weaknesses] = useState<string[]>((responses['b6a1_weaknesses'] as string[]) || [])
  const [a1Priority, setA1Priority] = useState<string>((responses['b6a1_priority'] as string) || '')

  const submitA1 = () => {
    const correctStrengths = CAMPAIGN_DATA.filter(m => m.status === 'good').map(m => m.metric)
    const correctWeaknesses = CAMPAIGN_DATA.filter(m => m.status === 'bad').map(m => m.metric)
    const sHits = a1Strengths.filter(s => correctStrengths.includes(s)).length
    const wHits = a1Weaknesses.filter(w => correctWeaknesses.includes(w)).length
    const pts = Math.min(5, sHits + wHits + (a1Priority ? 1 : 0))
    updateScore('b6a1', pts, 5)
    updateResponse({ b6a1_strengths: a1Strengths, b6a1_weaknesses: a1Weaknesses, b6a1_priority: a1Priority, b6a1_locked: true })
    lockActivity('b6a1')
  }

  // A20: Funnel Analysis
  const a2Locked = !!(responses['b6a2_locked'])
  const [a2Bottleneck, setA2Bottleneck] = useState<string>((responses['b6a2_bottleneck'] as string) || '')
  const [a2Actions, setA2Actions] = useState<string[]>((responses['b6a2_actions'] as string[]) || [])

  const submitA2 = () => {
    const highValueActions = ['landing_page', 'retargeting', 'in_app', 'better_targeting']
    const pts = Math.min(5, (a2Bottleneck ? 1 : 0) + (a2Actions.filter(a => highValueActions.includes(a)).length * 1.5 | 0) + (a2Actions.length >= 3 ? 1 : 0))
    updateScore('b6a2', pts, 5)
    updateResponse({ b6a2_bottleneck: a2Bottleneck, b6a2_actions: a2Actions, b6a2_locked: true })
    lockActivity('b6a2')
  }

  // A21: Measurement Dashboard - PITCH
  const KPI_STAGES = ['Awareness', 'Engagement', 'Conversion', 'Advocacy'] as const
  const a3Locked = !!(responses['b6a3_locked'])
  const [a3KPIs, setA3KPIs] = useState<Record<string, string[]>>((responses['b6a3_kpis'] as Record<string, string[]>) || {})

  const submitA3 = () => {
    const stagesWithKPIs = KPI_STAGES.filter(s => (a3KPIs[s] || []).length > 0).length
    const total = KPI_STAGES.reduce((sum, s) => sum + (a3KPIs[s] || []).length, 0)
    const pts = Math.min(5, stagesWithKPIs + (total >= 8 ? 1 : 0))
    updateScore('b6a3', pts, 5)
    updateResponse({ b6a3_kpis: a3KPIs, b6a3_locked: true })
    lockActivity('b6a3')
  }

  // Biggest funnel drop
  const biggestDrop = FUNNEL_DATA.reduce((biggest, stage, i) => {
    if (i === 0) return biggest
    const drop = (FUNNEL_DATA[i-1].users - stage.users) / FUNNEL_DATA[i-1].users * 100
    return drop > biggest.drop ? { stage: stage.stage, drop } : biggest
  }, { stage: '', drop: 0 })

  return (
    <div>
      {/* A19: Campaign Diagnosis */}
      <ActivityCard number={19} title="Campaign Diagnosis" subtitle="Analyse Nike's campaign performance data and identify what to fix" points={scores.b6a1?.points || 0} locked={a1Locked}>
        <Alert type="info">📊 Review Nike's current campaign metrics. Identify what's working, what's underperforming, and your single highest priority fix. Metrics reveal the diagnosis — submit before seeing the answers.</Alert>
        <div className="overflow-x-auto mb-4">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {['Metric', 'Value', ...(a1Locked ? ['Insight'] : [])].map(h => <th key={h} className="text-left px-3 py-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-200">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {CAMPAIGN_DATA.map(row => (
                <tr key={row.metric} className="border-b border-slate-100">
                  <td className="px-3 py-2.5 font-semibold text-slate-700 text-sm">{row.metric}</td>
                  <td className="px-3 py-2.5 font-bold font-mono text-sm">{row.value}</td>
                  {a1Locked && <td className={`px-3 py-2.5 text-xs ${row.status === 'good' ? 'text-emerald-600' : row.status === 'bad' ? 'text-red-600' : 'text-slate-500'}`}>{row.insight}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Campaign Strengths</div>
            <div className="space-y-1.5">
              {CAMPAIGN_DATA.map(m => (
                <button key={m.metric} disabled={a1Locked || isViewer}
                  onClick={() => { if (a1Locked || isViewer) return; setA1Strengths(prev => prev.includes(m.metric) ? prev.filter(s => s !== m.metric) : [...prev, m.metric]) }}
                  className={`w-full text-left px-3 py-2 rounded-lg border-2 text-xs transition-all ${a1Strengths.includes(m.metric) ? 'border-emerald-500 bg-emerald-50 text-emerald-800' : 'border-slate-200 text-slate-600 hover:border-emerald-300'} ${a1Locked && m.status === 'good' ? 'ring-1 ring-emerald-400' : ''} disabled:cursor-default`}>
                  {m.metric}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Underperforming Areas</div>
            <div className="space-y-1.5">
              {CAMPAIGN_DATA.map(m => (
                <button key={m.metric} disabled={a1Locked || isViewer}
                  onClick={() => { if (a1Locked || isViewer) return; setA1Weaknesses(prev => prev.includes(m.metric) ? prev.filter(w => w !== m.metric) : [...prev, m.metric]) }}
                  className={`w-full text-left px-3 py-2 rounded-lg border-2 text-xs transition-all ${a1Weaknesses.includes(m.metric) ? 'border-red-400 bg-red-50 text-red-800' : 'border-slate-200 text-slate-600 hover:border-red-300'} ${a1Locked && m.status === 'bad' ? 'ring-1 ring-red-400' : ''} disabled:cursor-default`}>
                  {m.metric}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="mb-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Single Highest Priority Fix</div>
          <div className="space-y-1.5">
            {CAMPAIGN_DATA.filter(m => m.status !== 'good').map(m => (
              <button key={m.metric} disabled={a1Locked || isViewer}
                onClick={() => !a1Locked && !isViewer && setA1Priority(m.metric)}
                className={`w-full text-left px-3 py-2 rounded-xl border-2 text-sm transition-all ${a1Priority === m.metric ? 'border-brand-500 bg-brand-50 text-brand-800' : 'border-slate-200 text-slate-600 hover:border-brand-300'} disabled:cursor-default`}>
                {m.metric}{a1Locked ? ` — ${m.insight}` : ''}
              </button>
            ))}
          </div>
        </div>
        {!a1Locked && !isViewer && <button className="btn-success" onClick={() => confirmSubmit(submitA1)} disabled={a1Strengths.length === 0 || a1Weaknesses.length === 0 || !a1Priority}>Submit Diagnosis</button>}
        {a1Locked && scores.b6a1 && <FeedbackPanel score={scores.b6a1.points} max={5}
          why={`Strengths: ${CAMPAIGN_DATA.filter(m => m.status === 'good').map(m => m.metric).join(', ')}. Weaknesses: ${CAMPAIGN_DATA.filter(m => m.status === 'bad').map(m => m.metric).join(', ')}.`}
          keyLearning={['High impressions + low engagement = right audience, wrong content — fix the creative.', 'High engagement + low ROAS = right content, wrong commercial funnel — fix the conversion path.', 'Always diagnose before optimising — fixing the wrong thing wastes budget and time.']} />}
      </ActivityCard>

      {/* A20: Funnel Analysis */}
      <ActivityCard number={20} title="Funnel Analysis" subtitle="Identify where Nike is losing users and how to fix it" points={scores.b6a2?.points || 0} locked={a2Locked}>
        <Alert type="info">🔍 Review Nike's conversion funnel. Identify the biggest drop-off and select the right optimisation actions.</Alert>
        <div className="space-y-2 mb-5">
          {FUNNEL_DATA.map((stage, i) => {
            const width = Math.max(15, Math.round(stage.users / FUNNEL_DATA[0].users * 100))
            const drop = i > 0 ? (FUNNEL_DATA[i-1].users - stage.users) / FUNNEL_DATA[i-1].users * 100 : 0
            const isBottleneck = drop > 70
            return (
              <div key={stage.stage}>
                <div className="flex items-center gap-3 mb-0.5">
                  <div className="text-xs font-semibold text-slate-600 w-36 flex-shrink-0">{stage.stage}</div>
                  <div className="flex-1 bg-slate-100 rounded-full h-8 overflow-hidden">
                    <div className={`h-full rounded-full flex items-center justify-end pr-3 ${isBottleneck ? 'bg-red-400' : 'bg-brand-500'}`} style={{ width: `${width}%` }}>
                      <span className="text-white text-xs font-bold">{stage.users.toLocaleString()}</span>
                    </div>
                  </div>
                  {stage.dropoff && <div className="text-[10px] text-red-500 w-28 flex-shrink-0">↓ {stage.dropoff}</div>}
                </div>
              </div>
            )
          })}
        </div>
        <div className="mb-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Where is the biggest drop-off?</div>
          <div className="space-y-1.5">
            {FUNNEL_DATA.slice(1).map(stage => (
              <button key={stage.stage} disabled={a2Locked || isViewer}
                onClick={() => !a2Locked && !isViewer && setA2Bottleneck(stage.stage)}
                className={`w-full text-left px-3 py-2 rounded-xl border-2 text-sm transition-all ${a2Bottleneck === stage.stage ? 'border-brand-500 bg-brand-50' : 'border-slate-200 hover:border-brand-300'} disabled:cursor-default`}>
                {stage.stage}
              </button>
            ))}
          </div>
          {a2Locked && <div className="text-xs text-emerald-600 mt-2">Biggest drop: {biggestDrop.stage} ({biggestDrop.drop.toFixed(0)}% lost)</div>}
        </div>
        <div className="mb-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Select optimisation actions (2–4)</div>
          <MultiChoice disabled={a2Locked || isViewer} selected={a2Actions} onChange={setA2Actions} max={4}
            options={FUNNEL_OPTIMISATION_ACTIONS.map(a => ({ id: a.id, label: a.label }))} />
        </div>
        {!a2Locked && !isViewer && <button className="btn-success" onClick={() => confirmSubmit(submitA2)} disabled={!a2Bottleneck || a2Actions.length < 2}>Submit Analysis</button>}
        {a2Locked && scores.b6a2 && <FeedbackPanel score={scores.b6a2.points} max={5}
          why="Priority actions: landing page redesign (52% bounce rate is critical), retargeting cart abandoners (68% abandon is the biggest recoverable loss), in-app checkout (removes platform friction)."
          keyLearning={['Fix the biggest drop first — Nike loses 99.1% of people who see the ad before they even click.', 'Retargeting campaigns have 3–5x higher conversion rates than cold audiences.', 'In-app social commerce removes the largest single friction point in Nike\'s conversion funnel.']} />}
      </ActivityCard>

      {/* A21: Measurement Dashboard */}
      <ActivityCard number={21} title="Measurement Dashboard" subtitle="Select Nike's KPIs per funnel stage — feeds your Agency Pitch" points={scores.b6a3?.points || 0} locked={a3Locked} isPitch>
        <Alert type="info">📋 A strong measurement framework covers all four funnel stages. Choose 2–3 meaningful KPIs per stage — avoid vanity metrics that look good but don't drive decisions.</Alert>
        <div className="space-y-5 mb-4">
          {KPI_STAGES.map(stage => {
            const stageKPIs = KPI_OPTIONS.filter(k => k.stage === stage)
            const selected = a3KPIs[stage] || []
            return (
              <div key={stage} className="border border-slate-200 rounded-xl p-4">
                <div className="font-bold text-slate-900 text-sm mb-3">{stage}</div>
                <div className="space-y-1.5">
                  {stageKPIs.map(kpi => {
                    const sel = selected.includes(kpi.id)
                    return (
                      <button key={kpi.id} disabled={a3Locked || isViewer}
                        onClick={() => { if (a3Locked || isViewer) return; setA3KPIs(prev => ({ ...prev, [stage]: sel ? selected.filter(s => s !== kpi.id) : [...selected, kpi.id] })) }}
                        className={`w-full text-left p-2.5 rounded-lg border-2 text-xs transition-all ${sel ? 'border-brand-500 bg-brand-50' : 'border-slate-200 hover:border-brand-300'} disabled:cursor-default`}>
                        <div className={`font-semibold ${sel ? 'text-brand-700' : 'text-slate-800'}`}>{kpi.label}</div>
                        <div className="text-slate-400">{kpi.desc}</div>
                      </button>
                    )
                  })}
                </div>
                <div className="text-[10px] text-slate-400 mt-2">{selected.length} KPIs selected for {stage}</div>
              </div>
            )
          })}
        </div>
        {!a3Locked && !isViewer && <button className="btn-success" onClick={() => confirmSubmit(submitA3)} disabled={KPI_STAGES.filter(s => (a3KPIs[s] || []).length > 0).length < 4}>Submit Framework</button>}
        {a3Locked && scores.b6a3 && <FeedbackPanel score={scores.b6a3.points} max={5}
          why="Quality: all 4 stages covered + 8+ total KPIs. KPIs must match the funnel stage — tracking conversion rate for an awareness campaign is a category error."
          example="Awareness: Reach, Share of Voice, Video Completion Rate. Engagement: Engagement Rate, Save Rate, Share Rate. Conversion: ROAS, Conversion Rate, CPA. Advocacy: UGC Volume, Community Growth Rate, NPS."
          keyLearning={['Saves are the most underrated metric — they signal intent to return and purchase.', 'ROAS is the ultimate conversion metric but requires proper attribution to be accurate.', 'Advocacy metrics prove social investment is building long-term brand equity — not just short-term campaigns.']} />}
      </ActivityCard>
    </div>
  )
}
