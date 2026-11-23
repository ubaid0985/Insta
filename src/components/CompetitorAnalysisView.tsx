import type { CompetitorAnalysisResult } from '../types/seo';
import {
  CopyButton,
  ErrorBanner,
  ModuleToolbar,
  SkeletonOutput,
} from './ActionControls';

export function CompetitorAnalysisView({
  competitorUsername,
  publicNotes,
  onCompetitorUsernameChange,
  onPublicNotesChange,
  result,
  isLoading,
  error,
  onGenerate,
  onSaveProject,
  onDownloadReport,
}: {
  competitorUsername: string;
  publicNotes: string;
  onCompetitorUsernameChange: (val: string) => void;
  onPublicNotesChange: (val: string) => void;
  result: CompetitorAnalysisResult | null;
  isLoading: boolean;
  error: string | null;
  onGenerate: () => void;
  onSaveProject: () => void;
  onDownloadReport: () => void;
}) {
  return (
    <div className="space-y-6">
      <ModuleToolbar
        title="Competitor Content Analysis"
        description="Analyze publicly shared competitor bios, captions, themes, and hashtag patterns to uncover content gaps and differentiation opportunities."
        isLoading={isLoading}
        hasResult={Boolean(result)}
        onGenerate={onGenerate}
        onSaveProject={onSaveProject}
        onDownloadReport={onDownloadReport}
        generateLabel="Analyze Competitor Strategy"
      />

      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Privacy & accuracy notice: This tool never accesses private Instagram account data. Paste publicly visible bio text, sample captions, or post themes below for structured strategic analysis.
        </p>

        <div>
          <label
            htmlFor="competitor-username"
            className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
          >
            Public Instagram Username (Reference)
          </label>
          <input
            id="competitor-username"
            type="text"
            value={competitorUsername}
            onChange={(e) => onCompetitorUsernameChange(e.target.value)}
            placeholder="e.g., @publiccreatorhandle"
            className="w-full h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label
            htmlFor="competitor-public-notes"
            className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
          >
            Public Bio, Sample Captions, Hashtags, or Observed Content Themes
          </label>
          <textarea
            id="competitor-public-notes"
            rows={5}
            value={publicNotes}
            onChange={(e) => onPublicNotesChange(e.target.value)}
            placeholder="Paste 1-3 public captions, their public bio, hashtags they use, or notes on what topics they post most..."
            className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-3 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {error && <ErrorBanner message={error} onRetry={onGenerate} />}
      {isLoading && <SkeletonOutput />}

      {!isLoading && result && (
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-4 text-xs text-slate-600 dark:text-slate-400">
            {result.disclaimer}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
              <div className="flex items-center justify-between gap-2 mb-3">
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                  Observed Content Themes
                </h3>
                <CopyButton text={result.contentThemes.join('\n')} compact />
              </div>
              <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                {result.contentThemes.map((t, i) => (
                  <li key={i} className="flex items-baseline gap-2.5">
                    <span className="text-xs font-mono tabular-nums text-indigo-600 dark:text-indigo-400">
                      0{i + 1}
                    </span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
              <div className="flex items-center justify-between gap-2 mb-3">
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                  Keyword Strategy
                </h3>
                <CopyButton text={result.keywordStrategy.join(', ')} compact />
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {result.keywordStrategy.join(' · ')}
              </p>
            </section>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-2">
                Caption Structure Breakdown
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                {result.captionStructure}
              </p>
            </section>

            <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-2">
                Hashtag Patterns
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                {result.hashtagPatterns}
              </p>
            </section>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
              <div className="flex items-center justify-between gap-2 mb-3">
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                  Content Opportunities & Gaps
                </h3>
                <CopyButton text={result.contentOpportunities.join('\n')} compact />
              </div>
              <ul className="space-y-2.5 text-sm text-slate-700 dark:text-slate-300">
                {result.contentOpportunities.map((op, i) => (
                  <li key={i} className="flex items-baseline gap-2.5">
                    <span className="text-xs font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
                      +{i + 1}
                    </span>
                    <span>{op}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
              <div className="flex items-center justify-between gap-2 mb-3">
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                  Differentiation Actions
                </h3>
                <CopyButton text={result.differentiationActions.join('\n')} compact />
              </div>
              <ul className="space-y-2.5 text-sm text-slate-700 dark:text-slate-300">
                {result.differentiationActions.map((act, i) => (
                  <li key={i} className="flex items-baseline gap-2.5">
                    <span className="text-xs font-mono tabular-nums text-indigo-600 dark:text-indigo-400">
                      0{i + 1}
                    </span>
                    <span>{act}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}
