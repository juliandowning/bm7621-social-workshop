import { useRef } from 'react'
import { useWorkspaceStore, selectTotalScore, selectCompletedCount } from '../../store/workspace'
import { OBJECTIVE_OPTIONS, FUTURE_TRENDS, AI_TOOL_CATEGORIES, INFLUENCER_TIERS, INFLUENCER_CONTENT_STYLES, BUDGET_CATEGORIES, SOCIAL_COMMERCE_PLATFORMS, REEL_HOOK_TYPES, CAROUSEL_COVER_APPROACHES, CAROUSEL_CONTENT_TYPES, STORY_MECHANICS, TOTAL_ACTIVITIES } from '../../data/workshop'

function Badge({ children, color = 'brand' }: { children: React.ReactNode; color?: string }) {
  const colors: Record<string, string> = { brand: 'bg-brand-100 text-brand-700', violet: 'bg-violet-100 text-violet-700', teal: 'bg-teal-100 text-teal-700', amber: 'bg-amber-100 text-amber-700', emerald: 'bg-emerald-100 text-emerald-700', red: 'bg-red-100 text-red-700' }
  return <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${colors[color] || colors.brand}`}>{children}</span>
}

function SlideCard({ number, title, ready, children }: { number: number; title: string; ready: boolean; children?: React.ReactNode }) {
  return (
    <div className={`bg-white border-2 rounded-2xl p-5 shadow-sm ${ready ? 'border-violet-200' : 'border-dashed border-slate-200'}`}>
      <div className="flex items-start gap-3 mb-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${ready ? 'bg-violet-600 text-white' : 'bg-slate-200 text-slate-400'}`}>{number}</div>
        <div className="flex-1">
          <div className="font-bold text-slate-900 text-sm">{title}</div>
          {!ready && <div className="text-xs text-slate-400 mt-0.5">Complete the relevant activities to populate this slide</div>}
        </div>
        {ready && <Badge color="violet">✓ Ready</Badge>}
      </div>
      {children && <div className="ml-11">{children}</div>}
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  if (!value) return null
  return (
    <div className="mb-2">
      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</div>
      <div className="text-sm text-slate-800 mt-0.5">{value}</div>
    </div>
  )
}

function Tags({ items }: { items: string[] }) {
  if (!items.length) return null
  return (
    <div className="flex flex-wrap gap-1.5 mt-1">
      {items.map(item => (
        <span key={item} className="text-xs bg-violet-50 border border-violet-200 text-violet-700 px-2.5 py-1 rounded-full">{item}</span>
      ))}
    </div>
  )
}

