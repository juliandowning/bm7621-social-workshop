import type { ActivityKey } from '../types'

export const WORKSHOP_CODES: Record<string, { name: string }> = {
  SOCIAL01: { name: 'Agency 1' },
  SOCIAL02: { name: 'Agency 2' },
  SOCIAL03: { name: 'Agency 3' },
  SOCIAL04: { name: 'Agency 4' },
  SOCIAL05: { name: 'Agency 5' },
}

export const BLOCK_STRUCTURE = [
  { id: 1, label: 'Social Media Foundations', deliverable: 'Situation Analysis', activities: ['b1a1','b1a2','b1a3'] as ActivityKey[], color: 'blue' },
  { id: 2, label: 'Consumer Behaviour & Ethics', deliverable: 'Audience & Objectives', activities: ['b2a1','b2a2','b2a3','b2a4','b2a5'] as ActivityKey[], color: 'violet' },
  { id: 3, label: 'Platforms & Algorithms', deliverable: 'Channel Strategy', activities: ['b3a1','b3a2'] as ActivityKey[], color: 'teal' },
  { id: 4, label: 'Content & Influencer Strategy', deliverable: 'Campaign Platform & Creative', activities: ['b4a1','b4a2','b4a3','b4a4'] as ActivityKey[], color: 'amber' },
  { id: 5, label: 'Paid Social & Commerce', deliverable: 'Paid Social Strategy', activities: ['b5a1','b5a2','b5a3'] as ActivityKey[], color: 'red' },
  { id: 6, label: 'Analytics & Measurement', deliverable: 'Measurement Framework', activities: ['b6a1','b6a2','b6a3'] as ActivityKey[], color: 'emerald' },
  { id: 7, label: 'AI & Future Social', deliverable: 'AI & Future Roadmap', activities: ['b7a1','b7a2','b7a3'] as ActivityKey[], color: 'purple' },
]

export const ACTIVITY_LABELS: Record<ActivityKey, string> = {
  b1a1: 'Pros & Cons Challenge',
  b1a2: 'Customer Journey Mapping',
  b1a3: 'Platform Classification',
  b2a1: 'Attention Audit',
  b2a2: 'Behaviour Mapping',
  b2a3: 'Ethical Dilemma Workshop',
  b2a4: 'Community Growth Strategy',
  b2a5: 'Campaign Objectives',
  b3a1: 'Platform Selection',
  b3a2: 'Algorithm Detective',
  b4a1: 'Content Format Selection',
  b4a2: 'Campaign Platform Workshop',
  b4a3: 'Creative Concept Studio',
  b4a4: 'Influencer Selection',
  b5a1: 'Audience Targeting',
  b5a2: 'Budget Allocation',
  b5a3: 'Social Commerce Strategy',
  b6a1: 'Campaign Diagnosis',
  b6a2: 'Funnel Analysis',
  b6a3: 'Measurement Dashboard',
  b7a1: 'Human vs AI Challenge',
  b7a2: 'Future Trends Debate',
  b7a3: 'AI Tools Audit',
  final: 'Agency Pitch',
}

export const PITCH_ACTIVITIES: ActivityKey[] = ['b2a2','b2a5','b3a1','b4a2','b4a3','b4a4','b5a1','b5a2','b5a3','b6a3','b7a2','b7a3']

export const ACTIVITY_ORDER: ActivityKey[] = [
  'b1a1','b1a2','b1a3',
  'b2a1','b2a2','b2a3','b2a4','b2a5',
  'b3a1','b3a2',
  'b4a1','b4a2','b4a3','b4a4',
  'b5a1','b5a2','b5a3',
  'b6a1','b6a2','b6a3',
  'b7a1','b7a2','b7a3',
  'final',
]

export const TOTAL_ACTIVITIES = ACTIVITY_ORDER.length - 1 // 23

export const NIKE_BRIEF = {
  client: 'Nike',
  industry: 'Sports & Apparel',
  tagline: 'Just Do It',
  situation: 'Nike is the world\'s leading sports brand but faces growing challenges on social media. Organic reach has declined 40% in 18 months. Competitors Adidas and New Balance are gaining ground with Gen Z audiences. Nike\'s community of existing fans is highly engaged but the brand is struggling to attract new younger audiences. The 18–24 female segment is a priority growth area — currently underrepresented in Nike\'s social following despite being the fastest-growing segment in sports participation.',
  challenge: 'Develop a social media strategy that reignites Nike\'s relevance with 18–24 female audiences while maintaining the brand\'s authority with its existing community.',
  currentPlatforms: ['Instagram', 'TikTok', 'YouTube', 'Twitter/X', 'Facebook'],
  tone: 'Inspirational, bold, motivating, authentic',
  audience: {
    primary: '18–24 female, fitness-conscious, aspirational, active on TikTok and Instagram',
    secondary: '25–35 male and female, existing Nike community, achievement-driven',
    insight: 'Nike\'s target audience uses social media to express identity, find motivation and connect with communities that share their values. They are sceptical of corporate advertising but respond strongly to authentic stories and peer recommendations.',
  },
}

