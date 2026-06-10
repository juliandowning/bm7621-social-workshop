import { useState } from 'react'
import { useWorkspaceStore } from '../../store/workspace'
import { FORMAT_OBJECTIVES, REEL_HOOK_TYPES, CAROUSEL_COVER_APPROACHES, CAROUSEL_CONTENT_TYPES, STORY_MECHANICS, INFLUENCER_TIERS, INFLUENCER_CONTENT_STYLES, INFLUENCER_KEYWORDS, CAMPAIGN_KEYWORDS, calcQualityScore } from '../../data/workshop'
import { ActivityCard, FeedbackPanel, Alert, CharCount, confirmSubmit } from '../ui/shared'

export function Block4() {
  const { scores, responses, updateScore, updateResponse, lockActivity } = useWorkspaceStore()
  const isViewer = useWorkspaceStore(s => s.isViewer)

  // A12: Content Format Selection
  const a1Locked = !!(responses['b4a1_locked'])
  const [a1Picks, setA1Picks] = useState<Record<number, string[]>>((responses['b4a1_picks'] as Record<number, string[]>) || {})

  const submitA1 = () => {
    const correct = FORMAT_OBJECTIVES.filter((obj, i) => {
      const picks = a1Picks[i] || []
      return picks.some(p => obj.formats.includes(p))
    }).length
    const pts = Math.min(5, Math.round(correct / FORMAT_OBJECTIVES.length * 5))
    updateScore('b4a1', pts, 5)
    updateResponse({ b4a1_picks: a1Picks, b4a1_locked: true })
    lockActivity('b4a1')
  }

  // A13: Campaign Idea Workshop - PITCH
  const a2Locked = !!(responses['b4a2_locked'])
  const [a2Name, setA2Name] = useState<string>((responses['b4a2_name'] as string) || '')
  const [a2Message, setA2Message] = useState<string>((responses['b4a2_message'] as string) || '')
  const [a2Promise, setA2Promise] = useState<string>((responses['b4a2_promise'] as string) || '')
  const [a2Hero, setA2Hero] = useState<string>((responses['b4a2_hero'] as string) || '')

  const submitA2 = () => {
    const combined = [a2Name, a2Message, a2Promise, a2Hero].join(' ')
    const pts = calcQualityScore(combined, CAMPAIGN_KEYWORDS)
    updateScore('b4a2', pts, 5)
    updateResponse({ b4a2_name: a2Name, b4a2_message: a2Message, b4a2_promise: a2Promise, b4a2_hero: a2Hero, b4a2_locked: true })
    lockActivity('b4a2')
  }

  // A14: Creative Concept Studio - PITCH
  const a3Locked = !!(responses['b4a3_locked'])
  const [reelHook, setReelHook] = useState<string>((responses['b4a3_reel_hook'] as string) || '')
  const [reelDesc, setReelDesc] = useState<string>((responses['b4a3_reel_desc'] as string) || '')
  const [carouselCover, setCarouselCover] = useState<string>((responses['b4a3_carousel_cover'] as string) || '')
  const [carouselType, setCarouselType] = useState<string>((responses['b4a3_carousel_type'] as string) || '')
  const [carouselDesc, setCarouselDesc] = useState<string>((responses['b4a3_carousel_desc'] as string) || '')
  const [storyMechanic, setStoryMechanic] = useState<string>((responses['b4a3_story_mechanic'] as string) || '')
  const [storyDesc, setStoryDesc] = useState<string>((responses['b4a3_story_desc'] as string) || '')
  const [influencerDesc, setInfluencerDesc] = useState<string>((responses['b4a3_influencer_brief'] as string) || '')

  const submitA3 = () => {
    const filled = [reelHook && reelDesc, carouselCover && carouselType && carouselDesc, storyMechanic && storyDesc, influencerDesc].filter(Boolean).length
    const freeTexts = [reelDesc, carouselDesc, storyDesc, influencerDesc].join(' ')
    const qualScore = calcQualityScore(freeTexts, CAMPAIGN_KEYWORDS)
    const pts = Math.min(5, filled + Math.floor(qualScore / 2))
    updateScore('b4a3', pts, 5)
    updateResponse({ b4a3_reel_hook: reelHook, b4a3_reel_desc: reelDesc, b4a3_carousel_cover: carouselCover, b4a3_carousel_type: carouselType, b4a3_carousel_desc: carouselDesc, b4a3_story_mechanic: storyMechanic, b4a3_story_desc: storyDesc, b4a3_influencer_brief: influencerDesc, b4a3_locked: true })
    lockActivity('b4a3')
  }

  // A15: Influencer Selection - PITCH
  const a4Locked = !!(responses['b4a4_locked'])
  const [infTier, setInfTier] = useState<string>((responses['b4a4_tier'] as string) || '')
  const [infStyle, setInfStyle] = useState<string>((responses['b4a4_style'] as string) || '')
  const [infRationale, setInfRationale] = useState<string>((responses['b4a4_rationale'] as string) || '')

  const submitA4 = () => {
    const pts = Math.min(5, (infTier ? 1 : 0) + (infStyle ? 1 : 0) + calcQualityScore(infRationale, INFLUENCER_KEYWORDS))
    updateScore('b4a4', pts, 5)
    updateResponse({ b4a4_tier: infTier, b4a4_style: infStyle, b4a4_rationale: infRationale, b4a4_locked: true })
    lockActivity('b4a4')
  }

  const SelectGrid = ({ options, value, onChange, disabled }: { options: { id: string; label: string; desc: string }[]; value: string; onChange: (v: string) => void; disabled: boolean }) => (
    <div className="space-y-2">
      {options.map(opt => (
        <button key={opt.id} disabled={disabled}
          onClick={() => !disabled && onChange(opt.id)}
          className={`w-full text-left p-3 rounded-xl border-2 transition-all ${value === opt.id ? 'border-brand-500 bg-brand-50' : 'border-slate-200 hover:border-brand-300'} disabled:cursor-default`}>
          <div className={`font-semibold text-sm ${value === opt.id ? 'text-brand-700' : 'text-slate-800'}`}>{opt.label}</div>
          <div className="text-xs text-slate-500 mt-0.5">{opt.desc}</div>
        </button>
      ))}
    </div>
  )

  return (
    <div>
      {/* A12: Content Format Selection */}
      <ActivityCard number={12} title="Content Format Selection" subtitle="Match the right content format to each objective" points={scores.b4a1?.points || 0} locked={a1Locked}>
        <Alert type="info">📱 Different formats serve different objectives. For each Nike objective below, select the most effective format(s).</Alert>
        <div className="space-y-5 mb-4">
          {FORMAT_OBJECTIVES.map((obj, i) => {
            const picks = a1Picks[i] || []
            const allFormats = ['Reels / Short Video', 'TikTok Originals', 'Carousels', 'Stories', 'Static Posts', 'Polls', 'Hashtag Challenges', 'Livestreams', 'Shoppable Posts', 'Long-form Video (YouTube)', 'Stories with Link']
        const FORMAT_MAX = 2
            const showResult = a1Locked
            return (
              <div key={i} className="border border-slate-200 rounded-xl p-4">
                <div className="font-bold text-slate-800 text-sm mb-1">"{obj.objective}"</div>
                <div className="text-xs text-slate-400 mb-3">Pick up to 2 formats ({(picks.length)}/2)</div>
                <div className="flex flex-wrap gap-1.5">
                  {allFormats.map(fmt => {
                    const sel = picks.includes(fmt)
                    const isCorrect = obj.formats.includes(fmt)
                    return (
                      <button key={fmt} disabled={a1Locked || isViewer}
                        onClick={() => { if (a1Locked || isViewer) return; if (!sel && picks.length >= FORMAT_MAX) return; setA1Picks(prev => ({ ...prev, [i]: sel ? picks.filter(f => f !== fmt) : [...picks, fmt] })) }}
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${sel ? 'border-brand-500 bg-brand-500 text-white' : !sel && picks.length >= FORMAT_MAX ? 'border-slate-100 text-slate-300 opacity-50' : 'border-slate-200 bg-white text-slate-600 hover:border-brand-300'} ${showResult && isCorrect ? 'ring-2 ring-emerald-400' : ''} ${showResult && sel && !isCorrect ? 'border-red-300' : ''} disabled:cursor-default`}>
                        {fmt}
                      </button>
                    )
                  })}
                </div>
                {showResult && <div className="text-xs text-emerald-700 mt-2">✓ Best formats: {obj.formats.join(', ')} — {obj.reason}</div>}
              </div>
            )
          })}
        </div>
        {!a1Locked && !isViewer && <button className="btn-success" onClick={() => confirmSubmit(submitA1)} disabled={Object.keys(a1Picks).length < 3}>Submit Answers</button>}
        {a1Locked && scores.b4a1 && <FeedbackPanel score={scores.b4a1.points} max={5}
          why="Each format has a different algorithm relationship and different audience mindset. Matching format to objective is a strategic skill."
          keyLearning={['Reels/TikTok are discovery tools — interest graph distribution reaches non-followers.', 'Stories are relationship tools — they deepen connections with existing community.', 'Carousels have the highest save rate — saves are the strongest engagement signal on Instagram.']} />}
      </ActivityCard>

      {/* A13: Campaign Idea Workshop - PITCH */}
      <ActivityCard number={13} title="Campaign Idea Workshop" subtitle="Develop the big idea for Nike's campaign — the centrepiece of your pitch" points={scores.b4a2?.points || 0} locked={a2Locked} isPitch>
        <Alert type="info">💡 A campaign platform is the unifying idea that connects all content. It needs a name people remember, a message that means something, a promise the brand can keep, and a hero concept that brings it to life.</Alert>
        <div className="space-y-4 mb-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Campaign Name</label>
            <input disabled={a2Locked || isViewer} value={a2Name} onChange={e => setA2Name(e.target.value)}
              placeholder="e.g. Built Different, Her Game, Rise Together"
              className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-400 disabled:bg-slate-50" />
            <CharCount value={a2Name} min={3} max={50} />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Core Message</label>
            <input disabled={a2Locked || isViewer} value={a2Message} onChange={e => setA2Message(e.target.value)}
              placeholder="One sentence capturing what this campaign stands for"
              className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-400 disabled:bg-slate-50" />
            <CharCount value={a2Message} min={10} max={120} />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Audience Promise</label>
            <input disabled={a2Locked || isViewer} value={a2Promise} onChange={e => setA2Promise(e.target.value)}
              placeholder="What Nike commits to deliver through this campaign"
              className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-400 disabled:bg-slate-50" />
            <CharCount value={a2Promise} min={10} max={120} />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Hero Concept</label>
            <textarea disabled={a2Locked || isViewer} value={a2Hero} onChange={e => setA2Hero(e.target.value)}
              placeholder="The one piece of content that defines the campaign"
              rows={3} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-400 resize-none disabled:bg-slate-50" />
            <CharCount value={a2Hero} min={30} max={300} />
          </div>
        </div>
        {!a2Locked && !isViewer && <button className="btn-success" onClick={() => confirmSubmit(submitA2)} disabled={a2Name.trim().length < 3}>Submit Campaign</button>}
        {a2Locked && scores.b4a2 && <FeedbackPanel score={scores.b4a2.points} max={5}
          why="Scored against a keyword bank including: community, authentic, movement, fearless, powerful, inspire, bold, real, women, story, purpose, sport, athlete, identity and similar."
          example={"\"Built Different\" — Message: \"Champions aren't born, they're built in every rep, every run, every refusal to quit.\" Promise: \"Nike will celebrate every training session, not just the podiums.\" Hero: A 60-second TikTok showing 10 women training alone at night — no crowds, no cheers, just work."}
          keyLearning={['The strongest campaign names are action-oriented and emotionally resonant.', 'The audience promise creates accountability — it should be something Nike can genuinely deliver.', 'The hero concept is the creative anchor — all executions should feel like they belong to the same idea.']} />}
      </ActivityCard>

      {/* A14: Creative Concept Studio - PITCH */}
      <ActivityCard number={14} title="Creative Concept Studio" subtitle="Develop executional concepts for each format — feeds your Agency Pitch" points={scores.b4a3?.points || 0} locked={a3Locked} isPitch>
        <Alert type="info">🎨 Four formats. One campaign idea. Show how your Campaign Platform comes to life across each format for Nike.</Alert>
        <div className="space-y-6 mb-4">
          {/* Reel */}
          <div className="border border-slate-200 rounded-xl p-4">
            <div className="text-xs font-bold uppercase tracking-wider text-brand-600 mb-3">📱 Reel / TikTok Concept</div>
            <div className="mb-3">
              <div className="text-xs font-semibold text-slate-600 mb-2">Choose your hook type</div>
              <SelectGrid options={REEL_HOOK_TYPES} value={reelHook} onChange={setReelHook} disabled={a3Locked || isViewer} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Describe your Nike reel concept in one sentence</label>
              <textarea disabled={a3Locked || isViewer} value={reelDesc} onChange={e => setReelDesc(e.target.value)}
                placeholder="e.g. Open on a woman training alone at 5am, text fades in: she told you it was impossible. Prove her wrong. Nike swoosh. No voiceover."
                rows={2} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand-400 resize-none disabled:bg-slate-50" />
              <CharCount value={reelDesc} min={20} max={250} />
            </div>
          </div>
          {/* Carousel */}
          <div className="border border-slate-200 rounded-xl p-4">
            <div className="text-xs font-bold uppercase tracking-wider text-teal-600 mb-3">📑 Carousel Concept</div>
            <div className="mb-3">
              <div className="text-xs font-semibold text-slate-600 mb-2">Cover slide approach</div>
              <SelectGrid options={CAROUSEL_COVER_APPROACHES} value={carouselCover} onChange={setCarouselCover} disabled={a3Locked || isViewer} />
            </div>
            <div className="mb-3">
              <div className="text-xs font-semibold text-slate-600 mb-2">Content type</div>
              <SelectGrid options={CAROUSEL_CONTENT_TYPES} value={carouselType} onChange={setCarouselType} disabled={a3Locked || isViewer} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Your specific carousel idea</label>
              <textarea disabled={a3Locked || isViewer} value={carouselDesc} onChange={e => setCarouselDesc(e.target.value)}
                placeholder='e.g. "5 training habits of Nike women who actually hit their goals" — each slide = one habit with real athlete example'
                rows={2} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand-400 resize-none disabled:bg-slate-50" />
              <CharCount value={carouselDesc} min={20} max={250} />
            </div>
          </div>
          {/* Story */}
          <div className="border border-slate-200 rounded-xl p-4">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-3">💫 Story Concept</div>
            <div className="mb-3">
              <div className="text-xs font-semibold text-slate-600 mb-2">Primary mechanic</div>
              <SelectGrid options={STORY_MECHANICS} value={storyMechanic} onChange={setStoryMechanic} disabled={a3Locked || isViewer} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">How Nike uses this mechanic</label>
              <textarea disabled={a3Locked || isViewer} value={storyDesc} onChange={e => setStoryDesc(e.target.value)}
                placeholder='e.g. Weekly poll: "What are you training for this week?" — results shared Monday. Builds habit of daily Nike Story check-in'
                rows={2} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand-400 resize-none disabled:bg-slate-50" />
              <CharCount value={storyDesc} min={20} max={250} />
            </div>
          </div>
          {/* Influencer Brief */}
          <div className="border border-slate-200 rounded-xl p-4">
            <div className="text-xs font-bold uppercase tracking-wider text-violet-600 mb-3">🤝 Influencer Activation Brief</div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Write a one-sentence brief for your Nike influencer activation</label>
              <textarea disabled={a3Locked || isViewer} value={influencerDesc} onChange={e => setInfluencerDesc(e.target.value)}
                placeholder="e.g. 20 female micro-runners (10K–50K followers) document their first 30 days training in Nike — unscripted, no logo requirements, just authentic journey content with #NikeBuiltDifferent"
                rows={3} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand-400 resize-none disabled:bg-slate-50" />
              <CharCount value={influencerDesc} min={30} max={300} />
            </div>
          </div>
        </div>
        {!a3Locked && !isViewer && <button className="btn-success" onClick={() => confirmSubmit(submitA3)} disabled={[reelDesc, carouselDesc, storyDesc, influencerDesc].filter(f => f.trim().length >= 20).length < 2}>Submit Concepts</button>}
        {a3Locked && scores.b4a3 && <FeedbackPanel score={scores.b4a3.points} max={5}
          why="Scored on: completeness (all 4 formats attempted) + quality of concept descriptions (keyword bank: campaign, community, authentic, women, sport, story, inspire, etc)."
          keyLearning={['The best Reel hook is in the first 0.5 seconds — start mid-action, never with a logo.', 'Carousels that open with a question or promise outperform those that lead with product.', 'Influencer briefs should give creative direction, not creative control — authenticity is the asset.']} />}
      </ActivityCard>

      {/* A15: Influencer Selection - PITCH */}
      <ActivityCard number={15} title="Influencer Selection" subtitle="Choose the right influencer strategy for Nike — feeds your Agency Pitch" points={scores.b4a4?.points || 0} locked={a4Locked} isPitch>
        <Alert type="info">🤝 Select the tier and content style that best fits Nike's 18–24 female audience strategy. Then explain your rationale.</Alert>
        <div className="space-y-4 mb-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Influencer Tier</div>
            <div className="space-y-2">
              {INFLUENCER_TIERS.map(tier => (
                <button key={tier.id} disabled={a4Locked || isViewer} onClick={() => !a4Locked && !isViewer && setInfTier(tier.id)}
                  className={`w-full text-left p-3.5 border-2 rounded-xl transition-all ${infTier === tier.id ? 'border-brand-600 bg-brand-600 shadow-md' : 'border-slate-200 hover:border-brand-300 bg-white'} disabled:cursor-default`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className={`font-bold text-sm ${infTier === tier.id ? 'text-white' : 'text-slate-800'}`}>{tier.label}</div>
                      <div className={`text-xs mt-0.5 ${infTier === tier.id ? 'text-brand-100' : 'text-slate-500'}`}>{tier.desc}</div>
                    </div>
                    <span className={`text-[10px] font-mono flex-shrink-0 ml-2 ${infTier === tier.id ? 'text-brand-200' : 'text-slate-400'}`}>{tier.engagementRate} eng.</span>
                  </div>
                  <div className={`text-[10px] mt-1 ${infTier === tier.id ? 'text-brand-100 font-semibold' : 'text-brand-600'}`}>Best for: {tier.best}</div>
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Content Style</div>
            <SelectGrid options={INFLUENCER_CONTENT_STYLES} value={infStyle} onChange={setInfStyle} disabled={a4Locked || isViewer} />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Why this approach for Nike?</label>
            <textarea disabled={a4Locked || isViewer} value={infRationale} onChange={e => setInfRationale(e.target.value)}
              placeholder="Explain why this tier and style fits Nike's 18–24 female audience strategy, your campaign platform and your chosen objectives..."
              rows={3} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-400 resize-none disabled:bg-slate-50" />
            <CharCount value={infRationale} min={40} max={300} />
          </div>
        </div>
        {!a4Locked && !isViewer && <button className="btn-success" onClick={() => confirmSubmit(submitA4)} disabled={!infTier || infRationale.trim().length < 40}>Submit Strategy</button>}
        {a4Locked && scores.b4a4 && <FeedbackPanel score={scores.b4a4.points} max={5}
          why="Scored on tier selection + content style + rationale quality (keyword bank: authentic, community, niche, audience, nike, female, sport, long-term, micro, trust, etc)."
          example="For Nike's 18–24 female brief: Micro-influencers with authentic content style. Rationale: Nike's target is sceptical of corporate advertising — micro creators have 60% higher engagement than macro, and feel peer-level rather than aspirational. Authentic style builds the trust the campaign needs to land."
          keyLearning={['Micro-influencers (10K–100K) have 60% higher engagement than macro — smaller audience, stronger voice.', 'One ambassador is often more valuable than ten one-off posts — relationship depth compounds over time.', 'Brief should give creative direction not control — over-scripted influencer content is always obvious.']} />}
      </ActivityCard>
    </div>
  )
}
