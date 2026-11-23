import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';
import type { Schema } from '@google/genai';

export interface CreatorContextPayload {
  creatorMode: string;
  creatorType: string;
  niche: string;
  topic: string;
  targetAudience: string;
  targetCountry: string;
  language: string;
  accountType: string;
  contentGoals: string;
  brandVoice: string;
}

const MODE_GUIDANCE: Record<string, string> = {
  influencers: 'Focus on lifestyle relatability, authentic first-person voice, save-worthy routines, and brand-friendly discoverability.',
  ugc_creators: 'Focus on scroll-stopping 3-second ad hooks, problem-agitate-solve framing, portfolio searchability for brands, and organic product storytelling.',
  youtubers: 'Focus on curiosity gaps, episodic video teasers, searchable long-form companion topics, and cross-platform click motivation.',
  gaming_creators: 'Focus on exact game titles, patch/meta/loadout terms, clip reaction hooks, and community debate prompts.',
  music_lyrics: 'Focus on emotional lyric hooks, genre/mood discovery keywords, audio save triggers, and songwriter/artist backstory.',
  fashion_beauty: 'Focus on outfit formulas, shade/texture descriptors, seasonal styling keywords, and saveable lookbooks.',
  fitness_creators: 'Focus on exercise form cues, muscle/mobility keywords, realistic progression, and bookmarkable workout splits.',
  travel_creators: 'Focus on destination + itinerary keywords, neighborhood/seasonal specifics, practical logistics, and trip-saving value.',
  food_creators: 'Focus on dish name, prep time, dietary keywords, sensory opening lines, and structured ingredient/step captions for saves.',
  educational_creators: 'Focus on clear how-to search intent, step-by-step clarity, myth-busting hooks, and high-save carousel/caption structure.',
  comedy_meme: 'Focus on relatable POV setups, concise punchlines, DM-share triggers ("tag someone who..."), and cultural nuance.',
  motivational_creators: 'Focus on grounded emotional truth without hollow clichés, quotable cover lines, and reflective comment prompts.',
  photography_art: 'Focus on visual medium/camera/style descriptors, rich descriptive SEO alt text, and behind-the-craft storytelling.',
  podcast_creators: 'Focus on guest/theme searchability, provocative clip hooks, distilled quote takeaways, and episode-listen CTAs.',
  affiliate_marketers: 'Focus on honest comparison keywords, use-case specificity, transparent value framing, and comment-to-DM keyword CTAs.',
  business_product: 'Focus on buyer-intent search terms, craft/process transparency, customer problem clarity, and non-pushy conversion CTAs.',
  personal_branding: 'Focus on authority positioning, signature frameworks, clear expertise keywords, and trust-building narrative depth.',
};

function getClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    const err = new Error('GEMINI_API_KEY is not configured. Add your Gemini API key in Settings > Secrets.');
    (err as Error & { status?: number }).status = 401;
    throw err;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function getLanguageInstruction(language: string): string {
  switch (language) {
    case 'Urdu':
      return 'Write all creator-facing copy (titles, captions, hooks, bios, CTAs, cover text, content ideas, alt text) in natural, idiomatic Urdu script (اردو) suitable for Instagram creators, while keeping hashtags relevant in Urdu/English mix as creators actually search on Instagram.';
    case 'Hindi':
      return 'Write all creator-facing copy (titles, captions, hooks, bios, CTAs, cover text, content ideas, alt text) in natural, modern Hindi (Devanagari script हिन्दी) suitable for Instagram creators, with searchable Hindi/English hashtags as actually used on Instagram.';
    case 'Roman Urdu':
      return 'Write all creator-facing copy (titles, captions, hooks, bios, CTAs, cover text, content ideas, alt text) in natural conversational Roman Urdu (e.g., "Aaj ki post mein...") as Pakistani and South Asian Instagram creators naturally write, paired with high-intent searchable hashtags.';
    default:
      return 'Write all creator-facing copy in crisp, natural English tailored to the target country and audience.';
  }
}

function buildContextPrompt(ctx: CreatorContextPayload): string {
  const modeHint = MODE_GUIDANCE[ctx.creatorMode] ?? MODE_GUIDANCE.educational_creators;
  return [
    `Creator Mode: ${ctx.creatorMode} (${modeHint})`,
    `Creator Type: ${ctx.creatorType}`,
    `Instagram Niche: ${ctx.niche}`,
    `Content Topic: ${ctx.topic}`,
    `Target Audience: ${ctx.targetAudience}`,
    `Target Country/Region: ${ctx.targetCountry}`,
    `Content Language: ${ctx.language}`,
    `Instagram Account Type: ${ctx.accountType}`,
    `Content Goals: ${ctx.contentGoals}`,
    `Brand Voice: ${ctx.brandVoice}`,
    getLanguageInstruction(ctx.language),
  ].join('\n');
}

const scoreBreakdownSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    overallScore: { type: Type.INTEGER, description: 'Estimated overall Instagram SEO score from 0 to 100.' },
    captionScore: { type: Type.INTEGER, description: 'Estimated caption hook & structure score 0-100.' },
    keywordScore: { type: Type.INTEGER, description: 'Estimated search keyword integration score 0-100.' },
    hashtagRelevance: { type: Type.INTEGER, description: 'Estimated hashtag topical relevance score 0-100.' },
    readability: { type: Type.INTEGER, description: 'Estimated skimmability & mobile readability score 0-100.' },
    ctaScore: { type: Type.INTEGER, description: 'Estimated call-to-action effectiveness score 0-100.' },
    recommendations: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: '3 to 5 specific, actionable Instagram SEO improvements.',
    },
    strengths: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: '2 to 4 concrete strengths of the optimization.',
    },
  },
  required: [
    'overallScore',
    'captionScore',
    'keywordScore',
    'hashtagRelevance',
    'readability',
    'ctaScore',
    'recommendations',
    'strengths',
  ],
};

async function callGeminiJson<T>(systemInstruction: string, prompt: string, responseSchema: Schema): Promise<T> {
  const ai = getClient();
  const maxAttempts = 3;
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema,
          thinkingConfig: {
            thinkingLevel: ThinkingLevel.LOW,
          },
        },
      });

      const raw = (response.text ?? '').trim();
      if (!raw) {
        throw new Error('Gemini returned an empty response.');
      }
      return JSON.parse(raw) as T;
    } catch (err: unknown) {
      lastError = err;
      const msg = err instanceof Error ? err.message : String(err);
      const isTransient =
        msg.includes('503') ||
        msg.includes('500') ||
        msg.includes('UNAVAILABLE') ||
        msg.includes('ETIMEDOUT') ||
        msg.includes('ECONNRESET');

      if (!isTransient || attempt === maxAttempts) {
        throw err;
      }
      await new Promise((resolve) => setTimeout(resolve, 600 * attempt));
    }
  }

  throw lastError;
}

const SYSTEM_BASE =
  'You are INSTarank AI, an expert Instagram Search & Discovery SEO strategist for all types of creators (gamers, musicians, educators, influencers, UGC creators, food/travel/fashion creators, podcasters, comedians, artists, and small brands). ' +
  'Prioritize authentic, non-spammy, Instagram-search-indexed copy. Never invent fake live search volume numbers, fabricated impression counts, or claims about private Instagram account data.';

export async function generateUniversalSeo(ctx: CreatorContextPayload) {
  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      titles: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Exactly 5 SEO-friendly titles.' },
      captions: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            style: { type: Type.STRING, description: 'Caption style label, e.g., Punchy Short, Storytelling, Educational Value.' },
            text: { type: Type.STRING, description: 'Full optimized Instagram caption with line breaks and hook.' },
          },
          required: ['style', 'text'],
        },
        description: 'Exactly 3 distinct optimized captions.',
      },
      hashtags: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Exactly 40 relevant Instagram hashtags starting with #.' },
      primaryKeywords: { type: Type.ARRAY, items: { type: Type.STRING }, description: '5-7 primary Instagram search keywords.' },
      secondaryKeywords: { type: Type.ARRAY, items: { type: Type.STRING }, description: '6-8 secondary topic keywords.' },
      longTailKeywords: { type: Type.ARRAY, items: { type: Type.STRING }, description: '6-8 long-tail conversational search phrases.' },
      relatedSearchTerms: { type: Type.ARRAY, items: { type: Type.STRING }, description: '6-8 related terms users type into Instagram Search.' },
      altText: { type: Type.STRING, description: 'Descriptive, natural, SEO-friendly Instagram Alt Text (120-200 chars).' },
      firstComment: { type: Type.STRING, description: 'Engaging pinned first comment that sparks conversation and reinforces topic context.' },
      ctaSuggestions: { type: Type.ARRAY, items: { type: Type.STRING }, description: '4-5 varied CTA options aligned with content goals.' },
      coverTextIdeas: { type: Type.ARRAY, items: { type: Type.STRING }, description: '4-5 concise, high-contrast cover text headline ideas.' },
      scoreBreakdown: scoreBreakdownSchema,
    },
    required: [
      'titles',
      'captions',
      'hashtags',
      'primaryKeywords',
      'secondaryKeywords',
      'longTailKeywords',
      'relatedSearchTerms',
      'altText',
      'firstComment',
      'ctaSuggestions',
      'coverTextIdeas',
      'scoreBreakdown',
    ],
  };

  const prompt = `Generate a complete Universal Instagram SEO package for this creator:\n\n${buildContextPrompt(ctx)}\n\nRequirements:\n- Exactly 5 SEO-friendly titles\n- Exactly 3 distinct optimized captions (varied lengths & structures)\n- Exactly 40 relevant, niche-accurate hashtags (no spaces, starting with #)\n- Primary, secondary, long-tail keywords, and related Instagram search terms\n- SEO-friendly descriptive alt text\n- High-engagement first comment\n- CTA suggestions and cover text ideas\n- Realistic SEO score breakdown for this generated package.`;

  return callGeminiJson(SYSTEM_BASE, prompt, schema);
}

