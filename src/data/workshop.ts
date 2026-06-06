import type { Brand, ActivityKey } from '../types'

export const WORKSHOP_CODES: Record<string, { brand: Brand; name: string }> = {
  SOCIAL01: { brand: 'Nike', name: 'Nike Team' },
  SOCIAL02: { brand: 'Netflix', name: 'Netflix Team' },
  SOCIAL03: { brand: 'Airbnb', name: 'Airbnb Team' },
  SOCIAL04: { brand: 'Spotify', name: 'Spotify Team' },
  SOCIAL05: { brand: 'Innocent', name: 'Innocent Team' },
}

export const BRANDS: Brand[] = ['Nike', 'Netflix', 'Airbnb', 'Spotify', 'Innocent']

export const BLOCK_STRUCTURE = [
  { id: 1, label: 'Social Media Foundations', description: 'Situation Analysis', activities: ['b1a1','b1a2','b1a3'] as ActivityKey[], color: 'blue' },
  { id: 2, label: 'Consumer Behaviour & Ethics', description: 'Audience & Community Analysis', activities: ['b2a1','b2a2','b2a3','b2a4'] as ActivityKey[], color: 'violet' },
  { id: 3, label: 'Platforms & Algorithms', description: 'Channel Strategy', activities: ['b3a1','b3a2','b3a3'] as ActivityKey[], color: 'teal' },
  { id: 4, label: 'Content & Influencer Strategy', description: 'Campaign Platform & Content Strategy', activities: ['b4a1','b4a2','b4a3','b4a4'] as ActivityKey[], color: 'amber' },
  { id: 5, label: 'Paid Social & Commerce', description: 'Paid Social & Social Commerce Strategy', activities: ['b5a1','b5a2','b5a3'] as ActivityKey[], color: 'red' },
  { id: 6, label: 'Analytics & Measurement', description: 'Measurement Framework', activities: ['b6a1','b6a2','b6a3'] as ActivityKey[], color: 'emerald' },
  { id: 7, label: 'AI & Future Social', description: 'AI & Future Development Roadmap', activities: ['b7a1','b7a2','b7a3'] as ActivityKey[], color: 'purple' },
]

export const ACTIVITY_LABELS: Record<ActivityKey, string> = {
  b1a1: 'Pros & Cons Challenge',
  b1a2: 'Customer Journey Mapping',
  b1a3: 'Platform Classification',
  b2a1: 'Attention Audit',
  b2a2: 'Behaviour Mapping',
  b2a3: 'Ethical Dilemma Workshop',
  b2a4: 'Community Growth Strategy',
  b3a1: 'Platform Selection',
  b3a2: 'Algorithm Detective',
  b3a3: 'Social Lab — Simulator',
  b4a1: '3-Second Test',
  b4a2: 'Campaign Platform Workshop',
  b4a3: 'Content Mix Planning',
  b4a4: 'Influencer Selection',
  b5a1: 'Audience Targeting',
  b5a2: 'Budget Allocation',
  b5a3: 'Social Commerce Journey',
  b6a1: 'Campaign Diagnosis',
  b6a2: 'Funnel Analysis',
  b6a3: 'Measurement Dashboard',
  b7a1: 'Human vs AI Challenge',
  b7a2: 'Future Trends Debate',
  b7a3: 'Creative Concept Studio',
  final: 'Agency Pitch',
}

export const ACTIVITY_DISPLAY_NUM: Record<ActivityKey, number> = {
  b1a1:1, b1a2:2, b1a3:3,
  b2a1:4, b2a2:5, b2a3:6, b2a4:7,
  b3a1:8, b3a2:9, b3a3:10,
  b4a1:11, b4a2:12, b4a3:13, b4a4:14,
  b5a1:15, b5a2:16, b5a3:17,
  b6a1:18, b6a2:19, b6a3:20,
  b7a1:21, b7a2:22, b7a3:23,
  final:24,
}

export const ACTIVITY_ORDER: ActivityKey[] = [
  'b1a1','b1a2','b1a3',
  'b2a1','b2a2','b2a3','b2a4',
  'b3a1','b3a2','b3a3',
  'b4a1','b4a2','b4a3','b4a4',
  'b5a1','b5a2','b5a3',
  'b6a1','b6a2','b6a3',
  'b7a1','b7a2','b7a3',
  'final',
]

export const TOTAL_ACTIVITIES = ACTIVITY_ORDER.length

// ─── ACTIVITY CONTENT ────────────────────────────────────────

export const PROS_CONS_STATEMENTS = [
  { id: 'direct_engagement', text: 'Direct customer engagement', correct: 'benefit' },
  { id: 'reputation_risk', text: 'Reputation risk from public complaints', correct: 'limitation' },
  { id: 'community_building', text: 'Community building at scale', correct: 'benefit' },
  { id: 'misinformation', text: 'Misinformation can spread rapidly', correct: 'limitation' },
  { id: 'realtime_feedback', text: 'Real-time customer feedback', correct: 'benefit' },
  { id: 'content_saturation', text: 'Content saturation makes cut-through harder', correct: 'limitation' },
  { id: 'low_cost_reach', text: 'Low cost organic reach potential', correct: 'benefit' },
  { id: 'algorithm_dependency', text: 'Algorithm changes can wipe out reach overnight', correct: 'limitation' },
  { id: 'brand_humanisation', text: 'Humanises the brand through authentic content', correct: 'benefit' },
  { id: 'mental_health', text: 'Association with mental health concerns', correct: 'limitation' },
]