// ─── B1A1 ────────────────────────────────────────────────────
export const PROS_CONS_STATEMENTS = [
  { id: 'direct_engagement', text: 'Direct engagement with customers at scale', correct: 'benefit' as const },
  { id: 'reputation_risk', text: 'Reputation risk — a single negative post can go viral', correct: 'limitation' as const },
  { id: 'community_building', text: 'Community building around shared values', correct: 'benefit' as const },
  { id: 'misinformation', text: 'Misinformation can spread rapidly and damage brands', correct: 'limitation' as const },
  { id: 'realtime_feedback', text: 'Real-time customer feedback and insight', correct: 'benefit' as const },
  { id: 'content_saturation', text: 'Content saturation makes cut-through increasingly difficult', correct: 'limitation' as const },
  { id: 'low_cost_reach', text: 'Low-cost organic reach potential for authentic content', correct: 'benefit' as const },
  { id: 'algorithm_dependency', text: 'Algorithm changes can eliminate reach overnight', correct: 'limitation' as const },
  { id: 'ugc_power', text: 'User-generated content provides authentic social proof', correct: 'benefit' as const },
  { id: 'declining_organic', text: 'Organic reach has declined significantly — often below 2% on Facebook', correct: 'limitation' as const },
]

// ─── B1A2 ────────────────────────────────────────────────────
export const JOURNEY_STAGES = ['Awareness', 'Consideration', 'Purchase', 'Loyalty', 'Advocacy'] as const
export type JourneyStage = typeof JOURNEY_STAGES[number]
export const JOURNEY_ACTIVITIES = [
  { id: 'viral_video', text: 'Viral campaign video featuring real athletes', stage: 'Awareness' as JourneyStage },
  { id: 'product_comparison', text: 'Carousel post comparing running shoe features', stage: 'Consideration' as JourneyStage },
  { id: 'shoppable_post', text: 'Shoppable Instagram post with direct checkout', stage: 'Purchase' as JourneyStage },
  { id: 'exclusive_community', text: 'Nike Run Club community content and challenges', stage: 'Loyalty' as JourneyStage },
  { id: 'ugc_campaign', text: '#JustDoIt user-generated content challenge', stage: 'Advocacy' as JourneyStage },
  { id: 'influencer_review', text: 'Micro-influencer honest review of new trainer', stage: 'Consideration' as JourneyStage },
  { id: 'flash_sale', text: 'Flash sale countdown story with swipe-up link', stage: 'Purchase' as JourneyStage },
  { id: 'hashtag_challenge', text: 'TikTok hashtag challenge for new campaign', stage: 'Awareness' as JourneyStage },
  { id: 'loyalty_reward', text: 'Exclusive NikePlus member early access post', stage: 'Loyalty' as JourneyStage },
  { id: 'referral_programme', text: 'Social referral programme — share to earn rewards', stage: 'Advocacy' as JourneyStage },
]

// ─── B1A3 ────────────────────────────────────────────────────
export const PLATFORM_CATEGORIES_LIST = ['Social Networking','Video Sharing','Professional Networking','Social Commerce','Community Platforms'] as const
export const PLATFORMS_TO_CATEGORISE = [
  { id: 'facebook', name: 'Facebook', correct: 'Social Networking' },
  { id: 'youtube', name: 'YouTube', correct: 'Video Sharing' },
  { id: 'linkedin', name: 'LinkedIn', correct: 'Professional Networking' },
  { id: 'tiktok', name: 'TikTok', correct: 'Video Sharing' },
  { id: 'instagram_shopping', name: 'Instagram Shopping', correct: 'Social Commerce' },
  { id: 'tiktok_shop', name: 'TikTok Shop', correct: 'Social Commerce' },
  { id: 'whatsapp', name: 'WhatsApp Communities', correct: 'Community Platforms' },
  { id: 'instagram', name: 'Instagram', correct: 'Social Networking' },
]

// ─── B2A1 ────────────────────────────────────────────────────
export const ATTENTION_POSTS = [
  { id: 'n1', format: 'TikTok Reel', description: 'Black screen. White text fades in: "She told her she wasn\'t built for it." Cut to: woman finishing a marathon. Nike swoosh. No voiceover. 18 seconds.', verdict: 'stop' as const, stopFactors: ['Emotion', 'Surprise'] },
  { id: 'n2', format: 'Instagram Static', description: 'Flat lay product shot of three Nike trainers on a white background. Caption: "New colourways available now. Shop via link in bio." Three hashtags.', verdict: 'scroll' as const, stopFactors: ['Visual impact'] },
  { id: 'n3', format: 'Instagram Reel', description: 'Slow-motion shot of a woman mid-sprint, rain, crowd blurred behind her. Just Do It logo appears in last frame. No text overlay. Music: low, building.', verdict: 'stop' as const, stopFactors: ['Visual impact', 'Emotion'] },
  { id: 'n4', format: 'TikTok', description: '"POV: you said you\'d just do a quick 5k" — text over footage of someone 10km in, completely out of breath, still going. Relatable caption.', verdict: 'stop' as const, stopFactors: ['Relevance', 'Surprise'] },
  { id: 'n5', format: 'Instagram Carousel', description: '"5 reasons your running form is slowing you down" — slide 1 is a strong hook with a bold graphic, slides 2–5 break down each reason with illustrations.', verdict: 'stop' as const, stopFactors: ['Value', 'Relevance'] },
]
export const STOP_FACTORS = ['Visual impact', 'Relevance', 'Emotion', 'Surprise', 'Value'] as const
export const ATTENTION_FACTORS_MAX = 2

