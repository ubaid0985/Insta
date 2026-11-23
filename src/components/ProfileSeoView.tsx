import type { ProfileSeoResult } from '../types/seo';
import {
  CopyButton,
  EditableTextBlock,
  EmptyModuleState,
  ErrorBanner,
  InlineScoreSummary,
  ModuleToolbar,
  SkeletonOutput,
} from './ActionControls';

export function ProfileSeoView({
  currentHandle,
  currentBio,
  onCurrentHandleChange,
  onCurrentBioChange,
  result,
  isLoading,
  error,
  onGenerate,
  onUpdate,
  onSaveProject,
  onDownloadReport,
  onOpenScoreDashboard,
}: {
  currentHandle: string;
  currentBio: string;
  onCurrentHandleChange: (val: string) => void;
  onCurrentBioChange: (val: string) => void;
  result: ProfileSeoResult | null;
  isLoading: boolean;
  error: string | null;
  onGenerate: () => void;
  onUpdate: (next: ProfileSeoResult) => void;
  onSaveProject: () => void;
  onDownloadReport: () => void;
  onOpenScoreDashboard: () => void;
}) {
  return (
    <div className="space-y-6">
      <ModuleToolbar
        title="Instagram Profile SEO"
        description="Optimize your username, searchable Name field, 150-character bio, niche positioning, and profile keywords so ideal followers find your account in Search."
        isLoading={isLoading}
        hasResult={Boolean(result)}
        onGenerate={onGenerate}
        onSaveProject={onSaveProject}
        onDownloadReport={onDownloadReport}
        generateLabel="Optimize Profile SEO"
      />

      {/* Optional Current Profile Inputs */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="current-ig-handle"
            className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1"
          >
            Current Instagram Handle (Optional)
          </label>
          <input
            id="current-ig-handle"
            type="text"
            value={currentHandle}
            onChange={(e) => onCurrentHandleChange(e.target.value)}
            placeholder="e.g., @alex.creates"
            className="w-full h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label
            htmlFor="current-ig-bio"
            className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1"
          >
            Current Bio Draft (Optional — paste to upgrade)
          </label>
          <input
            id="current-ig-bio"
            type="text"
            value={currentBio}
            onChange={(e) => onCurrentBioChange(e.target.value)}
            placeholder="Paste your existing bio to refine keywords & clarity"
            className="w-full h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {error && <ErrorBanner message={error} onRetry={onGenerate} />}
      {isLoading && <SkeletonOutput />}

      {!isLoading && !result && !error && (
        <EmptyModuleState
          title="Turn your Instagram bio into a search magnet"
          description="Generate searchable display name options, a tight 150-character SEO bio, handle ideas, niche positioning, and profile upgrade steps."
          actionLabel="Optimize Profile SEO"
          onAction={onGenerate}
        />
      )}

      {!isLoading && result && (
        <div className="space-y-6">
          <InlineScoreSummary
            score={result.scoreBreakdown}
            onOpenDashboard={onOpenScoreDashboard}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <EditableTextBlock
              title="Searchable Display Name (Name Field)"
              subtitle="Instagram heavily indexes the Name field in search results"
              value={result.displayName}
              onSave={(val) => onUpdate({ ...result, displayName: val })}
              multiline={false}
              charLimit={30}
            />
            <EditableTextBlock
              title="Profile Bio CTA"
              subtitle="Direct visitors toward your primary link, DM keyword, or follow action"
              value={result.cta}
              onSave={(val) => onUpdate({ ...result, cta: val })}
              multiline={false}
            />
          </div>

          <EditableTextBlock
            title="SEO-Optimized Bio"
            subtitle="Keep within Instagram's 150-character bio limit"
            value={result.seoBio}
            onSave={(val) => onUpdate({ ...result, seoBio: val })}
            multiline
            charLimit={150}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
              <div className="flex items-center justify-between gap-2 mb-3">
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                  Username Ideas
                </h3>
                <CopyButton text={result.usernameIdeas.join('\n')} compact />
              </div>
              <ul className="space-y-2">
                {result.usernameIdeas.map((u, i) => (
                  <li key={i} className="flex items-center justify-between gap-2 text-sm font-mono text-slate-800 dark:text-slate-200">
                    <span>{u}</span>
                    <CopyButton text={u} compact />
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
              <div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                  Niche Positioning
                </h3>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-1.5 leading-relaxed">
                  {result.nichePositioning}
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                    Profile Search Keywords
                  </h4>
                  <CopyButton text={result.profileKeywords.join(', ')} compact />
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  {result.profileKeywords.join(' · ')}
                </p>
              </div>
            </section>
          </div>

          <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-3">
              Profile Improvement Tips
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-700 dark:text-slate-300">
              {result.improvementTips.map((tip, i) => (
                <li key={i} className="flex items-baseline gap-3">
                  <span className="text-xs font-mono tabular-nums text-indigo-600 dark:text-indigo-400 shrink-0">
                    0{i + 1}
                  </span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </div>
  );
}