export const JOURNEY_STAGES = ['Awareness', 'Consideration', 'Purchase', 'Loyalty', 'Advocacy'] as const
export const JOURNEY_ACTIVITIES = [
  { id: 'viral_video', text: 'Viral video campaign', stage: 'Awareness' },
  { id: 'product_comparison', text: 'Product comparison posts', stage: 'Consideration' },
  { id: 'shoppable_post', text: 'Shoppable Instagram post', stage: 'Purchase' },
  { id: 'exclusive_community', text: 'Exclusive member community', stage: 'Loyalty' },
  { id: 'ugc_campaign', text: 'User-generated content campaign', stage: 'Advocacy' },
  { id: 'influencer_review', text: 'Influencer review content', stage: 'Consideration' },
  { id: 'flash_sale', text: 'Flash sale countdown story', stage: 'Purchase' },
  { id: 'hashtag_challenge', text: 'Brand hashtag challenge', stage: 'Awareness' },
  { id: 'loyalty_reward', text: 'Loyalty reward social post', stage: 'Loyalty' },
  { id: 'referral_programme', text: 'Social referral programme', stage: 'Advocacy' },
]

export const PLATFORM_CATEGORIES = {
  'Social Networking': ['Facebook', 'Instagram', 'Threads'],
  'Video Sharing': ['YouTube', 'TikTok', 'Vimeo'],
  'Professional Networking': ['LinkedIn'],
  'Social Commerce': ['Pinterest', 'Instagram Shopping', 'TikTok Shop'],
  'Community Platforms': ['Reddit', 'Discord', 'WhatsApp'],
  'Content Discovery': ['Pinterest', 'Flipboard', 'Medium'],
}

export const PLATFORMS_TO_CATEGORISE = [
  { id: 'facebook', name: 'Facebook', correct: 'Social Networking' },
  { id: 'youtube', name: 'YouTube', correct: 'Video Sharing' },
  { id: 'linkedin', name: 'LinkedIn', correct: 'Professional Networking' },
  { id: 'tiktok', name: 'TikTok', correct: 'Video Sharing' },
  { id: 'reddit', name: 'Reddit', correct: 'Community Platforms' },
  { id: 'pinterest', name: 'Pinterest', correct: 'Social Commerce' },
  { id: 'discord', name: 'Discord', correct: 'Community Platforms' },
  { id: 'instagram', name: 'Instagram', correct: 'Social Networking' },
]

export const PLATFORM_CATEGORIES_LIST = ['Social Networking', 'Video Sharing', 'Professional Networking', 'Social Commerce', 'Community Platforms']

export const ATTENTION_POSTS: Record<Brand, { id: string; description: string; stopFactors: string[] }[]> = {
  Nike: [
    { id: 'n1', description: 'Black screen. White text: "You weren\'t born a runner. You became one." No logo until final frame.', stopFactors: ['Emotion', 'Surprise', 'Relevance'] },
    { id: 'n2', description: 'Static product shot of new trainers on white background. Price tag visible. No copy.', stopFactors: ['Visual impact'] },
    { id: 'n3', description: 'Slow-motion athlete mid-race, rain, crowd blurred. Just Do It logo. No text.', stopFactors: ['Visual impact', 'Emotion'] },
  ],
  Netflix: [
    { id: 'nf1', description: '"POV: you said you\'d watch one episode" — dark room, laptop glow, 3am timestamp.', stopFactors: ['Relevance', 'Surprise', 'Emotion'] },
    { id: 'nf2', description: 'New release poster. Show title. "Now Streaming" text. Netflix logo.', stopFactors: ['Relevance'] },
    { id: 'nf3', description: 'Character staring directly at camera. No text. Just eyes. 3 seconds.', stopFactors: ['Visual impact', 'Surprise'] },
  ],
  Airbnb: [
    { id: 'ab1', description: 'Morning light through curtains. Coffee steam. View of mountains. No text for 2 seconds.', stopFactors: ['Visual impact', 'Emotion', 'Value'] },
    { id: 'ab2', description: '"The hotel was £180/night. This was £60." Side-by-side comparison.', stopFactors: ['Value', 'Surprise', 'Relevance'] },
    { id: 'ab3', description: 'Host smiling, handing keys. Guest hugging. Warm colour grade.', stopFactors: ['Emotion'] },
  ],
  Spotify: [
    { id: 'sp1', description: '"Your Tuesday 3pm playlist says everything about you." Colourful graphic, no song titles.', stopFactors: ['Relevance', 'Surprise', 'Emotion'] },
    { id: 'sp2', description: 'Artist name. Album cover. Release date. Stream now button.', stopFactors: ['Relevance'] },
    { id: 'sp3', description: '"87% of people who like this also cry in the car alone." Neon text on black.', stopFactors: ['Surprise', 'Emotion', 'Relevance'] },
  ],
  Innocent: [
    { id: 'in1', description: '"We put the \'no\' in smoothie. Wait, that\'s wrong." Hand-drawn text on white.', stopFactors: ['Surprise', 'Emotion'] },
    { id: 'in2', description: 'Close-up of strawberries being blended. Slow motion. No copy.', stopFactors: ['Visual impact'] },
    { id: 'in3', description: '"A third of your daily fruit in a bottle. Or you could eat 1.5 mangoes. Your call."', stopFactors: ['Value', 'Surprise', 'Relevance'] },
  ],
}

