export type ContentLanguage = 'English' | 'Urdu' | 'Hindi' | 'Roman Urdu';

export type AccountType =
  | 'Creator'
  | 'Personal'
  | 'Business'
  | 'Public Figure'
  | 'Media / Publisher';

export type CreatorModeId =
  | 'influencers'
  | 'ugc_creators'
  | 'youtubers'
  | 'gaming_creators'
  | 'music_lyrics'
  | 'fashion_beauty'
  | 'fitness_creators'
  | 'travel_creators'
  | 'food_creators'
  | 'educational_creators'
  | 'comedy_meme'
  | 'motivational_creators'
  | 'photography_art'
  | 'podcast_creators'
  | 'affiliate_marketers'
  | 'business_product'
  | 'personal_branding';

export type StudioModuleId =
  | 'universal'
  | 'reels'
  | 'post_carousel'
  | 'profile'
  | 'caption_optimizer'
  | 'hashtags'
  | 'content_ideas'
  | 'competitor'
  | 'seo_dashboard'
  | 'creator_profile'
  | 'saved_projects';

export interface CreatorProfile {
  creatorMode: CreatorModeId;
  creatorType: string;
  niche: string;
  topic: string;
  targetAudience: string;
  targetCountry: string;
  language: ContentLanguage;
  accountType: AccountType;
  contentGoals: string;
  brandVoice: string;
}

export interface SeoScoreBreakdown {
  overallScore: number;
  captionScore: number;
  keywordScore: number;
  hashtagRelevance: number;
  readability: number;
  ctaScore: number;
  recommendations: string[];
  strengths: string[];
}

export interface UniversalSeoResult {
  titles: string[];
  captions: Array<{
    style: string;
    text: string;
  }>;
  hashtags: string[];
  primaryKeywords: string[];
  secondaryKeywords: string[];
  longTailKeywords: string[];
  relatedSearchTerms: string[];
  altText: string;
  firstComment: string;
  ctaSuggestions: string[];
  coverTextIdeas: string[];
  scoreBreakdown: SeoScoreBreakdown;
}

export interface ReelsSeoResult {
  reelTitles: string[];
  hooks: string[];
  captions: Array<{
    angle: string;
    text: string;
  }>;
  hashtags: string[];
  spokenAudioKeywords: string[];
  onScreenText: string[];
  coverTitle: string;
  cta: string;
  contentDescription: string;
  scoreBreakdown: SeoScoreBreakdown;
}

export interface CarouselSlide {
  slideNumber: number;
  heading: string;
  body: string;
  visualDirection: string;
}

export interface PostCarouselSeoResult {
  carouselTitles: string[];
  slides: CarouselSlide[];
  seoCaptions: Array<{
    style: string;
    text: string;
  }>;
  hashtags: string[];
  altText: string;
  engagementQuestions: string[];
  scoreBreakdown: SeoScoreBreakdown;
}

export interface ProfileSeoResult {
  usernameIdeas: string[];
  displayName: string;
  seoBio: string;
  profileKeywords: string[];
  nichePositioning: string;
  cta: string;
  improvementTips: string[];
  scoreBreakdown: SeoScoreBreakdown;
}

export interface CaptionOptimizerResult {
  improvedCaption: string;
  improvedHashtags: string[];
  analysis: {
    seoQuality: string;
    keywordPlacement: string;
    readabilityFeedback: string;
    engagementPotential: string;
    ctaQuality: string;
    hashtagRelevanceFeedback: string;
  };
  scoreBreakdown: SeoScoreBreakdown;
}

export interface HashtagGroupResult {
  broad: string[];
  medium: string[];
  niche: string[];
  longTail: string[];
  strategyNote: string;
  scoreBreakdown: SeoScoreBreakdown;
}

export interface ContentIdeasResult {
  contentIdeas: string[];
  reelIdeas: string[];
  viralHooks: string[];
  carouselIdeas: string[];
  weeklyStrategy: Array<{
    day: string;
    format: string;
    topic: string;
    goal: string;
    hookIdea: string;
  }>;
}

export interface CompetitorAnalysisResult {
  contentThemes: string[];
  captionStructure: string;
  keywordStrategy: string[];
  hashtagPatterns: string;
  contentOpportunities: string[];
  differentiationActions: string[];
  disclaimer: string;
}

export type AnyGenerationResult =
  | { module: 'universal'; data: UniversalSeoResult }
  | { module: 'reels'; data: ReelsSeoResult }
  | { module: 'post_carousel'; data: PostCarouselSeoResult }
  | { module: 'profile'; data: ProfileSeoResult }
  | { module: 'caption_optimizer'; data: CaptionOptimizerResult }
  | { module: 'hashtags'; data: HashtagGroupResult }
  | { module: 'content_ideas'; data: ContentIdeasResult }
  | { module: 'competitor'; data: CompetitorAnalysisResult };

export interface SavedProject {
  id: string;
  title: string;
  module: StudioModuleId;
  createdAt: string;
  updatedAt: string;
  profile: CreatorProfile;
  payload: AnyGenerationResult;
}

export interface SearchHistoryItem {
  id: string;
  module: StudioModuleId;
  topic: string;
  niche: string;
  creatorType: string;
  language: ContentLanguage;
  timestamp: string;
  result: AnyGenerationResult;
}
