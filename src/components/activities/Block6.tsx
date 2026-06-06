import { useState } from 'react'
import { useWorkspaceStore } from '../../store/workspace'
import { CAMPAIGN_DATA, FUNNEL_DATA, KPI_OPTIONS, ACTIVITY_DISPLAY_NUM } from '../../data/workshop'
import { ActivityCard, FeedbackPanel, Alert, MultiChoice, confirmSubmit } from '../ui/shared'
import type { Brand } from '../../types'

const N = ACTIVITY_DISPLAY_NUM

export function Block6() {
  const { team, scores, responses, updateScore, updateResponse, lockActivity } = useWorkspaceStore()
  const isViewer = useWorkspaceStore(s => s.isViewer)
  const brand = (team?.brand || 'Nike') as Brand
  const campaignData = CAMPAIGN_DATA[brand]
  const funnelData = FUNNEL_DATA[brand]

  // ── B6A1: Campaign Diagnosis ──────────────────────────────
  const a1Locked = !!(responses['b6a1_locked'])
  const [a1Strengths, setA1Strengths] = useState<string[]>((responses['b6a1_strengths'] as string[]) || [])
  const [a1Weaknesses, setA1Weaknesses] = useState<string[]>((responses['b6a1_weaknesses'] as string[]) || [])
  const [a1Priority, setA1Priority] = useState<string>((responses['b6a1_priority'] as string) || '')

  const submitA1 = () => {
    const correctStrengths = campaignData.filter(m => m.status === 'good').map(m => m.metric)
    const correctWeaknesses = campaignData.filter(m => m.status === 'bad').map(m => m.metric)
    const strengthHits = a1Strengths.filter(s => correctStrengths.includes(s)).length
    const weaknessHits = a1Weaknesses.filter(w => correctWeaknesses.includes(w)).length
    const hasPriority = !!a1Priority
    const cPts = (a1Strengths.length > 0 && a1Weaknesses.length > 0 && hasPriority) ? 2 : (a1Strengths.length > 0 || a1Weaknesses.length > 0) ? 1 : 0
    const qPts = Math.min(3, strengthHits + weaknessHits + (hasPriority ? 1 : 0))
    updateScore('b6a1', Math.min(5, cPts + qPts), 5, cPts, qPts)
    updateResponse({ b6a1_strengths: a1Strengths, b6a1_weaknesses: a1Weaknesses, b6a1_priority: a1Priority, b6a1_locked: true })
    lockActivity('b6a1')
  }

  // ── B6A2: Funnel Analysis ─────────────────────────────────
  const a2Locked = !!(responses['b6a2_locked'])
  const [a2Bottleneck, setA2Bottleneck] = useState<string>((responses['b6a2_bottleneck'] as string) || '')
  const [a2Actions, setA2Actions] = useState<string[]>((responses['b6a2_actions'] as string[]) || [])

  const OPTIMISATION_ACTIONS = [
    { id: 'improve_cta', label: 'Improve ad CTA to increase click-through rate' },
    { id: 'landing_page', label: 'Redesign landing page to reduce bounce rate' },
    { id: 'reduce_friction', label: 'Simplify product discovery to reduce drop-off' },
    { id: 'retargeting', label: 'Add retargeting campaign to recover abandoned carts' },
    { id: 'social_proof', label: 'Add reviews and UGC to product pages' },
    { id: 'in_app_purchase', label: 'Enable in-app social commerce to remove platform switch' },
    { id: 'better_targeting', label: 'Improve audience targeting to attract higher-intent users' },
    { id: 'content_quality', label: 'Improve content quality to increase engagement rate' },
  ]

  const submitA2 = () => {
    const hasBottleneck = !!a2Bottleneck
    const hasActions = a2Actions.length >= 2
    const cPts = hasBottleneck && hasActions ? 2 : hasBottleneck || hasActions ? 1 : 0
    const highValueActions = ['landing_page', 'retargeting', 'in_app_purchase', 'better_targeting']
    const qPts = Math.min(3, (hasBottleneck ? 1 : 0) + (a2Actions.filter(a => highValueActions.includes(a)).length >= 1 ? 1 : 0) + (a2Actions.length >= 3 ? 1 : 0))
    updateScore('b6a2', Math.min(5, cPts + qPts), 5, cPts, qPts)
    updateResponse({ b6a2_bottleneck: a2Bottleneck, b6a2_actions: a2Actions, b6a2_locked: true })
    lockActivity('b6a2')
  }

  // ── B6A3: Measurement Dashboard ───────────────────────────
  const a3Locked = !!(responses['b6a3_locked'])
  const KPI_STAGES = ['Awareness', 'Engagement', 'Conversion', 'Advocacy'] as const
  const [a3KPIs, setA3KPIs] = useState<Record<string, string[]>>(
    (responses['b6a3_kpis'] as Record<string, string[]>) || {}
  )

  const submitA3 = () => {
    const stagesWithKPIs = KPI_STAGES.filter(s => (a3KPIs[s] || []).length > 0).length
    const totalKPIs = KPI_STAGES.reduce((sum, s) => sum + (a3KPIs[s] || []).length, 0)
    const cPts = stagesWithKPIs >= 4 ? 2 : stagesWithKPIs >= 2 ? 1 : 0
    const qPts = Math.min(3, (stagesWithKPIs >= 4 ? 1 : 0) + (totalKPIs >= 6 ? 1 : 0) + (stagesWithKPIs === 4 && totalKPIs >= 8 ? 1 : 0))
    updateScore('b6a3', Math.min(5, cPts + qPts), 5, cPts, qPts)
    updateResponse({ b6a3_kpis: a3KPIs, b6a3_locked: true })
    lockActivity('b6a3')
  }

  // Find biggest funnel drop
  const biggestDrop = funnelData.reduce((biggest, stage, i) => {
    if (i === 0 || i === funnelData.length - 1) return biggest
    const drop = ((funnelData[i-1].users - stage.users) / funnelData[i-1].users * 100)
    return drop > biggest.drop ? { stage: stage.stage, drop } : biggest
  }, { stage: '', drop: 0 })

  return (
    <div>
      {/* B6A1: Campaign Diagnosis */}
      <ActivityCard number={N.b6a1} title="Campaign Diagnosis" subtitle="Analyse your brand's campaign performance data" points={scores.b6a1?.points || 0} locked={a1Locked}>
        <Alert type="info">📊 Review <strong>{brand}'s</strong> campaign metrics below. Identify what's working, what's underperforming, and your single highest priority fix.</Alert>

        {/* Metrics table */}
        <div className="overflow-x-auto mb-4">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50">
                {['Metric', 'Value', 'Status', 'Insight'].map(h => (
                  <th key={h} className="text-left px-3 py-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-200">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {campaignData.map(row => (
                <tr key={row.metric} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-3 py-2.5 font-semibold text-slate-700">{row.metric}</td>
                  <td className="px-3 py-2.5 font-bold font-mono">{row.value}</td>
                  <td className="px-3 py-2.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${row.status === 'good' ? 'bg-emerald-100 text-emerald-700' : row.status === 'bad' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                      {row.status === 'good' ? '✓ Strong' : row.status === 'bad' ? '✗ Weak' : '~ OK'}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-xs text-slate-500">{row.insight}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Campaign Strengths (select all that apply)</div>
            <div className="space-y-1.5">
              {campaignData.map(m => (
                <button key={m.metric} disabled={a1Locked || isViewer}
                  onClick={() => {
                    if (a1Locked || isViewer) return
                    setA1Strengths(prev => prev.includes(m.metric) ? prev.filter(s => s !== m.metric) : [...prev, m.metric])
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded-lg border-2 text-xs transition-all ${a1Strengths.includes(m.metric) ? 'border-emerald-500 bg-emerald-50 text-emerald-800' : 'border-slate-200 text-slate-600 hover:border-emerald-300'} ${a1Locked && m.status === 'good' ? 'ring-1 ring-emerald-400' : ''}`}>
                  {m.metric}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Areas Underperforming (select all that apply)</div>
            <div className="space-y-1.5">
              {campaignData.map(m => (
                <button key={m.metric} disabled={a1Locked || isViewer}
                  onClick={() => {
                    if (a1Locked || isViewer) return
                    setA1Weaknesses(prev => prev.includes(m.metric) ? prev.filter(w => w !== m.metric) : [...prev, m.metric])
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded-lg border-2 text-xs transition-all ${a1Weaknesses.includes(m.metric) ? 'border-red-400 bg-red-50 text-red-800' : 'border-slate-200 text-slate-600 hover:border-red-300'} ${a1Locked && m.status === 'bad' ? 'ring-1 ring-red-400' : ''}`}>
                  {m.metric}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Single Highest Priority Fix</div>
          <div className="space-y-1.5">
            {campaignData.filter(m => m.status === 'bad' || m.status === 'ok').map(m => (
              <button key={m.metric} disabled={a1Locked || isViewer}
                onClick={() => !a1Locked && !isViewer && setA1Priority(m.metric)}
                className={`w-full text-left px-3 py-2 rounded-xl border-2 text-sm transition-all ${a1Priority === m.metric ? 'border-brand-500 bg-brand-50 text-brand-800' : 'border-slate-200 text-slate-600 hover:border-brand-300'} ${(a1Locked || isViewer) ? 'cursor-default' : ''}`}>
                {m.metric} — {m.insight}
              </button>
            ))}
          </div>
        </div>

        {!a1Locked && !isViewer && (
          <button className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-700 disabled:opacity-50"
            onClick={() => confirmSubmit(submitA1)} disabled={a1Strengths.length === 0 || a1Weaknesses.length === 0 || !a1Priority}>
            Submit Diagnosis
          </button>
        )}
        {a1Locked && scores.b6a1 && (
          <FeedbackPanel score={scores.b6a1.points} max={5}
            completionPts={scores.b6a1.completionPts} qualityPts={scores.b6a1.qualityPts}
            why={`Strengths: ${campaignData.filter(m => m.status === 'good').map(m => m.metric).join(', ')}. Weaknesses: ${campaignData.filter(m => m.status === 'bad').map(m => m.metric).join(', ')}.`}
            example={`${brand} diagnosis: Strong on reach and video completion — campaign is being seen and watched. Critical weakness: low ROAS/conversion metrics suggest the awareness is not converting to commercial outcomes. Priority fix: landing page experience — traffic is arriving but not completing the desired action.`}
            keyLearning={[
              'Vanity metrics (impressions, followers) are easy to win but don\'t drive revenue.',
              'High impressions + low engagement = right audience, wrong content — fix the creative.',
              'High engagement + low conversion = right content, wrong landing experience — fix the funnel.',
              'Always diagnose before optimising — fixing the wrong thing wastes time and budget.',
            ]}
          />
        )}
      </ActivityCard>

      {/* B6A2: Funnel Analysis */}
      <ActivityCard number={N.b6a2} title="Funnel Analysis" subtitle="Identify where users are being lost and how to fix it" points={scores.b6a2?.points || 0} locked={a2Locked}>
        <Alert type="info">🔍 Review <strong>{brand}'s</strong> conversion funnel. Identify the biggest drop-off point and select optimisation actions.</Alert>

        {/* Funnel visualisation */}
        <div className="space-y-2 mb-5">
          {funnelData.map((stage, i) => {
            const width = Math.max(20, Math.round((stage.users / funnelData[0].users) * 100))
            const isBottleneck = i > 0 && ((funnelData[i-1].users - stage.users) / funnelData[i-1].users * 100) > 50
            return (
              <div key={stage.stage}>
                <div className="flex items-center gap-3 mb-1">
                  <div className="text-xs font-semibold text-slate-600 w-36 flex-shrink-0">{stage.stage}</div>
                  <div className="flex-1 bg-slate-100 rounded-full h-8 relative overflow-hidden">
                    <div className={`h-full rounded-full flex items-center justify-end pr-3 transition-all ${isBottleneck ? 'bg-red-400' : 'bg-brand-500'}`} style={{ width: `${width}%` }}>
                      <span className="text-white text-xs font-bold">{stage.users.toLocaleString()}</span>
                    </div>
                  </div>
                  {stage.dropoff && <div className="text-[10px] text-red-500 w-32 flex-shrink-0">↓ {stage.dropoff}</div>}
                </div>
              </div>
            )
          })}
        </div>

        <div className="mb-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Where is the biggest drop-off?</div>
          <div className="space-y-1.5">
            {funnelData.slice(1).map(stage => (
              <button key={stage.stage} disabled={a2Locked || isViewer}
                onClick={() => !a2Locked && !isViewer && setA2Bottleneck(stage.stage)}
                className={`w-full text-left px-3 py-2 rounded-xl border-2 text-sm transition-all ${a2Bottleneck === stage.stage ? 'border-brand-500 bg-brand-50' : 'border-slate-200 hover:border-brand-300'} ${(a2Locked || isViewer) ? 'cursor-default' : ''}`}>
                {stage.stage}
              </button>
            ))}
          </div>
          {a2Locked && <div className="text-xs text-emerald-600 mt-2">Biggest drop: {biggestDrop.stage} ({biggestDrop.drop.toFixed(0)}% lost)</div>}
        </div>

        <div className="mb-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Select optimisation actions (choose 2–4)</div>
          <MultiChoice disabled={a2Locked || isViewer} selected={a2Actions} onChange={setA2Actions} max={4}
            options={OPTIMISATION_ACTIONS.map(a => ({ id: a.id, label: a.label }))} />
        </div>

        {!a2Locked && !isViewer && (
          <button className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-700 disabled:opacity-50"
            onClick={() => confirmSubmit(submitA2)} disabled={!a2Bottleneck || a2Actions.length < 2}>
            Submit Analysis
          </button>
        )}
        {a2Locked && scores.b6a2 && (
          <FeedbackPanel score={scores.b6a2.points} max={5}
            completionPts={scores.b6a2.completionPts} qualityPts={scores.b6a2.qualityPts}
            why={`The funnel shows the biggest drop at the conversion stage. High-value optimisations: retargeting abandoned users, improving landing page, and reducing friction with in-app commerce.`}
            example={`${brand} funnel fix: Primary bottleneck is the conversion stage — most users who click don't convert. Priority actions: (1) Retargeting campaign to recover high-intent visitors, (2) Landing page redesign to reduce bounce rate, (3) In-app purchase to eliminate platform friction. These three actions address the funnel issue at source, middle and end.`}
            keyLearning={[
              'Fix the biggest drop first — optimising a small drop when a larger one exists wastes effort.',
              'Retargeting campaigns have 3–5x higher conversion rates than cold campaigns.',
              'Every additional click between discovery and purchase loses ~20% of users.',
              'In-app social commerce removes the largest single friction point in social conversion.',
            ]}
          />
        )}
      </ActivityCard>

      {/* B6A3: Measurement Dashboard */}
      <ActivityCard number={N.b6a3} title="Measurement Dashboard" subtitle="Select the right KPIs for each stage of the funnel" points={scores.b6a3?.points || 0} locked={a3Locked}>
        <Alert type="info">📋 Build a measurement framework for <strong>{brand}</strong>. Select 2–3 KPIs per funnel stage — focus on what actually tells you something is working.</Alert>
        <div className="space-y-5 mb-4">
          {KPI_STAGES.map(stage => {
            const stageKPIs = KPI_OPTIONS.filter(k => k.stage === stage)
            const selected = a3KPIs[stage] || []
            return (
              <div key={stage} className="border border-slate-200 rounded-xl p-4">
                <div className="font-bold text-slate-900 text-sm mb-1">{stage}</div>
                <div className="space-y-1.5">
                  {stageKPIs.map(kpi => {
                    const sel = selected.includes(kpi.id)
                    return (
                      <button key={kpi.id} disabled={a3Locked || isViewer}
                        onClick={() => {
                          if (a3Locked || isViewer) return
                          setA3KPIs(prev => ({
                            ...prev,
                            [stage]: sel ? selected.filter(s => s !== kpi.id) : [...selected, kpi.id]
                          }))
                        }}
                        className={`w-full text-left p-2.5 rounded-lg border-2 text-xs transition-all ${sel ? 'border-brand-500 bg-brand-50' : 'border-slate-200 hover:border-brand-300'} ${(a3Locked || isViewer) ? 'cursor-default' : ''}`}>
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
        {!a3Locked && !isViewer && (
          <button className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-700 disabled:opacity-50"
            onClick={() => confirmSubmit(submitA3)} disabled={KPI_STAGES.filter(s => (a3KPIs[s] || []).length > 0).length < 4}>
            Submit Framework
          </button>
        )}
        {a3Locked && scores.b6a3 && (
          <FeedbackPanel score={scores.b6a3.points} max={5}
            completionPts={scores.b6a3.completionPts} qualityPts={scores.b6a3.qualityPts}
            why="A strong measurement framework covers all four funnel stages with 2–3 meaningful KPIs each. Quality: having KPIs at every stage, 8+ total, and choosing metrics that drive action."
            example="Strong framework: Awareness (Reach, Share of Voice, Brand Mentions), Engagement (Engagement Rate, Saves, Share Rate), Conversion (CTR, Conversion Rate, ROAS), Advocacy (UGC Volume, Community Growth Rate, NPS). Each KPI tells you something different and actionable."
            keyLearning={[
              'Measuring awareness with engagement metrics (and vice versa) is a category error.',
              'Saves are the most underrated metric — they signal intent to return and purchase.',
              'ROAS is the ultimate conversion metric but requires proper attribution to be meaningful.',
              'Advocacy metrics prove that social investment is building long-term brand equity.',
            ]}
          />
        )}
      </ActivityCard>
    </div>
  )
}
