import type { ContentIdeasResult } from '../types/seo';
import {
  CopyButton,
  EmptyModuleState,
  ErrorBanner,
  ModuleToolbar,
  SkeletonOutput,
} from './ActionControls';

export function ContentIdeasView({
  result,
  isLoading,
  error,
  onGenerate,
  onSaveProject,
  onDownloadReport,
}: {
  result: ContentIdeasResult | null;
  isLoading: boolean;
  error: string | null;
  onGenerate: () => void;
  onSaveProject: () => void;
  onDownloadReport: () => void;
}) {
  return (
    <div className="space-y-6">
      <ModuleToolbar
        title="Creator Content Ideas & Strategy"
        description="Unlock 30 content ideas, 10 Reel concepts, 10 viral-style hooks, 10 carousel blueprints, and a complete 7-day posting roadmap."
        isLoading={isLoading}
        hasResult={Boolean(result)}
        onGenerate={onGenerate}
        onSaveProject={onSaveProject}
        onDownloadReport={onDownloadReport}
        generateLabel="Generate Content Bank"
      />

      {error && <ErrorBanner message={error} onRetry={onGenerate} />}
      {isLoading && <SkeletonOutput />}

      {!isLoading && !result && !error && (
        <EmptyModuleState
          title="Never run out of creator content ideas"
          description="Generate 60+ format-specific ideas and a balanced 7-day strategy tailored to your niche, goals, and language."
          actionLabel="Generate Content Bank"
          onAction={onGenerate}
        />
      )}

      {!isLoading && result && (
        <div className="space-y-6">
          {/* Weekly Content Strategy Table */}
          <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                  7-Day Weekly Content Strategy
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Balanced cadence across discovery Reels, saveable Carousels, and community formats
                </p>
              </div>
              <CopyButton
                text={result.weeklyStrategy
                  .map((w) => `${w.day} (${w.format}): ${w.topic} | Hook: ${w.hookIdea}`)
                  .join('\n')}
                label="Copy Schedule"
                compact
              />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 text-xs font-semibold text-slate-600 dark:text-slate-400">
                    <th className="py-2.5 px-4">Day</th>
                    <th className="py-2.5 px-4">Format</th>
                    <th className="py-2.5 px-4">Topic</th>
                    <th className="py-2.5 px-4">Opening Hook</th>
                    <th className="py-2.5 px-4">Goal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {result.weeklyStrategy.map((row, i) => (
                    <tr
                      key={i}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3 px-4 font-medium text-slate-900 dark:text-white whitespace-nowrap">
                        {row.day}
                      </td>
                      <td className="py-3 px-4 text-xs font-medium text-indigo-600 dark:text-indigo-400 whitespace-nowrap">
                        {row.format}
                      </td>
                      <td className="py-3 px-4 text-slate-700 dark:text-slate-200">
                        {row.topic}
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                        {row.hookIdea}
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                        {row.goal}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* 10 Reel Ideas & 10 Carousel Ideas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
              <div className="flex items-center justify-between gap-2 mb-3">
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                  10 Reel Ideas
                </h3>
                <CopyButton text={result.reelIdeas.join('\n')} compact />
              </div>
              <ol className="space-y-2.5">
                {result.reelIdeas.map((idea, i) => (
                  <li key={i} className="flex items-baseline gap-3 text-sm text-slate-700 dark:text-slate-300">
                    <span className="text-xs font-mono tabular-nums text-slate-400 shrink-0">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span>{idea}</span>
                  </li>
                ))}
              </ol>
            </section>

            <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
              <div className="flex items-center justify-between gap-2 mb-3">
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                  10 Carousel Ideas
                </h3>
                <CopyButton text={result.carouselIdeas.join('\n')} compact />
              </div>
              <ol className="space-y-2.5">
                {result.carouselIdeas.map((idea, i) => (
                  <li key={i} className="flex items-baseline gap-3 text-sm text-slate-700 dark:text-slate-300">
                    <span className="text-xs font-mono tabular-nums text-slate-400 shrink-0">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span>{idea}</span>
                  </li>
                ))}
              </ol>
            </section>
          </div>

          {/* 10 Viral-Style Hooks */}
          <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
            <div className="flex items-center justify-between gap-2 mb-3">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                10 Viral-Style Hooks
              </h3>
              <CopyButton text={result.viralHooks.join('\n')} compact />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {result.viralHooks.map((hook, i) => (
                <div
                  key={i}
                  className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 flex items-center justify-between gap-3"
                >
                  <span className="text-sm text-slate-800 dark:text-slate-200">{hook}</span>
                  <CopyButton text={hook} compact />
                </div>
              ))}
            </div>
          </section>

          {/* 30 Content Ideas */}
          <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
            <div className="flex items-center justify-between gap-2 mb-3">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                30 Creator Content Ideas
              </h3>
              <CopyButton text={result.contentIdeas.join('\n')} label="Copy All 30" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2.5">
              {result.contentIdeas.map((idea, i) => (
                <div key={i} className="flex items-baseline gap-3 text-sm text-slate-700 dark:text-slate-300 py-1 border-b border-slate-100 dark:border-slate-800/70">
                  <span className="text-xs font-mono tabular-nums text-indigo-600 dark:text-indigo-400 shrink-0">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span>{idea}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