// ─── B2A2 ────────────────────────────────────────────────────
export const AUDIENCE_MOTIVATIONS = [
  { id: 'achievement', label: 'Achievement & self-improvement', correct: true },
  { id: 'identity', label: 'Athletic identity & belonging', correct: true },
  { id: 'inspiration', label: 'Inspiration and motivation', correct: true },
  { id: 'community', label: 'Community and shared goals', correct: true },
  { id: 'bargain', label: 'Finding the cheapest deals online', correct: false },
  { id: 'news', label: 'Keeping up with celebrity gossip', correct: false },
  { id: 'professional', label: 'Professional networking and career development', correct: false },
]
export const AUDIENCE_PAIN_POINTS = [
  { id: 'motivation', label: 'Lack of motivation to stay consistent', correct: true },
  { id: 'expensive', label: 'Perception that Nike is too expensive', correct: true },
  { id: 'authenticity', label: 'Scepticism of corporate brand messaging', correct: true },
  { id: 'injury', label: 'Fear of injury putting them off training', correct: true },
  { id: 'commute', label: 'Long commute times making exercise difficult', correct: false },
  { id: 'b2b_pain', label: 'Finding enterprise software for their business', correct: false },
]
export const AUDIENCE_PLATFORMS = [
  { id: 'instagram', label: 'Instagram', correct: true },
  { id: 'tiktok', label: 'TikTok', correct: true },
  { id: 'youtube', label: 'YouTube', correct: true },
  { id: 'linkedin', label: 'LinkedIn', correct: false },
  { id: 'twitter', label: 'Twitter/X', correct: false },
  { id: 'facebook', label: 'Facebook', correct: false },
]
export const MOTIVATIONS_MAX = 3
export const PAIN_POINTS_MAX = 2
export const PLATFORMS_MAX = 2

// ─── B2A3 ────────────────────────────────────────────────────
export const ETHICAL_SCENARIOS = [
  {
    id: 'influencer_disclosure',
    title: 'Influencer Disclosure',
    scenario: 'A Nike-sponsored athlete posts a glowing review of the new Nike Air Max without adding #ad or #sponsored. The post gets 800,000 likes and drives significant traffic to Nike.com.',
    options: [
      { id: 'a', text: 'Leave it — it\'s performing well and adding a disclosure tag would reduce engagement', risk: 'high', correct: false },
      { id: 'b', text: 'Ask the athlete to add a clear #ad label — required by ASA guidelines regardless of performance', risk: 'low', correct: true },
      { id: 'c', text: 'Delete and repost with disclosure once it stops trending', risk: 'medium', correct: false },
    ],
    learning: 'ASA requires clear upfront disclosure of all paid partnerships. Performance doesn\'t override legal requirements.',
  },
  {
    id: 'body_image',
    title: 'Body Image & Targeting',
    scenario: 'Nike\'s paid social team wants to target women aged 18–24 who have shown interest in "weight loss" and "body transformation" content with ads for a new training programme.',
    options: [
      { id: 'a', text: 'Proceed — this is standard interest-based targeting that\'s perfectly legal', risk: 'medium', correct: false },
      { id: 'b', text: 'Reframe around "fitness goals" and "active lifestyle" — aligns with Nike\'s values and avoids potential harm', risk: 'low', correct: true },
      { id: 'c', text: 'Don\'t run any targeted ads at this demographic at all', risk: 'medium', correct: false },
    ],
    learning: 'Ethical targeting aligns with brand positioning. Nike is about empowerment, not body anxiety.',
  },
  {
    id: 'accessibility',
    title: 'Content Accessibility',
    scenario: 'Nike launches a major TikTok campaign using fast-cut video with text overlays and music. No captions or subtitles are included anywhere.',
    options: [
      { id: 'a', text: 'Launch as planned — TikTok audiences watch with sound on so captions aren\'t needed', risk: 'high', correct: false },
      { id: 'b', text: 'Add auto-generated captions to all videos before launch — takes minutes and makes content accessible to all', risk: 'low', correct: true },
      { id: 'c', text: 'Add captions only to highest-performing posts after launch', risk: 'medium', correct: false },
    ],
    learning: '85% of social video is watched without sound. Accessible content reaches more people and signals brand values.',
  },
]

// ─── B2A4 ────────────────────────────────────────────────────
export const COMMUNITY_TACTICS = [
  { id: 'ugc', label: 'User-Generated Content Campaigns', desc: 'Encourage fans to create and share content around a hashtag or challenge', impact: 'high' as const },
  { id: 'challenges', label: 'Hashtag Challenges', desc: 'Create viral participation moments (#JustDoIt style)', impact: 'high' as const },
  { id: 'run_club', label: 'Nike Run Club Community Content', desc: 'Content that rewards and showcases the existing community', impact: 'high' as const },
  { id: 'ambassador', label: 'Ambassador Programme', desc: 'Recruit passionate customers as local Nike ambassadors', impact: 'high' as const },
  { id: 'polls', label: 'Polls & Interactive Stories', desc: 'Drive two-way engagement through questions and votes', impact: 'medium' as const },
  { id: 'live', label: 'Athlete Live Q&As', desc: 'Real-time access to Nike athletes — exclusive, authentic', impact: 'medium' as const },
  { id: 'co_creation', label: 'Community Co-Creation', desc: 'Involve the community in content or product decisions', impact: 'medium' as const },
  { id: 'exclusives', label: 'Exclusive Member Content', desc: 'Reward NikePlus members with early access and behind-the-scenes', impact: 'medium' as const },
]
export const COMMUNITY_TACTICS_MAX = 4

