import {
  BarChart3,
  Bookmark,
  Clapperboard,
  FolderKanban,
  Hash,
  LayoutGrid,
  Lightbulb,
  Menu,
  Moon,
  PenLine,
  SearchCheck,
  SlidersHorizontal,
  Sun,
  UserCircle2,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { CaptionOptimizerView } from './components/CaptionOptimizerView';
import { CompetitorAnalysisView } from './components/CompetitorAnalysisView';
import { ContentIdeasView } from './components/ContentIdeasView';
import { CreatorContextBar } from './components/CreatorContextBar';
import { CreatorProfileView } from './components/CreatorProfileView';
import { HashtagGeneratorView } from './components/HashtagGeneratorView';
import { PostCarouselSeoView } from './components/PostCarouselSeoView';
import { ProfileSeoView } from './components/ProfileSeoView';
import { ReelsSeoView } from './components/ReelsSeoView';
import { SavedProjectsView } from './components/SavedProjectsView';
import { SeoScoreDashboardView } from './components/SeoScoreDashboardView';
import { UniversalSeoView } from './components/UniversalSeoView';
import { DEFAULT_PROFILE, getCreatorMode } from './data/creatorModes';
import type {
  AnyGenerationResult,
  CaptionOptimizerResult,
  CompetitorAnalysisResult,
  ContentIdeasResult,
  CreatorProfile,
  HashtagGroupResult,
  PostCarouselSeoResult,
  ProfileSeoResult,
  ReelsSeoResult,
  SavedProject,
  SearchHistoryItem,
  SeoScoreBreakdown,
  StudioModuleId,
  UniversalSeoResult,
} from './types/seo';
import { ApiClientError, postSeoApi } from './utils/apiClient';
import { downloadTextFile, formatResultAsMarkdown } from './utils/reportExport';

const STORAGE_KEYS = {
  theme: 'instarank_theme_v1',
  profile: 'instarank_profile_v1',
  projects: 'instarank_projects_v1',
  history: 'instarank_history_v1',
};

interface NavItem {
  id: StudioModuleId;
  label: string;
  group: 'generators' | 'workspace';
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'universal', label: 'Universal SEO', group: 'generators', icon: LayoutGrid },
  { id: 'reels', label: 'Reels SEO', group: 'generators', icon: Clapperboard },
  { id: 'post_carousel', label: 'Post & Carousel', group: 'generators', icon: FolderKanban },
  { id: 'profile', label: 'Profile SEO', group: 'generators', icon: UserCircle2 },
  { id: 'caption_optimizer', label: 'Caption Optimizer', group: 'generators', icon: PenLine },
  { id: 'hashtags', label: 'Hashtag Generator', group: 'generators', icon: Hash },
  { id: 'content_ideas', label: 'Content Ideas', group: 'generators', icon: Lightbulb },
  { id: 'competitor', label: 'Competitor Analysis', group: 'generators', icon: SearchCheck },
  { id: 'seo_dashboard', label: 'SEO Score Dashboard', group: 'workspace', icon: BarChart3 },
  { id: 'creator_profile', label: 'Creator Profile & Modes', group: 'workspace', icon: SlidersHorizontal },
  { id: 'saved_projects', label: 'Saved & History', group: 'workspace', icon: Bookmark },
];

function safeLoadJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.theme);
    return saved === 'light' ? 'light' : 'dark';
  });

  const [activeModule, setActiveModule] = useState<StudioModuleId>('universal');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const [profile, setProfile] = useState<CreatorProfile>(() =>
    safeLoadJson<CreatorProfile>(STORAGE_KEYS.profile, DEFAULT_PROFILE)
  );
  const [savedProjects, setSavedProjects] = useState<SavedProject[]>(() =>
    safeLoadJson<SavedProject[]>(STORAGE_KEYS.projects, [])
  );
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>(() =>
    safeLoadJson<SearchHistoryItem[]>(STORAGE_KEYS.history, [])
  );

  // Module-specific inputs
  const [reelLength, setReelLength] = useState('15-45 seconds (Tutorial / Story)');
  const [slideCount, setSlideCount] = useState(7);
  const [currentHandle, setCurrentHandle] = useState('');
  const [currentBio, setCurrentBio] = useState('');
  const [existingCaption, setExistingCaption] = useState('');
  const [existingHashtags, setExistingHashtags] = useState('');
  const [competitorUsername, setCompetitorUsername] = useState('');
  const [publicNotes, setPublicNotes] = useState('');

  // Module outputs
  const [universalResult, setUniversalResult] = useState<UniversalSeoResult | null>(null);
  const [reelsResult, setReelsResult] = useState<ReelsSeoResult | null>(null);
  const [carouselResult, setCarouselResult] = useState<PostCarouselSeoResult | null>(null);
  const [profileResult, setProfileResult] = useState<ProfileSeoResult | null>(null);
  const [captionResult, setCaptionResult] = useState<CaptionOptimizerResult | null>(null);
  const [hashtagsResult, setHashtagsResult] = useState<HashtagGroupResult | null>(null);
  const [ideasResult, setIdeasResult] = useState<ContentIdeasResult | null>(null);
  const [competitorResult, setCompetitorResult] = useState<CompetitorAnalysisResult | null>(null);

  // Loading & Error per module
  const [loadingModule, setLoadingModule] = useState<StudioModuleId | null>(null);
  const [errors, setErrors] = useState<Partial<Record<StudioModuleId, string | null>>>({});

  // Latest score tracking for SEO Score Dashboard
  const [latestScore, setLatestScore] = useState<{
    score: SeoScoreBreakdown;
    sourceLabel: string;
  } | null>(null);

  // Save Project Modal
  const [saveModalPayload, setSaveModalPayload] = useState<{
    module: StudioModuleId;
    payload: AnyGenerationResult;
  } | null>(null);
  const [projectTitleDraft, setProjectTitleDraft] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync theme to <html>
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem(STORAGE_KEYS.theme, theme);
  }, [theme]);

  // Persist profile, projects, history
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.projects, JSON.stringify(savedProjects));
  }, [savedProjects]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(searchHistory));
  }, [searchHistory]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2600);
  };

  const recordHistory = (module: StudioModuleId, result: AnyGenerationResult) => {
    const entry: SearchHistoryItem = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      module,
      topic: profile.topic || profile.niche,
      niche: profile.niche,
      creatorType: profile.creatorType,
      language: profile.language,
      timestamp: new Date().toISOString(),
      result,
    };
    setSearchHistory((prev) => [entry, ...prev].slice(0, 40));
  };

  const runGeneration = async (module: StudioModuleId) => {
    setLoadingModule(module);
    setErrors((prev) => ({ ...prev, [module]: null }));

    try {
      if (module === 'universal') {
        const res = await postSeoApi<{ module: 'universal'; data: UniversalSeoResult }>(
          '/api/seo/universal',
          { profile }
        );
        setUniversalResult(res.data);
        setLatestScore({ score: res.data.scoreBreakdown, sourceLabel: 'Universal SEO' });
        recordHistory('universal', res);
      } else if (module === 'reels') {
        const res = await postSeoApi<{ module: 'reels'; data: ReelsSeoResult }>(
          '/api/seo/reels',
          { profile, reelLength }
        );
        setReelsResult(res.data);
        setLatestScore({ score: res.data.scoreBreakdown, sourceLabel: 'Instagram Reels SEO' });
        recordHistory('reels', res);
      } else if (module === 'post_carousel') {
        const res = await postSeoApi<{ module: 'post_carousel'; data: PostCarouselSeoResult }>(
          '/api/seo/post-carousel',
          { profile, slideCount }
        );
        setCarouselResult(res.data);
        setLatestScore({ score: res.data.scoreBreakdown, sourceLabel: 'Post & Carousel SEO' });
        recordHistory('post_carousel', res);
      } else if (module === 'profile') {
        const res = await postSeoApi<{ module: 'profile'; data: ProfileSeoResult }>(
          '/api/seo/profile',
          { profile, currentHandle, currentBio }
        );
        setProfileResult(res.data);
        setLatestScore({ score: res.data.scoreBreakdown, sourceLabel: 'Profile SEO' });
        recordHistory('profile', res);
      } else if (module === 'caption_optimizer') {
        const res = await postSeoApi<{ module: 'caption_optimizer'; data: CaptionOptimizerResult }>(
          '/api/seo/caption-optimizer',
          { profile, existingCaption, existingHashtags }
        );
        setCaptionResult(res.data);
        setLatestScore({ score: res.data.scoreBreakdown, sourceLabel: 'Caption Optimizer' });
        recordHistory('caption_optimizer', res);
      } else if (module === 'hashtags') {
        const res = await postSeoApi<{ module: 'hashtags'; data: HashtagGroupResult }>(
          '/api/seo/hashtags',
          { profile }
        );
        setHashtagsResult(res.data);
        setLatestScore({ score: res.data.scoreBreakdown, sourceLabel: 'Hashtag Studio' });
        recordHistory('hashtags', res);
      } else if (module === 'content_ideas') {
        const res = await postSeoApi<{ module: 'content_ideas'; data: ContentIdeasResult }>(
          '/api/seo/content-ideas',
          { profile }
        );
        setIdeasResult(res.data);
        recordHistory('content_ideas', res);
      } else if (module === 'competitor') {
        const res = await postSeoApi<{ module: 'competitor'; data: CompetitorAnalysisResult }>(
          '/api/seo/competitor',
          { profile, competitorUsername, publicNotes }
        );
        setCompetitorResult(res.data);
        recordHistory('competitor', res);
      }
    } catch (err) {
      const msg =
        err instanceof ApiClientError
          ? err.message
          : err instanceof Error
          ? err.message
          : 'Failed to generate SEO results.';
      setErrors((prev) => ({ ...prev, [module]: msg }));
    } finally {
      setLoadingModule(null);
    }
  };

  const getCurrentPayload = (mod: StudioModuleId): AnyGenerationResult | null => {
    switch (mod) {
      case 'universal':
        return universalResult ? { module: 'universal', data: universalResult } : null;
      case 'reels':
        return reelsResult ? { module: 'reels', data: reelsResult } : null;
      case 'post_carousel':
        return carouselResult ? { module: 'post_carousel', data: carouselResult } : null;
      case 'profile':
        return profileResult ? { module: 'profile', data: profileResult } : null;
      case 'caption_optimizer':
        return captionResult ? { module: 'caption_optimizer', data: captionResult } : null;
      case 'hashtags':
        return hashtagsResult ? { module: 'hashtags', data: hashtagsResult } : null;
      case 'content_ideas':
        return ideasResult ? { module: 'content_ideas', data: ideasResult } : null;
      case 'competitor':
        return competitorResult ? { module: 'competitor', data: competitorResult } : null;
      default:
        return null;
    }
  };

  const openSaveProject = (mod: StudioModuleId) => {
    const payload = getCurrentPayload(mod);
    if (!payload) return;
    const activeLabel = NAV_ITEMS.find((n) => n.id === mod)?.label ?? 'SEO';
    setProjectTitleDraft(`${activeLabel} — ${profile.topic || profile.niche}`.slice(0, 80));
    setSaveModalPayload({ module: mod, payload });
  };

  const confirmSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!saveModalPayload) return;
    const title = projectTitleDraft.trim() || 'Untitled SEO Project';
    const newProj: SavedProject = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      title,
      module: saveModalPayload.module,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      profile: { ...profile },
      payload: saveModalPayload.payload,
    };
    setSavedProjects((prev) => [newProj, ...prev]);
    setSaveModalPayload(null);
    showToast(`Saved "${title}" to Projects`);
  };

  const handleDownloadReport = (mod: StudioModuleId) => {
    const payload = getCurrentPayload(mod);
    if (!payload) return;
    const label = NAV_ITEMS.find((n) => n.id === mod)?.label ?? 'SEO Report';
    const title = `${label} — ${profile.topic || profile.niche}`;
    const md = formatResultAsMarkdown(title, profile, payload);
    const slug = `${mod}-${(profile.niche || 'creator').toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
    downloadTextFile(`instarank-${slug}.md`, md);
    showToast('Downloaded SEO Report (.md)');
  };

  const applyPayloadToState = (payload: AnyGenerationResult) => {
    switch (payload.module) {
      case 'universal':
        setUniversalResult(payload.data);
        setLatestScore({ score: payload.data.scoreBreakdown, sourceLabel: 'Universal SEO' });
        setActiveModule('universal');
        break;
      case 'reels':
        setReelsResult(payload.data);
        setLatestScore({ score: payload.data.scoreBreakdown, sourceLabel: 'Instagram Reels SEO' });
        setActiveModule('reels');
        break;
      case 'post_carousel':
        setCarouselResult(payload.data);
        setLatestScore({ score: payload.data.scoreBreakdown, sourceLabel: 'Post & Carousel SEO' });
        setActiveModule('post_carousel');
        break;
      case 'profile':
        setProfileResult(payload.data);
        setLatestScore({ score: payload.data.scoreBreakdown, sourceLabel: 'Profile SEO' });
        setActiveModule('profile');
        break;
      case 'caption_optimizer':
        setCaptionResult(payload.data);
        setLatestScore({ score: payload.data.scoreBreakdown, sourceLabel: 'Caption Optimizer' });
        setActiveModule('caption_optimizer');
        break;
      case 'hashtags':
        setHashtagsResult(payload.data);
        setLatestScore({ score: payload.data.scoreBreakdown, sourceLabel: 'Hashtag Studio' });
        setActiveModule('hashtags');
        break;
      case 'content_ideas':
        setIdeasResult(payload.data);
        setActiveModule('content_ideas');
        break;
      case 'competitor':
        setCompetitorResult(payload.data);
        setActiveModule('competitor');
        break;
    }
  };

  const activeNav = NAV_ITEMS.find((n) => n.id === activeModule) ?? NAV_ITEMS[0];
  const activeMode = getCreatorMode(profile.creatorMode);
  const showContextBar =
    activeModule !== 'creator_profile' &&
    activeModule !== 'saved_projects' &&
    activeModule !== 'seo_dashboard';

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand Header */}
      <div className="h-16 px-5 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 shrink-0">
        <button
          type="button"
          onClick={() => {
            setActiveModule('universal');
            setMobileNavOpen(false);
          }}
          className="flex items-center gap-2.5 text-left focus-visible:outline-none"
        >
          <span
            aria-hidden="true"
            className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 via-violet-600 to-blue-600 flex items-center justify-center text-white font-display font-bold text-sm shadow-sm shrink-0"
          >
            IR
          </span>
          <span className="font-display font-bold text-base tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
            INSTarank AI
          </span>
        </button>

        <button
          type="button"
          onClick={() => setMobileNavOpen(false)}
          className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Close navigation menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Links */}
      <nav aria-label="Studio modules" className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        <div>
          <div className="px-3 mb-2 text-xs font-semibold text-slate-400 dark:text-slate-500">
            SEO Generators
          </div>
          <ul className="space-y-1">
            {NAV_ITEMS.filter((i) => i.group === 'generators').map((item) => {
              const Icon = item.icon;
              const isActive = activeModule === item.id;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveModule(item.id);
                      setMobileNavOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                      isActive
                        ? 'bg-gradient-to-r from-indigo-600/12 via-violet-600/10 to-blue-600/10 text-indigo-700 dark:text-indigo-300'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div>
          <div className="px-3 mb-2 text-xs font-semibold text-slate-400 dark:text-slate-500">
            Studio Workspace
          </div>
          <ul className="space-y-1">
            {NAV_ITEMS.filter((i) => i.group === 'workspace').map((item) => {
              const Icon = item.icon;
              const isActive = activeModule === item.id;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveModule(item.id);
                      setMobileNavOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                      isActive
                        ? 'bg-gradient-to-r from-indigo-600/12 via-violet-600/10 to-blue-600/10 text-indigo-700 dark:text-indigo-300'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* Active Mode Footer Card */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 shrink-0">
        <button
          type="button"
          onClick={() => {
            setActiveModule('creator_profile');
            setMobileNavOpen(false);
          }}
          className="w-full text-left rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 hover:border-indigo-400 dark:hover:border-indigo-700 transition-colors"
        >
          <div className="text-xs font-semibold text-slate-900 dark:text-white truncate">
            {activeMode.code}. {activeMode.label}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
            {profile.language} · {profile.creatorType}
          </div>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-[#090D16] text-slate-900 dark:text-slate-100">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-[264px] shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0D1320] sticky top-0 h-screen">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
            onClick={() => setMobileNavOpen(false)}
          />
          <aside className="relative w-72 max-w-[85vw] bg-white dark:bg-[#0D1320] border-r border-slate-200 dark:border-slate-800 h-full z-10">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content Shell */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top Bar */}
        <header className="h-16 px-4 sm:px-6 lg:px-8 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-[#0D1320]/90 backdrop-blur-sm sticky top-0 z-30 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileNavOpen(true)}
              className="lg:hidden p-2 -ml-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-sm min-w-0">
              <span className="text-slate-400 dark:text-slate-500 hidden sm:inline whitespace-nowrap">
                All Creator SEO Studio
              </span>
              <span className="text-slate-300 dark:text-slate-700 hidden sm:inline" aria-hidden="true">
                /
              </span>
              <h1 className="font-display font-semibold text-slate-900 dark:text-white truncate">
                {activeNav.label}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
              className="h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors"
              aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-indigo-600" />
                  <span className="hidden sm:inline">Dark</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveModule('creator_profile')}
              className="h-9 px-3.5 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 whitespace-nowrap shrink-0 transition-all"
            >
              Creator Profile
            </button>
          </div>
        </header>

        {/* Main Viewport */}
        <main className="flex-1 w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {showContextBar && (
            <CreatorContextBar
              profile={profile}
              onChange={setProfile}
              onOpenFullProfile={() => setActiveModule('creator_profile')}
            />
          )}

          {activeModule === 'universal' && (
            <UniversalSeoView
              result={universalResult}
              isLoading={loadingModule === 'universal'}
              error={errors.universal ?? null}
              onGenerate={() => runGeneration('universal')}
              onUpdate={setUniversalResult}
              onSaveProject={() => openSaveProject('universal')}
              onDownloadReport={() => handleDownloadReport('universal')}
              onOpenScoreDashboard={() => setActiveModule('seo_dashboard')}
            />
          )}

          {activeModule === 'reels' && (
            <ReelsSeoView
              reelLength={reelLength}
              onReelLengthChange={setReelLength}
              result={reelsResult}
              isLoading={loadingModule === 'reels'}
              error={errors.reels ?? null}
              onGenerate={() => runGeneration('reels')}
              onUpdate={setReelsResult}
              onSaveProject={() => openSaveProject('reels')}
              onDownloadReport={() => handleDownloadReport('reels')}
              onOpenScoreDashboard={() => setActiveModule('seo_dashboard')}
            />
          )}

          {activeModule === 'post_carousel' && (
            <PostCarouselSeoView
              slideCount={slideCount}
              onSlideCountChange={setSlideCount}
              result={carouselResult}
              isLoading={loadingModule === 'post_carousel'}
              error={errors.post_carousel ?? null}
              onGenerate={() => runGeneration('post_carousel')}
              onUpdate={setCarouselResult}
              onSaveProject={() => openSaveProject('post_carousel')}
              onDownloadReport={() => handleDownloadReport('post_carousel')}
              onOpenScoreDashboard={() => setActiveModule('seo_dashboard')}
            />
          )}

          {activeModule === 'profile' && (
            <ProfileSeoView
              currentHandle={currentHandle}
              currentBio={currentBio}
              onCurrentHandleChange={setCurrentHandle}
              onCurrentBioChange={setCurrentBio}
              result={profileResult}
              isLoading={loadingModule === 'profile'}
              error={errors.profile ?? null}
              onGenerate={() => runGeneration('profile')}
              onUpdate={setProfileResult}
              onSaveProject={() => openSaveProject('profile')}
              onDownloadReport={() => handleDownloadReport('profile')}
              onOpenScoreDashboard={() => setActiveModule('seo_dashboard')}
            />
          )}

          {activeModule === 'caption_optimizer' && (
            <CaptionOptimizerView
              existingCaption={existingCaption}
              existingHashtags={existingHashtags}
              onExistingCaptionChange={setExistingCaption}
              onExistingHashtagsChange={setExistingHashtags}
              result={captionResult}
              isLoading={loadingModule === 'caption_optimizer'}
              error={errors.caption_optimizer ?? null}
              onGenerate={() => runGeneration('caption_optimizer')}
              onUpdate={setCaptionResult}
              onSaveProject={() => openSaveProject('caption_optimizer')}
              onDownloadReport={() => handleDownloadReport('caption_optimizer')}
              onOpenScoreDashboard={() => setActiveModule('seo_dashboard')}
            />
          )}

          {activeModule === 'hashtags' && (
            <HashtagGeneratorView
              result={hashtagsResult}
              isLoading={loadingModule === 'hashtags'}
              error={errors.hashtags ?? null}
              onGenerate={() => runGeneration('hashtags')}
              onSaveProject={() => openSaveProject('hashtags')}
              onDownloadReport={() => handleDownloadReport('hashtags')}
              onOpenScoreDashboard={() => setActiveModule('seo_dashboard')}
            />
          )}

          {activeModule === 'content_ideas' && (
            <ContentIdeasView
              result={ideasResult}
              isLoading={loadingModule === 'content_ideas'}
              error={errors.content_ideas ?? null}
              onGenerate={() => runGeneration('content_ideas')}
              onSaveProject={() => openSaveProject('content_ideas')}
              onDownloadReport={() => handleDownloadReport('content_ideas')}
            />
          )}

          {activeModule === 'competitor' && (
            <CompetitorAnalysisView
              competitorUsername={competitorUsername}
              publicNotes={publicNotes}
              onCompetitorUsernameChange={setCompetitorUsername}
              onPublicNotesChange={setPublicNotes}
              result={competitorResult}
              isLoading={loadingModule === 'competitor'}
              error={errors.competitor ?? null}
              onGenerate={() => runGeneration('competitor')}
              onSaveProject={() => openSaveProject('competitor')}
              onDownloadReport={() => handleDownloadReport('competitor')}
            />
          )}

          {activeModule === 'seo_dashboard' && (
            <SeoScoreDashboardView
              latestScore={latestScore?.score ?? null}
              latestSourceLabel={latestScore?.sourceLabel ?? null}
              onRunUniversalAudit={() => {
                setActiveModule('universal');
                runGeneration('universal');
              }}
              onNavigateModule={setActiveModule}
            />
          )}

          {activeModule === 'creator_profile' && (
            <CreatorProfileView
              profile={profile}
              onChange={setProfile}
              onProceedToGenerator={() => setActiveModule('universal')}
            />
          )}

          {activeModule === 'saved_projects' && (
            <SavedProjectsView
              projects={savedProjects}
              history={searchHistory}
              onLoadProject={(proj) => {
                setProfile(proj.profile);
                applyPayloadToState(proj.payload);
                showToast(`Loaded "${proj.title}"`);
              }}
              onDeleteProject={(id) => {
                setSavedProjects((prev) => prev.filter((p) => p.id !== id));
                showToast('Project deleted');
              }}
              onLoadHistoryItem={(item) => {
                applyPayloadToState(item.result);
                showToast('Restored from history');
              }}
              onClearHistory={() => {
                setSearchHistory([]);
                showToast('History cleared');
              }}
            />
          )}
        </main>
      </div>

      {/* Save Project Modal */}
      {saveModalPayload && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="save-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs"
        >
          <form
            onSubmit={confirmSaveProject}
            className="w-full max-w-md rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xl space-y-4"
          >
            <h3 id="save-modal-title" className="text-lg font-semibold text-slate-900 dark:text-white">
              Save SEO Project
            </h3>
            <div>
              <label
                htmlFor="project-title-input"
                className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5"
              >
                Project Name
              </label>
              <input
                id="project-title-input"
                type="text"
                autoFocus
                value={projectTitleDraft}
                onChange={(e) => setProjectTitleDraft(e.target.value)}
                className="w-full h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setSaveModalPayload(null)}
                className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500"
              >
                Save Project
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Subtle Feedback Toast */}
      {toastMessage && (
        <div
          role="status"
          className="fixed bottom-5 right-5 z-50 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-xs font-medium text-slate-800 dark:text-slate-100 shadow-lg"
        >
          {toastMessage}
        </div>
      )}
    </div>
  );
}