export const STOP_FACTORS = ['Visual impact', 'Relevance', 'Emotion', 'Surprise', 'Value']

export const AUDIENCE_MOTIVATIONS: Record<Brand, { motivations: string[]; painPoints: string[]; contentPrefs: string[]; platforms: string[] }> = {
  Nike: {
    motivations: ['Achievement', 'Self-improvement', 'Community belonging', 'Athletic identity'],
    painPoints: ['Lack of motivation', 'Injury fear', 'Expensive kit', 'Time constraints'],
    contentPrefs: ['Athlete stories', 'Training tips', 'Product launches', 'Community challenges'],
    platforms: ['Instagram', 'TikTok', 'YouTube'],
  },
  Netflix: {
    motivations: ['Entertainment escape', 'Social connection through shared shows', 'Discovery of new content', 'FOMO avoidance'],
    painPoints: ['Too much choice', 'Subscription fatigue', 'Spoilers', 'Running out of shows'],
    contentPrefs: ['Trailers & clips', 'Behind the scenes', 'Memes & reactions', 'Character spotlights'],
    platforms: ['Twitter/X', 'Instagram', 'TikTok'],
  },
  Airbnb: {
    motivations: ['Unique experiences', 'Value vs hotels', 'Local authenticity', 'Travel inspiration'],
    painPoints: ['Trust & safety concerns', 'Unexpected costs', 'Cancellation anxiety', 'Quality inconsistency'],
    contentPrefs: ['Stunning property photography', 'Destination guides', 'Host stories', 'Travel tips'],
    platforms: ['Instagram', 'Pinterest', 'TikTok'],
  },
  Spotify: {
    motivations: ['Mood enhancement', 'Discovery of new music', 'Personal identity expression', 'Social sharing'],
    painPoints: ['Algorithm getting it wrong', 'Artist payouts debate', 'Podcast overload', 'Sound quality'],
    contentPrefs: ['Playlist reveals', 'Artist content', 'Data-driven insights', 'Cultural commentary'],
    platforms: ['Instagram', 'TikTok', 'Twitter/X'],
  },
  Innocent: {
    motivations: ['Health improvement', 'Convenience', 'Sustainability values', 'Taste enjoyment'],
    painPoints: ['Price vs regular juice', 'Sugar content concerns', 'Plastic packaging', 'Availability'],
    contentPrefs: ['Humorous content', 'Behind-the-scenes', 'Sustainability stories', 'Recipe ideas'],
    platforms: ['Instagram', 'Twitter/X', 'Facebook'],
  },
}

export const ETHICAL_SCENARIOS = [
  {
    id: 'influencer_disclosure',
    title: 'Influencer Disclosure',
    scenario: 'An influencer partner posts about your brand without clearly labelling it as a paid partnership. Their post gets 200k likes.',
    options: [
      { id: 'a', text: 'Leave it — the post is performing well and disclosure would reduce engagement', risk: 'high', correct: false },
      { id: 'b', text: 'Ask them to add #ad — it\'s required by ASA guidelines and protects both parties', risk: 'low', correct: true },
      { id: 'c', text: 'Delete the post and repost with proper disclosure', risk: 'medium', correct: false },
    ],
    learning: 'The ASA requires clear disclosure of paid partnerships. "#ad" or "paid partnership" must be clearly visible. Brands are responsible for ensuring influencers comply.',
  },
  {
    id: 'data_privacy',
    title: 'Data & Privacy',
    scenario: 'You want to retarget website visitors with ads. A colleague suggests you can also use your email list without asking permission.',
    options: [
      { id: 'a', text: 'Use the email list — they\'ve already engaged with you so it\'s fine', risk: 'high', correct: false },
      { id: 'b', text: 'Only use website retargeting — email list requires explicit consent for ad targeting', risk: 'low', correct: true },
      { id: 'c', text: 'Ask the email list for consent first before using them for ad targeting', risk: 'low', correct: true },
    ],
    learning: 'GDPR requires explicit consent for using personal data in ad targeting. Purchasing intent from website visits is different from email marketing consent.',
  },
  {
    id: 'accessibility',
    title: 'Accessibility',
    scenario: 'Your new Instagram campaign uses text overlaid on fast-moving video. No captions or alt text are included.',
    options: [
      { id: 'a', text: 'Launch it — most users have sound on and can read the text', risk: 'high', correct: false },
      { id: 'b', text: 'Add captions to all videos and alt text to images before launching', risk: 'low', correct: true },
      { id: 'c', text: 'Add captions only to the highest-performing posts after launch', risk: 'medium', correct: false },
    ],
    learning: 'Accessible content reaches more people and is the right thing to do. 1 in 5 people have a disability. Captions also help the 85% of social users who watch video without sound.',
  },
]