export async function generateReelsSeo(ctx: CreatorContextPayload, reelLength?: string) {
  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      reelTitles: { type: Type.ARRAY, items: { type: Type.STRING }, description: '5 SEO-friendly Reel titles.' },
      hooks: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Exactly 10 attention-grabbing first-3-second hooks.' },
      captions: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            angle: { type: Type.STRING },
            text: { type: Type.STRING },
          },
          required: ['angle', 'text'],
        },
        description: 'Exactly 3 Reel captions.',
      },
      hashtags: { type: Type.ARRAY, items: { type: Type.STRING }, description: '15-25 focused Reel hashtags starting with #.' },
      spokenAudioKeywords: { type: Type.ARRAY, items: { type: Type.STRING }, description: '8-10 natural phrases to speak aloud in the Reel for Instagram audio/auto-caption indexing.' },
      onScreenText: { type: Type.ARRAY, items: { type: Type.STRING }, description: '5-7 timed on-screen text overlays for visual retention & OCR indexing.' },
      coverTitle: { type: Type.STRING, description: 'Short 3-6 word Reel cover title for the profile grid.' },
      cta: { type: Type.STRING, description: 'Clear ending CTA optimized for saves, shares, or comments.' },
      contentDescription: { type: Type.STRING, description: 'Concise Reel flow & pacing blueprint (Hook -> Value -> Payoff).' },
      scoreBreakdown: scoreBreakdownSchema,
    },
    required: [
      'reelTitles',
      'hooks',
      'captions',
      'hashtags',
      'spokenAudioKeywords',
      'onScreenText',
      'coverTitle',
      'cta',
      'contentDescription',
      'scoreBreakdown',
    ],
  };

  const prompt = `Generate an Instagram Reels SEO & Retention kit:\n\n${buildContextPrompt(ctx)}\nPreferred Reel Format/Length: ${reelLength || '15-45 seconds'}\n\nRequirements:\n- 5 SEO-friendly Reel titles\n- Exactly 10 scroll-stopping hooks\n- Exactly 3 Reel captions\n- Relevant hashtags starting with #\n- Spoken audio keywords (words the creator should say out loud for Instagram speech recognition)\n- On-screen text overlays\n- Cover title, CTA, and content pacing description\n- SEO score breakdown.`;

  return callGeminiJson(SYSTEM_BASE, prompt, schema);
}

export async function generatePostCarouselSeo(ctx: CreatorContextPayload, slideCount: number) {
  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      carouselTitles: { type: Type.ARRAY, items: { type: Type.STRING }, description: '5 searchable carousel cover titles.' },
      slides: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            slideNumber: { type: Type.INTEGER },
            heading: { type: Type.STRING },
            body: { type: Type.STRING },
            visualDirection: { type: Type.STRING },
          },
          required: ['slideNumber', 'heading', 'body', 'visualDirection'],
        },
        description: `Slide-by-slide content plan for ${slideCount} slides.`,
      },
      seoCaptions: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            style: { type: Type.STRING },
            text: { type: Type.STRING },
          },
          required: ['style', 'text'],
        },
        description: '3 SEO captions tailored for a carousel/static post.',
      },
      hashtags: { type: Type.ARRAY, items: { type: Type.STRING }, description: '20-25 relevant hashtags starting with #.' },
      altText: { type: Type.STRING, description: 'Descriptive SEO alt text for the lead image/carousel.' },
      engagementQuestions: { type: Type.ARRAY, items: { type: Type.STRING }, description: '5 thoughtful questions to prompt comments.' },
      scoreBreakdown: scoreBreakdownSchema,
    },
    required: ['carouselTitles', 'slides', 'seoCaptions', 'hashtags', 'altText', 'engagementQuestions', 'scoreBreakdown'],
  };

  const prompt = `Generate an Instagram Carousel & Post SEO blueprint with ${slideCount} slides:\n\n${buildContextPrompt(ctx)}\n\nMake Slide 1 an irresistible curiosity/value cover, middle slides crisp and scannable, and the final slide a high-save summary + CTA. Include SEO captions, hashtags, descriptive alt text, and engagement questions.`;

  return callGeminiJson(SYSTEM_BASE, prompt, schema);
}