// ─── B2A5 ────────────────────────────────────────────────────
export const OBJECTIVE_OPTIONS = [
  { id: 'awareness_reach', label: 'Increase brand awareness among 18–24 female audience', type: 'Awareness', metric: 'Reach 5M unique users in target segment within 3 months', cascades: { platforms: ['TikTok', 'Instagram'], budget: { content: 30, paid: 35, influencers: 25, community: 5, analytics: 5 } } },
  { id: 'engagement_community', label: 'Build an engaged Nike women\'s community on social', type: 'Engagement', metric: 'Achieve 4%+ engagement rate and grow community by 20% in 6 months', cascades: { platforms: ['Instagram', 'TikTok'], budget: { content: 25, paid: 20, influencers: 20, community: 30, analytics: 5 } } },
  { id: 'conversion_sales', label: 'Drive direct sales from social to Nike.com', type: 'Conversion', metric: 'Achieve 3x ROAS from paid social campaigns within quarter', cascades: { platforms: ['Instagram', 'TikTok'], budget: { content: 20, paid: 45, influencers: 15, community: 10, analytics: 10 } } },
  { id: 'retention_loyalty', label: 'Increase NikePlus member engagement and retention', type: 'Retention', metric: 'Improve member social engagement rate by 30% over 6 months', cascades: { platforms: ['Instagram', 'YouTube'], budget: { content: 35, paid: 15, influencers: 10, community: 35, analytics: 5 } } },
  { id: 'advocacy_ugc', label: 'Generate user-generated content and brand advocacy', type: 'Advocacy', metric: '10,000 UGC posts with Nike hashtag in campaign period', cascades: { platforms: ['TikTok', 'Instagram'], budget: { content: 20, paid: 15, influencers: 30, community: 30, analytics: 5 } } },
]
export const OBJECTIVES_MAX = 3

// ─── B3A1 ────────────────────────────────────────────────────
export const PLATFORM_PRIORITY_OPTIONS = ['Primary', 'Secondary', 'Monitor', 'Not relevant'] as const
export const PLATFORMS_TO_PRIORITISE = [
  { id: 'instagram', name: 'Instagram', audienceFit: 'high', nikeStrength: 'high', objectiveFit: ['awareness_reach','engagement_community','conversion_sales','advocacy_ugc'] },
  { id: 'tiktok', name: 'TikTok', audienceFit: 'high', nikeStrength: 'medium', objectiveFit: ['awareness_reach','engagement_community','conversion_sales','advocacy_ugc'] },
  { id: 'youtube', name: 'YouTube', audienceFit: 'medium', nikeStrength: 'high', objectiveFit: ['awareness_reach','retention_loyalty'] },
  { id: 'twitter_x', name: 'Twitter/X', audienceFit: 'medium', nikeStrength: 'medium', objectiveFit: ['awareness_reach','engagement_community'] },
  { id: 'facebook', name: 'Facebook', audienceFit: 'low', nikeStrength: 'low', objectiveFit: ['conversion_sales'] },
  { id: 'linkedin', name: 'LinkedIn', audienceFit: 'low', nikeStrength: 'low', objectiveFit: [] },
]

// ─── B3A2 ────────────────────────────────────────────────────
export const ALGORITHM_SCENARIOS = [
  { id: 'tiktok_viral', platform: 'TikTok', description: 'A Nike creator account with 12,000 followers posts a 15-second video of a woman finishing her first 10k run, crying. No hashtags. Gets 4.2M views in 48 hours.', dominantFactor: 'Watch Time', explanation: 'TikTok\'s algorithm prioritises completion rate and replays above everything. A 15-second emotionally compelling video that people replay sends the strongest possible signal.' },
  { id: 'instagram_saves', platform: 'Instagram', description: '"5 running form mistakes that are slowing you down" carousel by Nike gets 3x more reach than any product post from the same week, despite half the likes.', dominantFactor: 'Saves', explanation: 'Instagram weighs saves as the highest-value engagement signal — bookmarking signals intent to return. Educational carousels consistently generate more saves than product posts.' },
  { id: 'youtube_avd', platform: 'YouTube', description: 'A 22-minute Nike documentary about an unknown marathon runner outperforms a polished 90-second product launch video by 10x in long-term views.', dominantFactor: 'Watch Time', explanation: 'YouTube tracks Average View Duration. A 22-minute video where viewers stay for 18+ minutes generates far more watch time than a 90-second video.' },
]
export const ALGORITHM_FACTORS = ['Watch Time', 'Engagement', 'Shares', 'Saves', 'Relevance', 'Recency'] as const

// ─── B4A1 ────────────────────────────────────────────────────
export const FORMAT_OBJECTIVES = [
  { objective: 'Drive brand awareness among new audiences', formats: ['Reels / Short Video', 'TikTok Originals'], reason: 'Interest-graph recommendation engines distribute content to non-followers — the only format with genuine organic discovery potential.', wrongFormats: ['Stories', 'Polls'] },
  { objective: 'Educate audience about product features', formats: ['Carousels', 'Long-form Video (YouTube)'], reason: 'Carousels allow sequential information delivery with high save rates. YouTube supports in-depth tutorials.', wrongFormats: ['Static Posts', 'Livestreams'] },
  { objective: 'Build daily community touchpoints', formats: ['Stories', 'Polls'], reason: 'Stories create daily intimacy with existing followers. Polls turn passive consumption into two-way conversation.', wrongFormats: ['Reels / Short Video', 'Carousels'] },
  { objective: 'Generate UGC and community participation', formats: ['Hashtag Challenges', 'Polls'], reason: 'Challenges invite participation at scale. Polls provide immediate low-friction interaction.', wrongFormats: ['Static Posts', 'Long-form Video (YouTube)'] },
  { objective: 'Drive direct product sales', formats: ['Shoppable Posts', 'Stories with Link'], reason: 'Social commerce formats collapse the discovery-to-purchase journey. Stories with link stickers drive high-intent traffic.', wrongFormats: ['Livestreams', 'Polls'] },
]
export const FORMAT_MAX_PER_OBJECTIVE = 2
export const ALL_FORMATS = ['Reels / Short Video', 'TikTok Originals', 'Carousels', 'Stories', 'Static Posts', 'Polls', 'Hashtag Challenges', 'Livestreams', 'Shoppable Posts', 'Long-form Video (YouTube)', 'Stories with Link'] as const