export const COMMUNITY_TACTICS = [
  { id: 'ugc', label: 'User-Generated Content Campaigns', desc: 'Encourage followers to create and share brand content', impact: 'high' },
  { id: 'polls', label: 'Polls & Interactive Stories', desc: 'Drive engagement through questions and votes', impact: 'medium' },
  { id: 'challenges', label: 'Hashtag Challenges', desc: 'Create viral participation moments', impact: 'high' },
  { id: 'groups', label: 'Branded Community Groups', desc: 'Build owned communities on Facebook or Discord', impact: 'high' },
  { id: 'live', label: 'Live Events & Q&As', desc: 'Real-time engagement with your audience', impact: 'medium' },
  { id: 'ambassador', label: 'Ambassador Programmes', desc: 'Recruit loyal customers as brand advocates', impact: 'high' },
  { id: 'exclusives', label: 'Exclusive Member Content', desc: 'Reward community members with early access', impact: 'medium' },
  { id: 'co_creation', label: 'Co-creation Campaigns', desc: 'Involve community in product or content decisions', impact: 'high' },
]

export const PLATFORM_PRIORITY_LEVELS = ['Primary', 'Secondary', 'Monitor', 'Avoid'] as const
export const PLATFORMS_TO_PRIORITISE = ['Instagram', 'TikTok', 'Facebook', 'LinkedIn', 'YouTube', 'Twitter/X', 'Pinterest', 'Snapchat']

export const ALGORITHM_SCENARIOS = [
  {
    id: 'post_a',
    platform: 'TikTok',
    description: 'A 12-second video with no hashtags, filmed vertically, posted by a micro-creator. Gets 2.3M views.',
    dominantFactor: 'Watch Time',
    explanation: 'TikTok\'s algorithm prioritises completion rate and replays above all else. A short, compelling video that people watch again scores exponentially higher than longer content with low completion.',
  },
  {
    id: 'post_b',
    platform: 'Instagram',
    description: 'A carousel post asking "Swipe to see which one you are →" gets 4x more reach than the same brand\'s product posts.',
    dominantFactor: 'Engagement',
    explanation: 'Instagram rewards content that drives interactions. Carousels that encourage swiping signal strong engagement to the algorithm, dramatically increasing reach.',
  },
  {
    id: 'post_c',
    platform: 'LinkedIn',
    description: 'A personal story about career failure outperforms a polished company announcement by 10x.',
    dominantFactor: 'Relevance',
    explanation: 'LinkedIn\'s algorithm prioritises content that resonates with specific professional communities. Authentic personal narratives match user intent far better than corporate messaging.',
  },
]

export const ALGORITHM_FACTORS = ['Watch Time', 'Engagement', 'Shares', 'Saves', 'Relevance', 'Recency']

export const CONTENT_EXAMPLES: Record<Brand, { id: string; format: string; description: string; verdict: 'stop' | 'scroll'; reason: string }[]> = {
  Nike: [
    { id: 'n1', format: 'Reel', description: 'Athlete training montage, motivational music, logo at end. 45 seconds.', verdict: 'stop', reason: 'Emotional resonance, aspirational identity' },
    { id: 'n2', format: 'Static post', description: 'Product flat lay, 3 paragraphs of copy about features, 4 hashtags.', verdict: 'scroll', reason: 'Too much text, no immediate hook' },
  ],
  Netflix: [
    { id: 'nf1', format: 'TikTok', description: '"Tell me you\'re a Netflix person without telling me you\'re a Netflix person" — relatable text over cosy home footage.', verdict: 'stop', reason: 'Trend format, high relevance, invitation to engage' },
    { id: 'nf2', format: 'Static post', description: 'New show announcement with poster image and list of cast members.', verdict: 'scroll', reason: 'Informational, no emotional hook, feels like an ad' },
  ],
  Airbnb: [
    { id: 'ab1', format: 'Reel', description: 'Sunrise timelapse from a clifftop Airbnb. No text for 5 seconds. Just the view.', verdict: 'stop', reason: 'Visual impact, aspiration, slow reveal creates curiosity' },
    { id: 'ab2', format: 'Carousel', description: 'Top 10 Airbnbs in Portugal with prices and links.', verdict: 'stop', reason: 'High value, encourages swiping, purchase intent' },
  ],
  Spotify: [
    { id: 'sp1', format: 'TikTok', description: '"The song that lives rent-free in your head at 2am" — comment with yours. 847k comments.', verdict: 'stop', reason: 'Community participation, relatable moment, FOMO to comment' },
    { id: 'sp2', format: 'Static post', description: 'New podcast episode graphic. Title and guest name. Listen now.', verdict: 'scroll', reason: 'Generic format, no emotional hook, looks like every other podcast post' },
  ],
  Innocent: [
    { id: 'in1', format: 'Static post', description: '"We\'ve hidden a tiny man in this bottle. No we haven\'t. But wouldn\'t that be wild?" — product shot.', verdict: 'stop', reason: 'Unexpected humour, brand personality, invites engagement' },
    { id: 'in2', format: 'Reel', description: 'Smoothie being poured in slow motion. Upbeat music. Logo.', verdict: 'scroll', reason: 'Generic FMCG content, no differentiation from competitors' },
  ],
}