export async function generateProfileSeo(ctx: CreatorContextPayload, currentHandle?: string, currentBio?: string) {
  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      usernameIdeas: { type: Type.ARRAY, items: { type: Type.STRING }, description: '6 clean, memorable Instagram handle ideas (without @ or with @).' },
      displayName: { type: Type.STRING, description: 'Search-optimized Instagram Name field (up to 30-60 chars combining creator name/brand + primary search keyword).' },
      seoBio: { type: Type.STRING, description: 'Complete Instagram bio strictly under 150 characters with clear niche value + CTA.' },
      profileKeywords: { type: Type.ARRAY, items: { type: Type.STRING }, description: '8 core profile search keywords.' },
      nichePositioning: { type: Type.STRING, description: 'Clear 1-2 sentence niche positioning statement explaining who the account serves and why to follow.' },
      cta: { type: Type.STRING, description: 'Focused profile bio CTA aligned with account goals.' },
      improvementTips: { type: Type.ARRAY, items: { type: Type.STRING }, description: '5 actionable profile & pinned-post optimization tips.' },
      scoreBreakdown: scoreBreakdownSchema,
    },
    required: ['usernameIdeas', 'displayName', 'seoBio', 'profileKeywords', 'nichePositioning', 'cta', 'improvementTips', 'scoreBreakdown'],
  };

  const prompt = `Generate an Instagram Profile SEO optimization plan:\n\n${buildContextPrompt(ctx)}\nCurrent Handle (if provided): ${currentHandle || 'Not provided'}\nCurrent Bio (if provided): ${currentBio || 'Not provided'}\n\nRequirements:\n- 6 clean username ideas\n- Search-indexed Display Name (Name field is weighted heavily in Instagram Search)\n- SEO-optimized bio under 150 characters\n- Profile keywords, niche positioning, bio CTA, and improvement tips.`;

  return callGeminiJson(SYSTEM_BASE, prompt, schema);
}

export async function optimizeCaption(ctx: CreatorContextPayload, existingCaption: string, existingHashtags?: string) {
  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      improvedCaption: { type: Type.STRING, description: 'Rewritten, high-SEO, readable Instagram caption preserving the creator voice.' },
      improvedHashtags: { type: Type.ARRAY, items: { type: Type.STRING }, description: '15-20 refined hashtags starting with #.' },
      analysis: {
        type: Type.OBJECT,
        properties: {
          seoQuality: { type: Type.STRING },
          keywordPlacement: { type: Type.STRING },
          readabilityFeedback: { type: Type.STRING },
          engagementPotential: { type: Type.STRING },
          ctaQuality: { type: Type.STRING },
          hashtagRelevanceFeedback: { type: Type.STRING },
        },
        required: [
          'seoQuality',
          'keywordPlacement',
          'readabilityFeedback',
          'engagementPotential',
          'ctaQuality',
          'hashtagRelevanceFeedback',
        ],
      },
      scoreBreakdown: scoreBreakdownSchema,
    },
    required: ['improvedCaption', 'improvedHashtags', 'analysis', 'scoreBreakdown'],
  };

  const prompt = `Analyze and optimize this existing Instagram caption:\n\nCreator Context:\n${buildContextPrompt(ctx)}\n\nExisting Caption:\n"""\n${existingCaption}\n"""\nExisting Hashtags:\n${existingHashtags || 'None provided'}\n\nEvaluate SEO quality, keyword placement in the first 125 characters, mobile readability, engagement potential, CTA quality, and hashtag relevance. Score the ORIGINAL draft accurately in scoreBreakdown (and give concrete recommendations), then provide an upgraded improvedCaption and improvedHashtags.`;

  return callGeminiJson(SYSTEM_BASE, prompt, schema);
}