// ─── B4A2 ────────────────────────────────────────────────────
export const CAMPAIGN_KEYWORDS = ['community', 'authentic', 'movement', 'fearless', 'powerful', 'unstoppable', 'inspire', 'bold', 'real', 'transform', 'challenge', 'together', 'represent', 'break', 'prove', 'refuse', 'belong', 'rise', 'own', 'define', 'relentless', 'run', 'train', 'stronger', 'identity', 'purpose', 'sport', 'athlete', 'female', 'women', 'story', 'moment', 'journey', 'win', 'struggle', 'achieve']

// ─── B4A3 ────────────────────────────────────────────────────
export const REEL_HOOK_TYPES = [
  { id: 'curiosity_gap', label: 'Curiosity Gap', desc: 'Open with a question or unresolved tension that compels viewers to keep watching' },
  { id: 'bold_statement', label: 'Bold Statement', desc: 'Lead with a provocative claim or strong opinion that stops the scroll' },
  { id: 'social_proof', label: 'Social Proof', desc: 'Open with a real story, review or community moment that creates credibility' },
  { id: 'fomo', label: 'FOMO', desc: 'Create urgency or exclusivity — "everyone is doing this except you"' },
  { id: 'relatable_pov', label: 'Relatable POV', desc: 'POV-style format that puts the viewer in the situation immediately' },
  { id: 'transformation', label: 'Transformation', desc: 'Before/after or journey arc that creates emotional investment from second one' },
]
export const CAROUSEL_COVER_APPROACHES = [
  { id: 'bold_headline', label: 'Bold headline with a number', desc: '"5 things Nike women do differently" — clear promise of value' },
  { id: 'provocative_question', label: 'Provocative question', desc: '"Are you training wrong?" — creates curiosity and self-relevance' },
  { id: 'strong_visual', label: 'Strong visual, minimal text', desc: 'Let the image do the work — aspirational or emotionally resonant' },
  { id: 'contrarian_take', label: 'Contrarian statement', desc: 'Challenges assumption, demands attention' },
]
export const CAROUSEL_CONTENT_TYPES = [
  { id: 'educational', label: 'Educational / How-to', desc: 'Teach something specific — high save rate, builds authority' },
  { id: 'inspirational', label: 'Inspirational / Story', desc: 'Real athlete or community story — emotional, shareable' },
  { id: 'behind_scenes', label: 'Behind-the-scenes', desc: 'Product design, athlete training — builds authenticity' },
  { id: 'product_showcase', label: 'Product showcase', desc: 'Feature-led content — works best in consideration stage' },
  { id: 'community_spotlight', label: 'Community spotlight', desc: 'UGC, customer stories — social proof and community building' },
]
export const STORY_MECHANICS = [
  { id: 'poll', label: 'Poll', desc: 'Two-option question — instant engagement, beats algorithm' },
  { id: 'question_box', label: 'Question Box', desc: 'Open question — signals deep engagement' },
  { id: 'countdown', label: 'Countdown Timer', desc: 'Creates FOMO — works for launches, events, limited drops' },
  { id: 'ugc_repost', label: 'UGC Repost', desc: 'Sharing community content — authentic, rewards advocates' },
  { id: 'link_sticker', label: 'Link Sticker', desc: 'Direct traffic driver — product page, sign-up, editorial' },
  { id: 'behind_scenes', label: 'Behind-the-scenes', desc: 'Raw, unfiltered — builds intimacy and daily brand habit' },
]

// ─── B4A4 ────────────────────────────────────────────────────
export const INFLUENCER_TIERS = [
  { id: 'nano', label: 'Nano (1K–10K)', desc: 'Highest engagement, most authentic, niche communities, very low cost', best: 'Community building, local authenticity', engagementRate: '8–15%' },
  { id: 'micro', label: 'Micro (10K–100K)', desc: 'Strong engagement, targeted niches, trusted voice, affordable', best: 'Segment-specific awareness and conversion', engagementRate: '3–8%' },
  { id: 'macro', label: 'Macro (100K–1M)', desc: 'Broad reach, professional content, lower engagement %, premium cost', best: 'Mass awareness and credibility', engagementRate: '1–3%' },
  { id: 'celebrity', label: 'Celebrity / Mega (1M+)', desc: 'Maximum reach, premium cost, lowest engagement %, aspirational', best: 'Brand repositioning, global launches', engagementRate: '0.5–1%' },
  { id: 'ambassador', label: 'Brand Ambassador', desc: 'Long-term partnership, deepest alignment, ongoing narrative', best: 'Sustained brand building and authenticity', engagementRate: 'Varies' },
]
export const INFLUENCER_CONTENT_STYLES = [
  { id: 'authentic', label: 'Authentic / Unfiltered', desc: 'Raw, honest, no script — highest trust with audience' },
  { id: 'aspirational', label: 'Aspirational / Lifestyle', desc: 'Shows the life the audience wants — works for premium positioning' },
  { id: 'educational', label: 'Educational / Tutorial', desc: 'How-to content — positions Nike as expert, high save rate' },
  { id: 'entertaining', label: 'Entertaining / Humour', desc: 'Comedy, trends, relatable moments — highest share rate' },
  { id: 'challenge', label: 'Challenge / Participation', desc: 'Invites audience to join — generates UGC and community' },
]
export const INFLUENCER_KEYWORDS = ['engagement', 'authentic', 'niche', 'community', 'trust', 'audience', 'aligned', 'relevant', 'female', 'sport', 'fitness', 'running', 'nike', 'values', 'long-term', 'micro', 'genuine', 'reach', 'awareness', 'conversion', 'brief', 'creative', 'freedom', 'partnership', 'ambassador']