export const CAMPAIGN_PLATFORMS: Record<Brand, { name: string; message: string; promise: string }[]> = {
  Nike: [
    { name: 'Move More Together', message: 'Every step counts when we move as one', promise: 'We will celebrate every run, not just the fast ones' },
    { name: 'Built Different', message: 'Champions aren\'t born. They\'re built, rep by rep.', promise: 'We will show the work behind the win' },
  ],
  Netflix: [
    { name: 'Watch More, Regret Less', message: 'Life\'s too short for bad TV', promise: 'We will always have something worth staying up for' },
    { name: 'Your Next Obsession Awaits', message: 'You\'re one episode away from a new favourite', promise: 'We will never let you run out of things to love' },
  ],
  Airbnb: [
    { name: 'Stay Different', message: 'Hotels are for tourists. Airbnb is for travellers.', promise: 'We will help you live the destination, not just visit it' },
    { name: 'Belong Anywhere', message: 'Home is wherever you choose to stay', promise: 'We will make every stay feel like you belong there' },
  ],
  Spotify: [
    { name: 'Soundtrack Your Life', message: 'Every moment deserves the perfect song', promise: 'We will always know what you need to hear next' },
    { name: 'Discover What\'s Next', message: 'Your next favourite song hasn\'t found you yet', promise: 'We will introduce you to music that changes everything' },
  ],
  Innocent: [
    { name: 'Good Stuff. Honestly.', message: 'Real fruit, real taste, really good for you', promise: 'We will never sneak anything nasty past you' },
    { name: 'A Little Healthier, A Lot Happier', message: 'One bottle closer to your five a day', promise: 'We will make healthy feel less like a chore' },
  ],
}

export const CONTENT_FORMATS = [
  { id: 'static', label: 'Static Posts', desc: 'Single image or graphic — evergreen, brand consistent' },
  { id: 'carousels', label: 'Carousels', desc: 'Multi-image swipeable — high engagement, educational' },
  { id: 'stories', label: 'Stories', desc: 'Ephemeral 24hr content — casual, polls, behind-the-scenes' },
  { id: 'reels', label: 'Reels / Short Video', desc: 'High reach potential — entertaining, trending formats' },
  { id: 'livestreams', label: 'Livestreams', desc: 'Real-time engagement — launches, Q&As, events' },
  { id: 'polls', label: 'Polls & Interactive', desc: 'Community engagement — opinions, preferences' },
  { id: 'ugc', label: 'UGC & Reposts', desc: 'Authentic social proof — community content' },
  { id: 'longform', label: 'Long-form Video', desc: 'YouTube — tutorials, documentaries, deep dives' },
]

export const INFLUENCER_TIERS = [
  { id: 'nano', label: 'Nano (1K–10K)', desc: 'Highest engagement rates, niche audiences, very authentic, low cost', best: 'Community building, authenticity' },
  { id: 'micro', label: 'Micro (10K–100K)', desc: 'Strong engagement, targeted niches, trusted voices, affordable', best: 'Brand awareness in specific segments' },
  { id: 'macro', label: 'Macro (100K–1M)', desc: 'Broad reach, professional content, higher cost, lower engagement %', best: 'Mass awareness campaigns' },
  { id: 'mega', label: 'Celebrity / Mega (1M+)', desc: 'Maximum reach, premium cost, lower authenticity perception', best: 'Brand repositioning, major launches' },
  { id: 'ambassador', label: 'Brand Ambassador', desc: 'Long-term partnership, deepest brand alignment, ongoing storytelling', best: 'Sustained brand building' },
]

export const TARGETING_OPTIONS = {
  demographics: [
    { id: 'age_18_24', label: '18–24' }, { id: 'age_25_34', label: '25–34' },
    { id: 'age_35_44', label: '35–44' }, { id: 'gender_male', label: 'Male' },
    { id: 'gender_female', label: 'Female' }, { id: 'gender_all', label: 'All Genders' },
    { id: 'location_uk', label: 'United Kingdom' }, { id: 'location_us', label: 'United States' },
  ],
  interests: [
    { id: 'fitness', label: 'Fitness & Sport' }, { id: 'entertainment', label: 'Entertainment' },
    { id: 'travel', label: 'Travel' }, { id: 'music', label: 'Music' },
    { id: 'food', label: 'Food & Drink' }, { id: 'fashion', label: 'Fashion' },
    { id: 'sustainability', label: 'Sustainability' }, { id: 'tech', label: 'Technology' },
  ],
  behaviours: [
    { id: 'frequent_travellers', label: 'Frequent Travellers' }, { id: 'online_shoppers', label: 'Online Shoppers' },
    { id: 'app_users', label: 'Mobile App Users' }, { id: 'engaged_shoppers', label: 'Engaged Shoppers' },
  ],
  retargeting: [
    { id: 'website_visitors', label: 'Website Visitors (30 days)' }, { id: 'video_viewers', label: 'Video Viewers (75%)' },
    { id: 'page_engagers', label: 'Page Engagers (90 days)' }, { id: 'lookalikes', label: 'Lookalike Audience' },
  ],
}

