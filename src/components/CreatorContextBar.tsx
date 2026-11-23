import { SlidersHorizontal } from 'lucide-react';
import { CREATOR_MODES, getCreatorMode } from '../data/creatorModes';
import type { ContentLanguage, CreatorModeId, CreatorProfile } from '../types/seo';

const LANGUAGES: ContentLanguage[] = ['English', 'Urdu', 'Hindi', 'Roman Urdu'];

export function CreatorContextBar({
  profile,
  onChange,
  onOpenFullProfile,
}: {
  profile: CreatorProfile;
  onChange: (next: CreatorProfile) => void;
  onOpenFullProfile: () => void;
}) {
  const activeMode = getCreatorMode(profile.creatorMode);

  const handleModeChange = (modeId: CreatorModeId) => {
    const mode = getCreatorMode(modeId);
    onChange({
      ...profile,
      creatorMode: modeId,
      creatorType: mode.examples[0] ?? profile.creatorType,
    });
  };

  return (
    <section
      aria-label="Active Creator Context"
      className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 mb-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-3 items-end">
        <div className="xl:col-span-3">
          <label
            htmlFor="ctx-mode"
            className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1"
          >
            Creator SEO Mode
          </label>
          <select
            id="ctx-mode"
            value={profile.creatorMode}
            onChange={(e) => handleModeChange(e.target.value as CreatorModeId)}
            className="w-full h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {CREATOR_MODES.map((m) => (
              <option key={m.id} value={m.id}>
                {m.code}. {m.label}
              </option>
            ))}
          </select>
        </div>

        <div className="xl:col-span-3">
          <label
            htmlFor="ctx-niche"
            className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1"
          >
            Instagram Niche
          </label>
          <input
            id="ctx-niche"
            type="text"
            value={profile.niche}
            onChange={(e) => onChange({ ...profile, niche: e.target.value })}
            placeholder="e.g., Cozy Gaming, Streetwear, Home Cooking"
            className="w-full h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="xl:col-span-3">
          <label
            htmlFor="ctx-topic"
            className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1"
          >
            Content Topic
          </label>
          <input
            id="ctx-topic"
            type="text"
            value={profile.topic}
            onChange={(e) => onChange({ ...profile, topic: e.target.value })}
            placeholder="What is this post, reel, or profile about?"
            className="w-full h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="xl:col-span-2">
          <label
            htmlFor="ctx-language"
            className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1"
          >
            Language
          </label>
          <select
            id="ctx-language"
            value={profile.language}
            onChange={(e) => onChange({ ...profile, language: e.target.value as ContentLanguage })}
            className="w-full h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>

        <div className="xl:col-span-1 flex justify-end">
          <button
            type="button"
            onClick={onOpenFullProfile}
            className="w-full h-10 inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors whitespace-nowrap"
            title="Open Full Creator Profile Setup"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="xl:hidden">Full Profile Setup</span>
            <span className="hidden xl:inline">Setup</span>
          </button>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
        <span className="font-medium text-indigo-600 dark:text-indigo-400">
          Mode {activeMode.code}: {activeMode.label}
        </span>
        <span aria-hidden="true">·</span>
        <span>{profile.creatorType}</span>
        <span aria-hidden="true">·</span>
        <span>{profile.targetCountry}</span>
        <span aria-hidden="true">·</span>
        <span className="truncate max-w-xl">{activeMode.seoFocus}</span>
      </div>
    </section>
  );
}