// ─── B5A1 ────────────────────────────────────────────────────
export const TARGETING_OPTIONS = {
  demographics: [
    { id: 'age_18_24', label: '18–24', recommended: true },
    { id: 'age_25_34', label: '25–34 (secondary reach)', recommended: true },
    { id: 'age_35_44', label: '35–44', recommended: false },
    { id: 'gender_female', label: 'Female', recommended: true },
    { id: 'gender_all', label: 'All Genders', recommended: false },
    { id: 'uk_us', label: 'UK + US markets', recommended: true },
  ],
  interests: [
    { id: 'fitness', label: 'Fitness & Sport', recommended: true },
    { id: 'running', label: 'Running', recommended: true },
    { id: 'fashion', label: 'Fashion & Style', recommended: true },
    { id: 'wellness', label: 'Health & Wellness', recommended: true },
    { id: 'luxury_fashion', label: 'Luxury Fashion & Designer Brands', recommended: false },
    { id: 'gaming', label: 'Gaming & Esports', recommended: false },
    { id: 'finance', label: 'Personal Finance & Investing', recommended: false },
  ],
  behaviours: [
    { id: 'active_shoppers', label: 'Active Sportswear Shoppers', recommended: true },
    { id: 'app_users', label: 'Fitness App Users', recommended: true },
    { id: 'engaged_shoppers', label: 'Frequent Online Shoppers', recommended: true },
    { id: 'event_attendees', label: 'Sports Event Attendees', recommended: true },
    { id: 'luxury_buyers', label: 'Luxury Goods Buyers', recommended: false },
    { id: 'b2b_decision', label: 'B2B Purchase Decision Makers', recommended: false },
  ],
  retargeting: [
    { id: 'website_visitors', label: 'Nike.com Visitors (30 days)', recommended: true },
    { id: 'video_viewers_75', label: 'Video Viewers 75%+ completion', recommended: true },
    { id: 'page_engagers', label: 'Nike Page Engagers (90 days)', recommended: true },
    { id: 'lookalikes', label: 'Lookalike — based on NikePlus members', recommended: true },
    { id: 'cart_abandoners', label: 'Cart Abandoners (14 days)', recommended: true },
  ],
}
export const RETARGETING_MAX = 3

// ─── B5A2 ────────────────────────────────────────────────────
export const BUDGET_CATEGORIES = [
  { id: 'content', label: 'Content Creation', desc: 'Production, design, copywriting, video' },
  { id: 'paid', label: 'Paid Social Ads', desc: 'Meta, TikTok, YouTube ad spend' },
  { id: 'influencers', label: 'Influencer Partnerships', desc: 'Creator fees, gifting, ambassador costs' },
  { id: 'community', label: 'Community Management', desc: 'Tools, moderation, engagement team' },
  { id: 'analytics', label: 'Analytics & Tools', desc: 'Scheduling, listening, attribution, reporting' },
]
export const BUDGET_KEYWORDS = ['roas', 'cpa', 'roi', 'conversion', 'retargeting', 'awareness', 'reach', 'content-first', 'amplify', 'organic', 'paid', 'community', 'retention', 'acquisition', 'funnel', 'tofu', 'bofu', '70/20/10', 'scale', 'test', 'measure', 'attribution', 'efficient', 'objective']

// ─── B5A3 ────────────────────────────────────────────────────
export const SOCIAL_COMMERCE_PLATFORMS = [
  { id: 'instagram_shopping', name: 'Instagram Shopping', desc: 'Product tags on posts and stories, in-app checkout, shop tab', strength: 'Best for aspirational product discovery with purchase intent', nikeFit: 'high' as const },
  { id: 'tiktok_shop', name: 'TikTok Shop', desc: 'In-video product tags, affiliate creator programme, live shopping', strength: 'Fastest growing — impulse purchases driven by content', nikeFit: 'high' as const },
  { id: 'live_commerce', name: 'Live Shopping Events', desc: 'Real-time product demos, Q&A, instant purchase during stream', strength: 'Highest conversion rate — urgency + entertainment + commerce', nikeFit: 'medium' as const },
  { id: 'creator_commerce', name: 'Creator Affiliate Commerce', desc: 'Creators earn commission — zero-risk performance-based model', strength: 'Scales UGC and advocacy while driving trackable revenue', nikeFit: 'high' as const },
  { id: 'facebook_shops', name: 'Facebook Shops', desc: 'Product catalogue, in-app checkout, Messenger integration', strength: 'Stronger for older demographics and retargeting', nikeFit: 'low' as const },
]
export const COMMERCE_KEYWORDS = ['frictionless', 'in-app', 'checkout', 'discovery', 'purchase', 'conversion', 'tiktok shop', 'instagram shopping', 'live commerce', 'creator', 'affiliate', 'impulse', 'seamless', 'journey', 'reduce friction', 'social proof', 'ugc', 'authentic', 'shoppable', 'product tag']