export const BUDGET_CATEGORIES = [
  { id: 'content', label: 'Content Creation', desc: 'Production, design, copywriting' },
  { id: 'paid', label: 'Paid Social Ads', desc: 'Facebook, Instagram, TikTok spend' },
  { id: 'influencers', label: 'Influencer Partnerships', desc: 'Creator fees and gifting' },
  { id: 'community', label: 'Community Management', desc: 'Tools, team time, moderation' },
  { id: 'analytics', label: 'Analytics & Tools', desc: 'Scheduling, listening, reporting' },
]

export const CAMPAIGN_DATA: Record<Brand, { metric: string; value: string; status: 'good' | 'bad' | 'ok'; insight: string }[]> = {
  Nike: [
    { metric: 'Impressions', value: '2.4M', status: 'good', insight: 'Strong reach — campaign is being seen' },
    { metric: 'Engagement Rate', value: '0.8%', status: 'bad', insight: 'Below 1% benchmark — content not resonating' },
    { metric: 'Click-Through Rate', value: '0.3%', status: 'bad', insight: 'Low intent — ads not driving action' },
    { metric: 'Video Completion Rate', value: '62%', status: 'good', insight: 'Above 50% benchmark — video is compelling' },
    { metric: 'Cost Per Click', value: '£2.40', status: 'ok', insight: 'Acceptable but room to improve' },
    { metric: 'ROAS', value: '1.8x', status: 'bad', insight: 'Below 3x target — underperforming commercially' },
  ],
  Netflix: [
    { metric: 'Impressions', value: '5.1M', status: 'good', insight: 'Excellent reach for campaign budget' },
    { metric: 'Engagement Rate', value: '3.2%', status: 'good', insight: 'Strong — audience is engaging with content' },
    { metric: 'Click-Through Rate', value: '0.9%', status: 'ok', insight: 'Near benchmark for entertainment brands' },
    { metric: 'New Subscribers (attributed)', value: '1,240', status: 'bad', insight: 'Low conversion from clicks — landing page issue?' },
    { metric: 'Cost Per Acquisition', value: '£28', status: 'bad', insight: 'Above £15 target — acquisition too expensive' },
    { metric: 'Share Rate', value: '4.8%', status: 'good', insight: 'Very high shareability — content has viral potential' },
  ],
  Airbnb: [
    { metric: 'Impressions', value: '1.8M', status: 'ok', insight: 'Moderate reach — consider increasing budget' },
    { metric: 'Save Rate', value: '6.2%', status: 'good', insight: 'High saves = high purchase intent for travel' },
    { metric: 'Profile Visits', value: '45,000', status: 'good', insight: 'Strong interest driving discovery' },
    { metric: 'Booking Clicks', value: '2,100', status: 'ok', insight: 'Reasonable but below target' },
    { metric: 'Cost Per Booking Click', value: '£4.20', status: 'ok', insight: 'Acceptable — aligns with travel benchmarks' },
    { metric: 'Follower Growth', value: '+0.2%', status: 'bad', insight: 'Minimal community growth — content not building long-term audience' },
  ],
  Spotify: [
    { metric: 'Impressions', value: '8.3M', status: 'good', insight: 'Excellent reach — strong distribution' },
    { metric: 'Engagement Rate', value: '5.7%', status: 'good', insight: 'Outstanding — highly engaging content format' },
    { metric: 'Comment Rate', value: '2.1%', status: 'good', insight: 'Users are in conversation — community building' },
    { metric: 'Stream Opens (attributed)', value: '18,400', status: 'ok', insight: 'Good but short of 25k target' },
    { metric: 'Premium Conversions', value: '320', status: 'bad', insight: 'Very low — not converting engagement to revenue' },
    { metric: 'Share Rate', value: '7.4%', status: 'good', insight: 'Exceptional — users want to share the content' },
  ],
  Innocent: [
    { metric: 'Impressions', value: '640,000', status: 'ok', insight: 'Limited reach — budget constraints visible' },
    { metric: 'Engagement Rate', value: '4.1%', status: 'good', insight: 'Strong — humorous content driving interactions' },
    { metric: 'Website Clicks', value: '3,200', status: 'ok', insight: 'Moderate — could improve with stronger CTA' },
    { metric: 'Stockist Lookups', value: '890', status: 'bad', insight: 'Low purchase intent actions — funnel not working' },
    { metric: 'UGC Posts Tagged', value: '142', status: 'good', insight: 'Strong community advocacy' },
    { metric: 'Cost Per Engagement', value: '£0.08', status: 'good', insight: 'Excellent efficiency for FMCG brand' },
  ],
}