export function AgencyPitch() {
  const { team, scores, responses } = useWorkspaceStore()
  const total = selectTotalScore(scores)
  const completed = selectCompletedCount(scores)
  const agencyName = team?.name || 'Your Agency'
  const pitchRef = useRef<HTMLDivElement>(null)

  // Pull all pitch data from responses
  const objectives = (responses['b2a5_objectives'] as string[]) || []
  const motivations = (responses['b2a2_motivations'] as string[]) || []
  const painPoints = (responses['b2a2_pain'] as string[]) || []
  const audPlatforms = (responses['b2a2_platforms'] as string[]) || []
  const tactics = (responses['b2a4_tactics'] as string[]) || []
  const platformPriorities = (responses['b3a1_priorities'] as Record<string, string>) || {}
  const campaignName = responses['b4a2_name'] as string
  const campaignMessage = responses['b4a2_message'] as string
  const campaignPromise = responses['b4a2_promise'] as string
  const campaignHero = responses['b4a2_hero'] as string
  const reelHook = responses['b4a3_reel_hook'] as string
  const reelDesc = responses['b4a3_reel_desc'] as string
  const carouselCover = responses['b4a3_carousel_cover'] as string
  const carouselType = responses['b4a3_carousel_type'] as string
  const carouselDesc = responses['b4a3_carousel_desc'] as string
  const storyMechanic = responses['b4a3_story_mechanic'] as string
  const storyDesc = responses['b4a3_story_desc'] as string
  const influencerBrief = responses['b4a3_influencer_brief'] as string
  const infTier = responses['b4a4_tier'] as string
  const infStyle = responses['b4a4_style'] as string
  const infRationale = responses['b4a4_rationale'] as string
  const targeting = (responses['b5a1_targeting'] as Record<string, string[]>) || {}
  const budget = (responses['b5a2_budget'] as Record<string, number>) || {}
  const budgetRationale = responses['b5a2_rationale'] as string
  const commercePlatforms = (responses['b5a3_platforms'] as string[]) || []
  const commerceRationale = responses['b5a3_rationale'] as string
  const kpis = (responses['b6a3_kpis'] as Record<string, string[]>) || {}
  const trendsRanked = (responses['b7a2_ranked'] as string[]) || []
  const trendsRationale = responses['b7a2_rationale'] as string
  const aiSelected = (responses['b7a3_selected'] as Record<string, string[]>) || {}
  const aiRationale = responses['b7a3_rationale'] as string

  const primaryPlatforms = Object.entries(platformPriorities).filter(([, v]) => v === 'Primary').map(([k]) => k)
  const secondaryPlatforms = Object.entries(platformPriorities).filter(([, v]) => v === 'Secondary').map(([k]) => k)

  const readySlides = [
    motivations.length > 0,
    objectives.length > 0,
    primaryPlatforms.length > 0,
    !!campaignName,
    !!reelDesc || !!carouselDesc,
    !!infTier,
    Object.keys(budget).length > 0,
    Object.keys(kpis).length > 0,
    trendsRanked.length > 0,
  ]
  const readyCount = readySlides.filter(Boolean).length

  const exportText = () => {
    const objLabels = objectives.map(id => OBJECTIVE_OPTIONS.find(o => o.id === id)?.label || id)
    const tierLabel = INFLUENCER_TIERS.find(t => t.id === infTier)?.label || infTier
    const styleLabel = INFLUENCER_CONTENT_STYLES?.find((s: {id:string;label:string}) => s.id === infStyle)?.label || infStyle
    const hookLabel = REEL_HOOK_TYPES.find(h => h.id === reelHook)?.label || ''
    const carouselCoverLabel = CAROUSEL_COVER_APPROACHES.find(c => c.id === carouselCover)?.label || ''
    const carouselTypeLabel = CAROUSEL_CONTENT_TYPES.find(c => c.id === carouselType)?.label || ''
    const storyLabel = STORY_MECHANICS.find(s => s.id === storyMechanic)?.label || ''
    const topTrends = trendsRanked.slice(0, 3).map(id => FUTURE_TRENDS.find(t => t.id === id)?.label || id)
    const allAiTools = Object.entries(aiSelected).flatMap(([, tools]) => tools)

    const lines = [
      `╔══════════════════════════════════════════════════╗`,
      `  AGENCY PITCH — ${agencyName.toUpperCase()}`,
      `  Nike Social Media Account`,
      `  Generated: ${new Date().toLocaleString()}`,
      `  Workshop Score: ${total} pts · ${completed}/${TOTAL_ACTIVITIES} activities`,
      `╚══════════════════════════════════════════════════╝`,
      ``,
      `━━━ SLIDE 1: AUDIENCE ANALYSIS ━━━━━━━━━━━━━━━━━━`,
      `Target: Nike's 18–24 female audience`,
      ``,
      `Motivations:`,
      ...motivations.map(m => `  • ${m}`),
      ``,
      `Pain Points:`,
      ...painPoints.map(p => `  • ${p}`),
      ``,
      `Primary Platforms: ${audPlatforms.join(', ') || '—'}`,
      ``,
      `━━━ SLIDE 2: OBJECTIVES ━━━━━━━━━━━━━━━━━━━━━━━━━`,
      ...objLabels.map((label, i) => {
        const obj = OBJECTIVE_OPTIONS.find(o => o.label === label)
        return [`Objective ${i + 1}: ${label}`, `  Metric: ${obj?.metric || ''}`].join('\n')
      }),
      ``,
      `━━━ SLIDE 3: COMMUNITY STRATEGY ━━━━━━━━━━━━━━━━━`,
      `Community Tactics:`,
      ...tactics.map(t => `  • ${t}`),
      ``,
      `━━━ SLIDE 4: CHANNEL STRATEGY ━━━━━━━━━━━━━━━━━━━`,
      `Primary Platforms: ${primaryPlatforms.join(', ') || '—'}`,
      `Secondary Platforms: ${secondaryPlatforms.join(', ') || '—'}`,
      ``,
      `━━━ SLIDE 5: CAMPAIGN PLATFORM ━━━━━━━━━━━━━━━━━━`,
      `Campaign Name: ${campaignName || '—'}`,
      `Core Message: ${campaignMessage || '—'}`,
      `Audience Promise: ${campaignPromise || '—'}`,
      `Hero Concept: ${campaignHero || '—'}`,
      ``,
      `━━━ SLIDE 6: CREATIVE STRATEGY ━━━━━━━━━━━━━━━━━━`,
      `Reel: ${hookLabel ? `[${hookLabel}] ` : ''}${reelDesc || '—'}`,
      `Carousel: ${carouselCoverLabel ? `[${carouselCoverLabel} / ${carouselTypeLabel}] ` : ''}${carouselDesc || '—'}`,
      `Story: ${storyLabel ? `[${storyLabel}] ` : ''}${storyDesc || '—'}`,
      `Influencer Activation: ${influencerBrief || '—'}`,
      ``,
      `━━━ SLIDE 7: INFLUENCER STRATEGY ━━━━━━━━━━━━━━━━`,
      `Tier: ${tierLabel || '—'} | Style: ${styleLabel || '—'}`,
      `Rationale: ${infRationale || '—'}`,
      ``,
      `━━━ SLIDE 8: PAID SOCIAL & COMMERCE ━━━━━━━━━━━━━`,
      `Targeting:`,
      ...(targeting.demographics || []).map((d: string) => `  Demographics: ${d}`),
      ...(targeting.interests || []).map((i: string) => `  Interest: ${i}`),
      ...(targeting.behaviours || []).map((b: string) => `  Behaviour: ${b}`),
      ``,
      `Budget Allocation:`,
      ...BUDGET_CATEGORIES.map(cat => budget[cat.id] ? `  ${cat.label}: ${budget[cat.id]}%` : '').filter(Boolean),
      budgetRationale ? `Rationale: ${budgetRationale}` : '',
      ``,
      `Commerce Platforms: ${commercePlatforms.join(', ') || '—'}`,
      commerceRationale ? `Commerce Rationale: ${commerceRationale}` : '',
      ``,
      `━━━ SLIDE 9: MEASUREMENT FRAMEWORK ━━━━━━━━━━━━━━`,
      ...['Awareness', 'Engagement', 'Conversion', 'Advocacy'].map(stage =>
        kpis[stage]?.length ? `${stage}: ${kpis[stage].join(', ')}` : ''
      ).filter(Boolean),
      ``,
      `━━━ SLIDE 10: AI & FUTURE ROADMAP ━━━━━━━━━━━━━━━`,
      `Top Trends for Nike:`,
      ...topTrends.map((t, i) => `  ${i + 1}. ${t}`),
      trendsRationale ? `Trends Rationale: ${trendsRationale}` : '',
      ``,
      `Recommended AI Tools:`,
      ...allAiTools.map(t => `  • ${t}`),
      aiRationale ? `AI Strategy: ${aiRationale}` : '',
      ``,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `Kingston Business School · BM7621 · Social Media Workshop`,
    ].filter(l => l !== undefined)

    const blob = new Blob([lines.join('\n')], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${agencyName.replace(/\s+/g, '-')}-Nike-Pitch.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div ref={pitchRef}>
      {/* Header */}
      <div className="bg-gradient-to-br from-violet-900 to-slate-900 rounded-2xl p-6 mb-6 text-white">
        <div className="text-[10px] font-bold tracking-widest uppercase text-violet-300 mb-1">Agency Pitch</div>
        <h2 className="text-2xl font-bold mb-1">{agencyName}</h2>
        <p className="text-violet-200 text-sm mb-4">Nike Social Media Account · CIM Level 4</p>
        <div className="flex gap-4 text-sm">
          <div><span className="font-bold text-2xl text-white">{readyCount}</span><span className="text-violet-300 text-xs ml-1">/ 10 slides ready</span></div>
          <div><span className="font-bold text-2xl text-white">{total}</span><span className="text-violet-300 text-xs ml-1">pts scored</span></div>
          <div><span className="font-bold text-2xl text-white">{completed}</span><span className="text-violet-300 text-xs ml-1">/ {TOTAL_ACTIVITIES} done</span></div>
        </div>
        <button onClick={exportText}
          className="mt-4 bg-white text-violet-900 font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-violet-50 transition-colors shadow">
          ↓ Download Pitch (.txt)
        </button>
      </div>

      <div className="space-y-4">

        {/* Slide 1: Audience Analysis */}
        <SlideCard number={1} title="Audience Analysis" ready={motivations.length > 0}>
          {motivations.length > 0 && (
            <>
              <div className="bg-slate-50 rounded-xl p-3 mb-3 text-xs text-slate-600">
                <strong>Target:</strong> Nike's 18–24 female audience — fitness-conscious, aspirational, active on TikTok and Instagram. Sceptical of corporate advertising; responds strongly to authentic stories and peer recommendations.
              </div>
              <Row label="Motivations" value="" />
              <Tags items={motivations} />
              {painPoints.length > 0 && <><Row label="Pain Points" value="" /><Tags items={painPoints} /></>}
              {audPlatforms.length > 0 && <><div className="mt-2"><Row label="Primary Platforms" value="" /></div><Tags items={audPlatforms} /></>}
            </>
          )}
        </SlideCard>

        {/* Slide 2: Objectives */}
        <SlideCard number={2} title="Campaign Objectives" ready={objectives.length > 0}>
          {objectives.length > 0 && (
            <div className="space-y-2">
              {objectives.map(id => {
                const obj = OBJECTIVE_OPTIONS.find(o => o.id === id)
                if (!obj) return null
                return (
                  <div key={id} className="bg-slate-50 rounded-xl p-3">
                    <div className="flex items-start gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 mt-0.5 ${
                        obj.type === 'Awareness' ? 'bg-blue-100 text-blue-700' :
                        obj.type === 'Engagement' ? 'bg-violet-100 text-violet-700' :
                        obj.type === 'Conversion' ? 'bg-emerald-100 text-emerald-700' :
                        obj.type === 'Retention' ? 'bg-amber-100 text-amber-700' : 'bg-pink-100 text-pink-700'
                      }`}>{obj.type}</span>
                      <div>
                        <div className="text-sm font-semibold text-slate-800">{obj.label}</div>
                        <div className="text-xs text-slate-500 font-mono mt-0.5">{obj.metric}</div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </SlideCard>

        {/* Slide 3: Community Strategy */}
        <SlideCard number={3} title="Community Strategy" ready={tactics.length > 0}>
          {tactics.length > 0 && (
            <>
              <div className="text-xs text-slate-500 mb-2">Selected tactics for Nike's community growth:</div>
              <Tags items={tactics} />
            </>
          )}
        </SlideCard>

        {/* Slide 4: Channel Strategy */}
        <SlideCard number={4} title="Channel Strategy" ready={primaryPlatforms.length > 0}>
          {primaryPlatforms.length > 0 && (
            <>
              <div className="bg-violet-50 border border-violet-200 rounded-xl p-3 mb-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-violet-500 mb-1">Primary</div>
                <Tags items={primaryPlatforms} />
              </div>
              {secondaryPlatforms.length > 0 && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Secondary</div>
                  <Tags items={secondaryPlatforms} />
                </div>
              )}
            </>
          )}
        </SlideCard>

        {/* Slide 5: Campaign Platform */}
        <SlideCard number={5} title="Campaign Platform" ready={!!campaignName}>
          {campaignName && (
            <div className="space-y-2">
              <div className="bg-slate-900 text-white rounded-xl p-3 text-center mb-3">
                <div className="text-[10px] font-bold tracking-widest uppercase text-slate-400 mb-1">Campaign Name</div>
                <div className="text-lg font-bold">{campaignName}</div>
              </div>
              <Row label="Core Message" value={campaignMessage} />
              <Row label="Audience Promise" value={campaignPromise} />
              <Row label="Hero Concept" value={campaignHero} />
            </div>
          )}
        </SlideCard>

        {/* Slide 6: Creative Strategy */}
        <SlideCard number={6} title="Creative Strategy" ready={!!(reelDesc || carouselDesc || storyDesc || influencerBrief)}>
          {(reelDesc || carouselDesc || storyDesc || influencerBrief) && (
            <div className="space-y-3">
              {reelDesc && (
                <div className="border border-slate-200 rounded-xl p-3">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-brand-600 mb-1">📱 Reel / TikTok</div>
                  {reelHook && <div className="text-[10px] text-slate-400 mb-1">Hook type: {REEL_HOOK_TYPES.find(h => h.id === reelHook)?.label}</div>}
                  <div className="text-sm text-slate-700">{reelDesc}</div>
                </div>
              )}
              {carouselDesc && (
                <div className="border border-slate-200 rounded-xl p-3">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-teal-600 mb-1">📑 Carousel</div>
                  {carouselCover && <div className="text-[10px] text-slate-400 mb-1">{CAROUSEL_COVER_APPROACHES.find(c => c.id === carouselCover)?.label} · {CAROUSEL_CONTENT_TYPES.find(c => c.id === carouselType)?.label}</div>}
                  <div className="text-sm text-slate-700">{carouselDesc}</div>
                </div>
              )}
              {storyDesc && (
                <div className="border border-slate-200 rounded-xl p-3">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-amber-600 mb-1">💫 Story</div>
                  {storyMechanic && <div className="text-[10px] text-slate-400 mb-1">Mechanic: {STORY_MECHANICS.find(s => s.id === storyMechanic)?.label}</div>}
                  <div className="text-sm text-slate-700">{storyDesc}</div>
                </div>
              )}
              {influencerBrief && (
                <div className="border border-slate-200 rounded-xl p-3">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-violet-600 mb-1">🤝 Influencer Activation</div>
                  <div className="text-sm text-slate-700">{influencerBrief}</div>
                </div>
              )}
            </div>
          )}
        </SlideCard>

        {/* Slide 7: Influencer Strategy */}
        <SlideCard number={7} title="Influencer Strategy" ready={!!infTier}>
          {infTier && (
            <div className="space-y-2">
              {(() => {
                const tier = INFLUENCER_TIERS.find(t => t.id === infTier)
                const style = INFLUENCER_CONTENT_STYLES?.find((s: {id:string;label:string;desc:string}) => s.id === infStyle)
                return (
                  <>
                    <div className="bg-slate-50 rounded-xl p-3">
                      <div className="font-bold text-sm text-slate-900">{tier?.label}</div>
                      <div className="text-xs text-slate-500">{tier?.desc}</div>
                      {style && <div className="text-xs text-brand-600 mt-1">Style: {style.label} — {style.desc}</div>}
                    </div>
                    <Row label="Rationale" value={infRationale} />
                  </>
                )
              })()}
            </div>
          )}
        </SlideCard>

        {/* Slide 8: Paid Social & Commerce */}
        <SlideCard number={8} title="Paid Social & Commerce" ready={Object.keys(budget).length > 0}>
          {Object.keys(budget).length > 0 && (
            <div className="space-y-3">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Budget Allocation</div>
                <div className="space-y-1.5">
                  {BUDGET_CATEGORIES.map(cat => {
                    const pct = budget[cat.id] || 0
                    return (
                      <div key={cat.id} className="flex items-center gap-2">
                        <div className="text-xs text-slate-600 w-36 flex-shrink-0">{cat.label}</div>
                        <div className="flex-1 bg-slate-100 rounded-full h-2">
                          <div className="bg-violet-500 h-2 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <div className="text-xs font-bold text-slate-700 w-8 text-right">{pct}%</div>
                      </div>
                    )
                  })}
                </div>
              </div>
              {budgetRationale && <Row label="Rationale" value={budgetRationale} />}
              {commercePlatforms.length > 0 && (
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Social Commerce</div>
                  <Tags items={commercePlatforms.map(id => SOCIAL_COMMERCE_PLATFORMS.find(p => p.id === id)?.name || id)} />
                  {commerceRationale && <div className="text-xs text-slate-600 mt-2">{commerceRationale}</div>}
                </div>
              )}
            </div>
          )}
        </SlideCard>

        {/* Slide 9: Measurement Framework */}
        <SlideCard number={9} title="Measurement Framework" ready={Object.keys(kpis).length > 0}>
          {Object.keys(kpis).length > 0 && (
            <div className="space-y-2">
              {['Awareness', 'Engagement', 'Conversion', 'Advocacy'].map(stage => {
                const stageKpis = kpis[stage] || []
                if (!stageKpis.length) return null
                return (
                  <div key={stage} className="bg-slate-50 rounded-xl p-3">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">{stage}</div>
                    <Tags items={stageKpis} />
                  </div>
                )
              })}
            </div>
          )}
        </SlideCard>

        {/* Slide 10: AI & Future Roadmap */}
        <SlideCard number={10} title="AI & Future Roadmap" ready={trendsRanked.length > 0}>
          {trendsRanked.length > 0 && (
            <div className="space-y-3">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Top Trends for Nike</div>
                <div className="space-y-1.5">
                  {trendsRanked.slice(0, 3).map((id, i) => {
                    const trend = FUTURE_TRENDS.find(t => t.id === id)
                    return trend ? (
                      <div key={id} className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center text-[10px] font-bold flex-shrink-0">{i + 1}</div>
                        <div className="text-sm text-slate-800">{trend.label}</div>
                      </div>
                    ) : null
                  })}
                </div>
                {trendsRationale && <div className="text-xs text-slate-600 mt-2 bg-slate-50 rounded-lg p-2">{trendsRationale}</div>}
              </div>
              {Object.keys(aiSelected).length > 0 && (
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Recommended AI Tools</div>
                  <Tags items={Object.values(aiSelected).flat()} />
                  {aiRationale && <div className="text-xs text-slate-600 mt-2">{aiRationale}</div>}
                </div>
              )}
            </div>
          )}
        </SlideCard>

      </div>
    </div>
  )
}
