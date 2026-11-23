import { Check } from 'lucide-react';
import { useState } from 'react';
import { ALL_CREATOR_TYPES, CREATOR_MODES, getCreatorMode } from '../data/creatorModes';
import type {
  AccountType,
  ContentLanguage,
  CreatorModeId,
  CreatorProfile,
} from '../types/seo';

const ACCOUNT_TYPES: AccountType[] = [
  'Creator',
  'Personal',
  'Business',
  'Public Figure',
  'Media / Publisher',
];

const LANGUAGES: ContentLanguage[] = ['English', 'Urdu', 'Hindi', 'Roman Urdu'];

const COUNTRIES = [
  'Global',
  'United States',
  'United Kingdom',
  'Pakistan',
  'India',
  'United Arab Emirates',
  'Canada',
  'Australia',
  'Germany',
  'Saudi Arabia',
];

export function CreatorProfileView({
  profile,
  onChange,
  onProceedToGenerator,
}: {
  profile: CreatorProfile;
  onChange: (next: CreatorProfile) => void;
  onProceedToGenerator: () => void;
}) {
  const [customCreatorType, setCustomCreatorType] = useState(
    ALL_CREATOR_TYPES.includes(profile.creatorType) ? '' : profile.creatorType
  );
  const [savedNotice, setSavedNotice] = useState(false);

  const activeMode = getCreatorMode(profile.creatorMode);

  const selectMode = (modeId: CreatorModeId, loadPreset: boolean) => {
    const m = getCreatorMode(modeId);
    if (loadPreset) {
      onChange({
        ...profile,
        creatorMode: modeId,
        creatorType: m.examples[0] ?? profile.creatorType,
        niche: m.defaultNiche,
        topic: m.defaultTopic,
        targetAudience: m.defaultAudience,
        contentGoals: m.defaultGoals,
        brandVoice: m.defaultVoice,
      });
    } else {
      onChange({
        ...profile,
        creatorMode: modeId,
      });
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Creator Profile Setup & SEO Modes
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Configure your creator category, niche, audience, and language. Every SEO tool adapts automatically to this profile.
          </p>
        </div>
        <button
          type="button"
          onClick={onProceedToGenerator}
          className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 via-violet-600 to-blue-600 hover:from-indigo-500 hover:via-violet-500 hover:to-blue-500 shadow-sm whitespace-nowrap shrink-0"
        >
          Open Universal SEO Studio
        </button>
      </div>

      {/* Specialized Creator Modes A–Q */}
      <section aria-labelledby="modes-heading">
        <div className="flex flex-wrap items-baseline justify-between gap-2 mb-4">
          <div>
            <h3 id="modes-heading" className="text-base font-semibold text-slate-900 dark:text-white">
              Specialized Creator SEO Modes (A–Q)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Select a specialized mode to tailor keyword strategy, hooks, and format structure. Click “Load Preset” on the active card to test sample niche data.
            </p>
          </div>
          <button
            type="button"
            onClick={() => selectMode(profile.creatorMode, true)}
            className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline whitespace-nowrap"
          >
            Load {activeMode.shortLabel} Sample Preset
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {CREATOR_MODES.map((mode) => {
            const isActive = profile.creatorMode === mode.id;
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => selectMode(mode.id, false)}
                className={`text-left rounded-xl border p-3.5 transition-all ${
                  isActive
                    ? 'border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/30 dark:border-indigo-500 ring-1 ring-indigo-500/40'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                    {mode.code}. {mode.label}
                  </span>
                  {isActive && <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                  {mode.seoFocus}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Detailed Creator Profile Form */}
      <form
        onSubmit={handleSave}
        className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 space-y-5"
      >
        <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            Creator Identity & Target Parameters
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Supports all creator roles, custom niches, and 4 languages (English, Urdu, Hindi, Roman Urdu).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label
              htmlFor="profile-creator-type"
              className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
            >
              Creator Type
            </label>
            <select
              id="profile-creator-type"
              value={ALL_CREATOR_TYPES.includes(profile.creatorType) ? profile.creatorType : '__custom__'}
              onChange={(e) => {
                if (e.target.value === '__custom__') {
                  onChange({ ...profile, creatorType: customCreatorType || 'Custom Creator' });
                } else {
                  setCustomCreatorType('');
                  onChange({ ...profile, creatorType: e.target.value });
                }
              }}
              className="w-full h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {ALL_CREATOR_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
              <option value="__custom__">Custom Creator Role...</option>
            </select>
            {(!ALL_CREATOR_TYPES.includes(profile.creatorType) || customCreatorType !== '') && (
              <input
                type="text"
                value={profile.creatorType}
                onChange={(e) => {
                  setCustomCreatorType(e.target.value);
                  onChange({ ...profile, creatorType: e.target.value });
                }}
                placeholder="Enter custom creator type (e.g., BookTok Creator, Chess Coach)"
                className="mt-2 w-full h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            )}
          </div>

          <div>
            <label
              htmlFor="profile-niche"
              className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
            >
              Instagram Niche
            </label>
            <input
              id="profile-niche"
              type="text"
              value={profile.niche}
              onChange={(e) => onChange({ ...profile, niche: e.target.value })}
              placeholder="e.g., Indie Guitar Songwriting, Budget Travel, Meal Prep"
              className="w-full h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="profile-topic"
              className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
            >
              Content Topic
            </label>
            <input
              id="profile-topic"
              type="text"
              value={profile.topic}
              onChange={(e) => onChange({ ...profile, topic: e.target.value })}
              placeholder="Describe the post, Reel, carousel, or theme you want to optimize"
              className="w-full h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label
              htmlFor="profile-audience"
              className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
            >
              Target Audience
            </label>
            <input
              id="profile-audience"
              type="text"
              value={profile.targetAudience}
              onChange={(e) => onChange({ ...profile, targetAudience: e.target.value })}
              placeholder="e.g., Beginner photographers, busy parents, indie gamers"
              className="w-full h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label
              htmlFor="profile-country"
              className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
            >
              Target Country
            </label>
            <input
              id="profile-country"
              list="country-suggestions"
              value={profile.targetCountry}
              onChange={(e) => onChange({ ...profile, targetCountry: e.target.value })}
              placeholder="Global or specific country"
              className="w-full h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <datalist id="country-suggestions">
              {COUNTRIES.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </div>

          <div>
            <label
              htmlFor="profile-language"
              className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
            >
              Content Language
            </label>
            <select
              id="profile-language"
              value={profile.language}
              onChange={(e) => onChange({ ...profile, language: e.target.value as ContentLanguage })}
              className="w-full h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {LANGUAGES.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="profile-account-type"
              className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
            >
              Instagram Account Type
            </label>
            <select
              id="profile-account-type"
              value={profile.accountType}
              onChange={(e) => onChange({ ...profile, accountType: e.target.value as AccountType })}
              className="w-full h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {ACCOUNT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="profile-goals"
              className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
            >
              Content Goals
            </label>
            <input
              id="profile-goals"
              type="text"
              value={profile.contentGoals}
              onChange={(e) => onChange({ ...profile, contentGoals: e.target.value })}
              placeholder="e.g., Saves & Shares, Discovery Reach, Brand Deals, Community"
              className="w-full h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label
              htmlFor="profile-voice"
              className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
            >
              Brand Voice
            </label>
            <input
              id="profile-voice"
              type="text"
              value={profile.brandVoice}
              onChange={(e) => onChange({ ...profile, brandVoice: e.target.value })}
              placeholder="e.g., Witty & relatable, Calm & aesthetic, Structured educator"
              className="w-full h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Changes sync automatically across all studio generators and are saved locally.
          </span>
          <div className="flex items-center gap-3">
            {savedNotice && (
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                Profile updated
              </span>
            )}
            <button
              type="submit"
              className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 whitespace-nowrap"
            >
              Save Profile
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