export const FUNNEL_DATA: Record<Brand, { stage: string; users: number; dropoff: string }[]> = {
  Nike: [
    { stage: 'Ad Impression', users: 2400000, dropoff: '97% don\'t click' },
    { stage: 'Click to Site', users: 72000, dropoff: '45% bounce immediately' },
    { stage: 'Product View', users: 39600, dropoff: '78% don\'t add to cart' },
    { stage: 'Add to Cart', users: 8712, dropoff: '65% abandon cart' },
    { stage: 'Purchase', users: 3049, dropoff: '' },
  ],
  Netflix: [
    { stage: 'Ad Impression', users: 5100000, dropoff: '98% don\'t click' },
    { stage: 'Click to Site', users: 102000, dropoff: '55% bounce' },
    { stage: 'Plan Page View', users: 45900, dropoff: '73% don\'t start trial' },
    { stage: 'Trial Started', users: 12393, dropoff: '90% don\'t convert' },
    { stage: 'Paid Subscriber', users: 1240, dropoff: '' },
  ],
  Airbnb: [
    { stage: 'Ad Impression', users: 1800000, dropoff: '97.5% don\'t click' },
    { stage: 'Click to Site', users: 45000, dropoff: '40% bounce' },
    { stage: 'Property View', users: 27000, dropoff: '92% don\'t enquire' },
    { stage: 'Booking Started', users: 2160, dropoff: '3% abandon' },
    { stage: 'Booking Completed', users: 2095, dropoff: '' },
  ],
  Spotify: [
    { stage: 'Ad Impression', users: 8300000, dropoff: '99% don\'t click' },
    { stage: 'Click to App', users: 83000, dropoff: '78% don\'t open' },
    { stage: 'App Opened', users: 18260, dropoff: '78% stay free' },
    { stage: 'Premium Page View', users: 4015, dropoff: '92% don\'t convert' },
    { stage: 'Premium Subscriber', users: 320, dropoff: '' },
  ],
  Innocent: [
    { stage: 'Ad Impression', users: 640000, dropoff: '99.5% don\'t click' },
    { stage: 'Click to Site', users: 3200, dropoff: '72% bounce' },
    { stage: 'Stockist Page', users: 896, dropoff: '0.6% find store' },
    { stage: 'Stockist Lookup', users: 890, dropoff: '' },
    { stage: 'Estimated Purchase', users: 180, dropoff: '' },
  ],
}

export const KPI_OPTIONS = [
  { id: 'reach', label: 'Reach', stage: 'Awareness', desc: 'Total unique accounts who saw content' },
  { id: 'impressions', label: 'Impressions', stage: 'Awareness', desc: 'Total times content was displayed' },
  { id: 'share_of_voice', label: 'Share of Voice', stage: 'Awareness', desc: '% of category conversation owned' },
  { id: 'brand_mentions', label: 'Brand Mentions', stage: 'Awareness', desc: 'Organic mentions across platforms' },
  { id: 'engagement_rate', label: 'Engagement Rate', stage: 'Engagement', desc: 'Likes, comments, shares as % of reach' },
  { id: 'saves', label: 'Saves', stage: 'Engagement', desc: 'Users bookmarking content for later' },
  { id: 'comment_sentiment', label: 'Comment Sentiment', stage: 'Engagement', desc: 'Quality of community conversation' },
  { id: 'share_rate', label: 'Share Rate', stage: 'Engagement', desc: 'Content shared as % of reach' },
  { id: 'ctr', label: 'Click-Through Rate', stage: 'Conversion', desc: 'Clicks as % of impressions' },
  { id: 'conversion_rate', label: 'Conversion Rate', stage: 'Conversion', desc: 'Actions completed vs visitors' },
  { id: 'roas', label: 'ROAS', stage: 'Conversion', desc: 'Revenue per £1 of ad spend' },
  { id: 'cpa', label: 'Cost Per Acquisition', stage: 'Conversion', desc: 'Cost to acquire one customer' },
  { id: 'ugc_volume', label: 'UGC Volume', stage: 'Advocacy', desc: 'User-generated content tagged with brand' },
  { id: 'nps', label: 'Net Promoter Score', stage: 'Advocacy', desc: 'Likelihood to recommend' },
  { id: 'follower_growth', label: 'Community Growth Rate', stage: 'Advocacy', desc: 'Monthly follower growth %' },
  { id: 'referrals', label: 'Social Referrals', stage: 'Advocacy', desc: 'Traffic/sales from social sharing' },
]