// ─── B6A1 ────────────────────────────────────────────────────
export const CAMPAIGN_DATA = [
  { metric: 'Impressions', value: '8.4M', status: 'good' as const, insight: 'Strong reach — campaign is being seen at scale' },
  { metric: 'Engagement Rate', value: '0.7%', status: 'bad' as const, insight: 'Below 1% benchmark — content not resonating' },
  { metric: 'Video Completion Rate', value: '68%', status: 'good' as const, insight: 'Above 50% benchmark — video content is compelling' },
  { metric: 'Click-Through Rate', value: '0.4%', status: 'bad' as const, insight: 'Low intent — ads not driving action' },
  { metric: 'Cost Per Click', value: '£2.10', status: 'ok' as const, insight: 'Acceptable but room to improve' },
  { metric: 'ROAS', value: '1.6x', status: 'bad' as const, insight: 'Well below 3x target — underperforming commercially' },
  { metric: 'Follower Growth', value: '+0.3%', status: 'bad' as const, insight: 'Campaign not converting viewers to community members' },
  { metric: 'Story Views', value: '420K', status: 'good' as const, insight: 'Strong Story engagement — owned audience active' },
]

// ─── B6A2 ────────────────────────────────────────────────────
export const FUNNEL_DATA = [
  { stage: 'Ad Impression', users: 8400000, dropoff: '' },
  { stage: 'Click to Nike.com', users: 75600, dropoff: '99.1% did not click' },
  { stage: 'Product Page View', users: 36288, dropoff: '52% bounced immediately' },
  { stage: 'Add to Cart', users: 6895, dropoff: '81% did not add to cart' },
  { stage: 'Purchase Completed', users: 2206, dropoff: '68% abandoned checkout' },
]
export const FUNNEL_OPTIMISATION_ACTIONS = [
  { id: 'improve_cta', label: 'Improve ad CTA to increase click-through rate' },
  { id: 'landing_page', label: 'Redesign landing page to reduce bounce rate' },
  { id: 'social_proof', label: 'Add reviews and UGC to product pages to build trust' },
  { id: 'retargeting', label: 'Launch retargeting campaign to recover cart abandoners' },
  { id: 'in_app', label: 'Enable Instagram/TikTok in-app checkout to reduce friction' },
  { id: 'better_targeting', label: 'Improve audience targeting to attract higher-intent users' },
  { id: 'creative_refresh', label: 'Refresh ad creative to improve relevance and engagement' },
  { id: 'simplify_checkout', label: 'Simplify the checkout process — fewer steps to purchase' },
]

// ─── B6A3 ────────────────────────────────────────────────────
export const KPI_OPTIONS = [
  { id: 'reach', label: 'Reach', stage: 'Awareness', desc: 'Unique accounts who saw content' },
  { id: 'impressions', label: 'Impressions', stage: 'Awareness', desc: 'Total content display count' },
  { id: 'share_of_voice', label: 'Share of Voice', stage: 'Awareness', desc: '% of sportswear category conversation' },
  { id: 'brand_mentions', label: 'Brand Mentions', stage: 'Awareness', desc: 'Organic Nike mentions across platforms' },
  { id: 'video_completion', label: 'Video Completion Rate', stage: 'Awareness', desc: '% of viewers watching to the end' },
  { id: 'engagement_rate', label: 'Engagement Rate', stage: 'Engagement', desc: 'Interactions as % of reach' },
  { id: 'saves', label: 'Save Rate', stage: 'Engagement', desc: 'Users bookmarking content — strongest intent signal' },
  { id: 'comments', label: 'Comment Rate', stage: 'Engagement', desc: 'Quality of community conversation' },
  { id: 'shares', label: 'Share Rate', stage: 'Engagement', desc: 'Content shared to networks' },
  { id: 'ctr', label: 'Click-Through Rate', stage: 'Conversion', desc: 'Clicks as % of impressions' },
  { id: 'conversion_rate', label: 'Conversion Rate', stage: 'Conversion', desc: 'Actions completed vs visitors' },
  { id: 'roas', label: 'ROAS', stage: 'Conversion', desc: 'Revenue per £1 of ad spend' },
  { id: 'cpa', label: 'Cost Per Acquisition', stage: 'Conversion', desc: 'Cost to acquire one customer' },
  { id: 'ugc_volume', label: 'UGC Volume', stage: 'Advocacy', desc: 'Community content tagged with Nike' },
  { id: 'community_growth', label: 'Community Growth Rate', stage: 'Advocacy', desc: 'Monthly follower growth %' },
  { id: 'nps', label: 'Net Promoter Score', stage: 'Advocacy', desc: 'Likelihood to recommend Nike' },
]