export async function generateHashtags(ctx: CreatorContextPayload) {
  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      broad: { type: Type.ARRAY, items: { type: Type.STRING }, description: '8-10 broad category hashtags starting with #.' },
      medium: { type: Type.ARRAY, items: { type: Type.STRING }, description: '10-12 medium-specificity community hashtags starting with #.' },
      niche: { type: Type.ARRAY, items: { type: Type.STRING }, description: '10-12 tight niche hashtags starting with #.' },
      longTail: { type: Type.ARRAY, items: { type: Type.STRING }, description: '8-10 long-tail topic/intent hashtags starting with #.' },
      strategyNote: { type: Type.STRING, description: 'Practical guidance on how to combine these tiers without inventing fake search volume or popularity numbers.' },
      scoreBreakdown: scoreBreakdownSchema,
    },
    required: ['broad', 'medium', 'niche', 'longTail', 'strategyNote', 'scoreBreakdown'],
  };

  const prompt = `Generate categorized niche-specific Instagram hashtags:\n\n${buildContextPrompt(ctx)}\n\nCRITICAL RULE: NEVER invent or fabricate live post counts, search volume numbers, or popularity percentages. Categorize purely by topical specificity into Broad, Medium, Niche, and Long-tail.`;

  return callGeminiJson(SYSTEM_BASE, prompt, schema);
}

export async function generateContentIdeas(ctx: CreatorContextPayload) {
  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      contentIdeas: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Exactly 30 diverse creator content ideas.' },
      reelIdeas: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Exactly 10 Instagram Reel concepts.' },
      viralHooks: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Exactly 10 high-retention opening hooks.' },
      carouselIdeas: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Exactly 10 save-worthy carousel concepts.' },
      weeklyStrategy: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            day: { type: Type.STRING },
            format: { type: Type.STRING },
            topic: { type: Type.STRING },
            goal: { type: Type.STRING },
            hookIdea: { type: Type.STRING },
          },
          required: ['day', 'format', 'topic', 'goal', 'hookIdea'],
        },
        description: '7-day weekly posting strategy (Monday through Sunday).',
      },
    },
    required: ['contentIdeas', 'reelIdeas', 'viralHooks', 'carouselIdeas', 'weeklyStrategy'],
  };

  const prompt = `Generate a full Creator Content Ideas & Weekly Strategy bank:\n\n${buildContextPrompt(ctx)}\n\nRequirements:\n- Exactly 30 content ideas\n- Exactly 10 Reel ideas\n- Exactly 10 viral-style hooks\n- Exactly 10 carousel ideas\n- 7-day weekly content strategy (Monday-Sunday) balancing discovery Reels, saveable Carousels, and community engagement.`;

  return callGeminiJson(SYSTEM_BASE, prompt, schema);
}

export async function analyzeCompetitor(
  ctx: CreatorContextPayload,
  competitorUsername: string,
  publicNotes: string
) {
  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      contentThemes: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Key observed or niche-aligned content themes.' },
      captionStructure: { type: Type.STRING, description: 'Breakdown of caption patterns, hook style, formatting, and CTA cadence.' },
      keywordStrategy: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Searchable keywords & topical clusters identified or recommended.' },
      hashtagPatterns: { type: Type.STRING, description: 'Analysis of hashtag mix, specificity, and placement patterns.' },
      contentOpportunities: { type: Type.ARRAY, items: { type: Type.STRING }, description: '5-6 untapped content gaps and angle opportunities.' },
      differentiationActions: { type: Type.ARRAY, items: { type: Type.STRING }, description: '4-5 concrete actions to stand out from this positioning.' },
      disclaimer: { type: Type.STRING, description: 'Clear statement noting analysis is derived strictly from user-supplied public content and niche benchmarks, with no private Instagram data access.' },
    },
    required: [
      'contentThemes',
      'captionStructure',
      'keywordStrategy',
      'hashtagPatterns',
      'contentOpportunities',
      'differentiationActions',
      'disclaimer',
    ],
  };

  const prompt = `Perform an ethical, transparent Competitor Content & SEO Strategy Analysis:\n\nUser Creator Context:\n${buildContextPrompt(ctx)}\n\nPublic Competitor Reference Handle: ${competitorUsername || 'Not specified'}\nPublicly Available Content / Bio / Captions Pasted by User:\n"""\n${publicNotes}\n"""\n\nCRITICAL GUARDRAILS:\n- Do NOT claim to have fetched live or private Instagram account data.\n- Base your analysis strictly on the user-provided public text/captions/bio/handle context and general niche SEO patterns.\n- Highlight actionable content opportunities and differentiation angles.`;

  return callGeminiJson(SYSTEM_BASE, prompt, schema);
}