export const AI_CONTENT_EXAMPLES: Record<Brand, { id: string; content: string; isAI: boolean; giveaway: string }[]> = {
  Nike: [
    { id: 'n1', content: '"You didn\'t wake up at 5am because it\'s easy. You woke up because you know what you\'re building." — @nike', isAI: true, giveaway: 'Grammatically perfect, lacks specific human experience, could apply to any athletic brand' },
    { id: 'n2', content: '"My knees are rubbish. My lungs gave up after the second hill. The dog is faster than me. But I finished. That\'s enough." — caption from a real runner\'s post', isAI: false, giveaway: 'Specific, imperfect, self-deprecating — AI would not choose to sound this uncertain' },
  ],
  Netflix: [
    { id: 'nf1', content: '"Studies show that people who watch Netflix together report 34% higher relationship satisfaction. We\'re basically couples therapy."', isAI: true, giveaway: 'The statistic sounds plausible but is invented — classic AI hallucination pattern combined with brand voice imitation' },
    { id: 'nf2', content: '"ok who else rewatched the same scene 7 times bc they couldn\'t believe that actually happened"', isAI: false, giveaway: 'Lowercase, informal grammar, specific emotional reaction — authentic social voice' },
  ],
  Airbnb: [
    { id: 'ab1', content: '"Discover the perfect balance of comfort and adventure with our curated selection of unique properties across 220 countries and territories."', isAI: true, giveaway: 'Corporate phrasing, exact stat, no emotional hook — sounds like marketing copy not social content' },
    { id: 'ab2', content: '"Still thinking about the host who left homemade jam and a note that said \'help yourself, I made too much\'. That was three years ago."', isAI: false, giveaway: 'Hyper-specific memory, emotional residue, the kind of tiny detail AI doesn\'t invent' },
  ],
  Spotify: [
    { id: 'sp1', content: '"Music has the unique ability to transport listeners to specific moments in time, triggering memories and emotions with remarkable precision."', isAI: true, giveaway: 'Academic register, no personality, no Spotify voice — reads like a Wikipedia introduction' },
    { id: 'sp2', content: '"the song you skip every time but never delete says a lot about you actually"', isAI: false, giveaway: 'No capital letters, specifically relatable behaviour, creates instant emotional recognition' },
  ],
  Innocent: [
    { id: 'in1', content: '"At Innocent, we\'re committed to creating delicious, nutritious drinks made from the finest natural ingredients while maintaining our dedication to environmental sustainability."', isAI: true, giveaway: 'Generic corporate sustainability language — nothing like Innocent\'s actual playful voice' },
    { id: 'in2', content: '"This smoothie has 0% added sugar, 100% real fruit, and approximately 47% of the love we put into making it. The rest got left in the blender."', isAI: false, giveaway: 'Innocent\'s specific self-aware humour — the 47% joke is the kind of unexpected specificity that defines their voice' },
  ],
}

export const FUTURE_TRENDS = [
  { id: 'gen_ai', label: 'Generative AI', desc: 'AI creates content, images, and campaigns at scale' },
  { id: 'social_search', label: 'Social Search', desc: 'TikTok and Instagram replacing Google for discovery' },
  { id: 'automation', label: 'Full Campaign Automation', desc: 'AI manages bidding, targeting, creative optimisation' },
  { id: 'synthetic_influencers', label: 'Synthetic Influencers', desc: 'AI-generated virtual creators with massive followings' },
  { id: 'predictive', label: 'Predictive Analytics', desc: 'AI predicts what content will perform before posting' },
  { id: 'ar_social', label: 'AR Social Experiences', desc: 'Augmented reality becomes standard in social content' },
  { id: 'social_commerce', label: 'Full Social Commerce', desc: 'Complete purchase journey within social platforms' },
]

export const BRAND_CONTEXT: Record<Brand, { industry: string; mainPlatforms: string[]; audience: string; tone: string; challenge: string }> = {
  Nike: { industry: 'Sports & Apparel', mainPlatforms: ['Instagram','TikTok','YouTube','Twitter/X'], audience: '16–35 athletes and fitness enthusiasts', tone: 'Inspirational, bold, motivating', challenge: 'Maintaining authenticity while scaling globally' },
  Netflix: { industry: 'Streaming Entertainment', mainPlatforms: ['Instagram','TikTok','Twitter/X','Facebook'], audience: '18–45 entertainment consumers', tone: 'Witty, culturally aware, conversational', challenge: 'Content volume competing for social attention' },
  Airbnb: { industry: 'Travel & Hospitality', mainPlatforms: ['Instagram','Pinterest','TikTok','Facebook'], audience: '25–45 experience-driven travellers', tone: 'Aspirational, warm, community-driven', challenge: 'Building trust through social content' },
  Spotify: { industry: 'Music & Podcast Streaming', mainPlatforms: ['Instagram','TikTok','Twitter/X','YouTube'], audience: '16–34 music and podcast listeners', tone: 'Creative, data-driven, culturally relevant', challenge: 'Standing out in a saturated streaming market' },
  Innocent: { industry: 'FMCG / Healthy Drinks', mainPlatforms: ['Instagram','Twitter/X','Facebook','TikTok'], audience: '25–40 health-conscious consumers', tone: 'Playful, honest, sustainability-focused', challenge: 'Competing with larger FMCG budgets through wit' },
}

export function calcCompletionPts(fields: string[], minLen = 10): number {
  const filled = fields.filter(f => f && f.trim().length >= minLen).length
  const ratio = filled / fields.length
  if (ratio >= 1) return 2
  if (ratio >= 0.5) return 1
  return 0
}

export function scoreDecisions(selected: string[], correct: string[], partial = false): number {
  const hits = selected.filter(s => correct.includes(s)).length
  const misses = selected.filter(s => !correct.includes(s)).length
  if (partial) return Math.max(0, hits - misses)
  return hits === correct.length && misses === 0 ? correct.length : Math.max(0, hits - misses)
}