// ─── B7A1 ────────────────────────────────────────────────────
export const AI_CONTENT_EXAMPLES = [
  { id: 'ai_1', content: '"At Nike, we are committed to empowering athletes of all abilities through innovative sportswear design, sustainable manufacturing practices, and a dedication to excellence that drives performance at every level."', isAI: true, giveaway: 'Corporate phrasing, could apply to any brand, no specific voice — classic AI output from a generic prompt.' },
  { id: 'human_1', content: '"My knees are wrecked. My playlist died at mile 4. I tripped over a dog. Still ran the whole thing. Turns out \'just do it\' means something different to everyone."', isAI: false, giveaway: 'Specific failures, self-deprecating, emotionally honest — the kind of imperfection AI avoids.' },
  { id: 'ai_2', content: '"Research demonstrates that consistent athletic training with proper footwear increases performance outcomes by an average of 23% across diverse demographic cohorts."', isAI: true, giveaway: 'Invented statistic — a classic AI hallucination. Academic register, no personality, no Nike voice.' },
  { id: 'human_2', content: '"ok who else got into running during lockdown, quit for two years, started again last month and now somehow registered for a half marathon. asking for a friend"', isAI: false, giveaway: 'Lowercase, self-aware, culturally current. No AI would write this casually.' },
]

// ─── B7A2 ────────────────────────────────────────────────────
export const FUTURE_TRENDS = [
  { id: 'gen_ai', label: 'Generative AI Content at Scale', desc: 'AI creates content, adapts messaging, personalises at individual level' },
  { id: 'social_search', label: 'Social Search Replacing Google', desc: 'TikTok and Instagram become primary discovery engines for 18–24s' },
  { id: 'synthetic_influencers', label: 'Synthetic / Virtual Influencers', desc: 'AI-generated creators with millions of followers — brand safe, always on' },
  { id: 'predictive', label: 'Predictive Analytics', desc: 'AI predicts content performance and trend peaks before they happen' },
  { id: 'social_commerce_full', label: 'Full In-App Social Commerce', desc: 'Complete purchase journey within TikTok/Instagram — no external website' },
  { id: 'ar_experiences', label: 'AR Try-On & Social Experiences', desc: 'Try Nike products virtually before buying — integrated into social feeds' },
  { id: 'creator_economy', label: 'Creator Economy Maturation', desc: 'Creators become primary marketing channel — surpassing traditional advertising' },
]
export const TRENDS_KEYWORDS = ['nike', 'sport', 'female', 'audience', 'discovery', 'search', 'tiktok', 'instagram', 'ai', 'artificial intelligence', 'commerce', 'purchase', 'authentic', 'creator', 'influencer', 'community', 'personalisation', 'data', 'algorithm', 'trend', 'generation', 'gen z', 'impact', 'revenue', 'strategy', 'opportunity', 'threat', 'future', 'platform', 'social']

// ─── B7A3 ────────────────────────────────────────────────────
export const AI_TOOL_CATEGORIES = [
  { id: 'content_creation', category: 'Content Creation', tools: [
    { id: 'chatgpt', name: 'ChatGPT / Claude', purpose: 'Copy, captions, campaign concepts, briefs' },
    { id: 'midjourney', name: 'Midjourney / DALL-E', purpose: 'Image generation, visual concepts, mood boards' },
    { id: 'runway', name: 'Runway / Sora', purpose: 'AI video generation and editing' },
    { id: 'elevenlabs', name: 'ElevenLabs', purpose: 'Voice cloning, multilingual voiceovers' },
  ]},
  { id: 'analytics', category: 'Analytics & Listening', tools: [
    { id: 'brandwatch', name: 'Brandwatch', purpose: 'AI social listening, sentiment analysis, crisis detection' },
    { id: 'sprinklr', name: 'Sprinklr', purpose: 'Unified social management with AI analytics' },
    { id: 'ga4', name: 'GA4 + AI Insights', purpose: 'Predictive audience modelling, conversion forecasting' },
  ]},
  { id: 'advertising', category: 'Advertising & Optimisation', tools: [
    { id: 'meta_advantage', name: 'Meta Advantage+', purpose: 'Automated AI campaign optimisation and targeting' },
    { id: 'smartly', name: 'Smartly.io', purpose: 'AI creative generation and paid social automation' },
    { id: 'persado', name: 'Persado', purpose: 'AI copywriting optimised for conversion' },
  ]},
  { id: 'personalisation', category: 'Personalisation & CRM', tools: [
    { id: 'dynamic_yield', name: 'Dynamic Yield', purpose: 'AI personalisation across web, app and email' },
    { id: 'klaviyo', name: 'Klaviyo AI', purpose: 'Predictive email and SMS personalisation' },
  ]},
]
export const AI_TOOLS_KEYWORDS = ['efficiency', 'scale', 'automate', 'personalise', 'listen', 'sentiment', 'analytics', 'content', 'creative', 'optimise', 'target', 'audience', 'data', 'insight', 'human', 'oversight', 'brand', 'voice', 'authentic', 'risk', 'governance', 'strategy', 'workflow', 'time', 'cost', 'quality', 'nike', 'social', 'campaign']

// ─── SCORING ─────────────────────────────────────────────────
export function calcQualityScore(text: string, keywords: string[]): number {
  if (!text || text.trim().length < 15) return 0
  const lower = text.toLowerCase()
  const hits = keywords.filter(k => lower.includes(k.toLowerCase())).length
  const lengthBonus = text.trim().length >= 100 ? 1 : 0
  if (hits >= 4 + lengthBonus) return 5
  if (hits >= 3) return 4
  if (hits >= 2) return 3
  if (hits >= 1) return 2
  if (text.trim().length >= 40) return 1
  return 0
}
