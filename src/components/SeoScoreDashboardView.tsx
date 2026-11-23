import type { SeoScoreBreakdown, StudioModuleId } from '../types/seo';
import { EmptyModuleState, ScoreBarRow } from './ActionControls';

export function SeoScoreDashboardView({
  latestScore,
  latestSourceLabel,
  onRunUniversalAudit,
  onNavigateModule,
}: {
  latestScore: SeoScoreBreakdown | null;
  latestSourceLabel: string | null;
  onRunUniversalAudit: () => void;
  onNavigateModule: (mod: StudioModuleId) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            SEO Score Dashboard
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Review estimated searchability, caption structure, keyword density, hashtag alignment, readability, and CTA impact.
          </p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => onNavigateModule('caption_optimizer')}
            className="px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 whitespace-nowrap"
          >
            Audit Existing Caption
          </button>
          <button
            type="button"
            onClick={onRunUniversalAudit}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 via-violet-600 to-blue-600 hover:from-indigo-500 hover:via-violet-500 hover:to-blue-500 shadow-sm whitespace-nowrap"
          >
            Generate Scored SEO Kit
          </button>
        </div>
      </div>

      {!latestScore ? (
        <EmptyModuleState
          title="No SEO score computed yet"
          description="Generate any Instagram SEO kit (Universal SEO, Reels SEO, Carousel SEO, Profile SEO, Hashtags, or Caption Optimizer) to inspect its full 6-dimension score breakdown and actionable tips here."
          actionLabel="Run Universal SEO Generator"
          onAction={onRunUniversalAudit}
        />
      ) : (
        <div className="space-y-6">
          {/* Primary Score Hero Card */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Evaluated Source · {latestSourceLabel || 'Active Studio Output'}
                </div>
                <div className="mt-2 flex items-baseline gap-3">
                  <span className="text-4xl sm:text-5xl font-bold font-mono tabular-nums bg-gradient-to-r from-indigo-600 via-violet-600 to-blue-600 dark:from-indigo-400 dark:to-blue-400 bg-clip-text text-transparent">
                    {latestScore.overallScore}
                  </span>
                  <span className="text-lg font-mono text-slate-400">/ 100</span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 max-w-xl">
                  Estimated overall Instagram SEO readiness based on keyword placement, mobile skimmability, hashtag topical match, and call-to-action strength.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 shrink-0">
                <div className="rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-3">
                  <div className="text-xs text-slate-500 dark:text-slate-400">Caption</div>
                  <div className="text-xl font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-0.5">
                    {latestScore.captionScore}
                  </div>
                </div>
                <div className="rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-3">
                  <div className="text-xs text-slate-500 dark:text-slate-400">Keywords</div>
                  <div className="text-xl font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-0.5">
                    {latestScore.keywordScore}
                  </div>
                </div>
                <div className="rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-3">
                  <div className="text-xs text-slate-500 dark:text-slate-400">Hashtags</div>
                  <div className="text-xl font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-0.5">
                    {latestScore.hashtagRelevance}
                  </div>
                </div>
                <div className="rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-3">
                  <div className="text-xs text-slate-500 dark:text-slate-400">Readability</div>
                  <div className="text-xl font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-0.5">
                    {latestScore.readability}
                  </div>
                </div>
                <div className="rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-3">
                  <div className="text-xs text-slate-500 dark:text-slate-400">CTA Score</div>
                  <div className="text-xl font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-0.5">
                    {latestScore.ctaScore}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Granular Dimension Bars */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              Dimension Breakdown
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <ScoreBarRow label="Overall SEO Score" score={latestScore.overallScore} />
              <ScoreBarRow label="Caption Score" score={latestScore.captionScore} />
              <ScoreBarRow label="Keyword Score" score={latestScore.keywordScore} />
              <ScoreBarRow label="Hashtag Relevance" score={latestScore.hashtagRelevance} />
              <ScoreBarRow label="Readability" score={latestScore.readability} />
              <ScoreBarRow label="CTA Score" score={latestScore.ctaScore} />
            </div>
          </div>

          {/* Strengths & Actionable Recommendations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-3">
                Key Strengths
              </h3>
              <ul className="space-y-2.5 text-sm text-slate-700 dark:text-slate-300">
                {latestScore.strengths.map((s, i) => (
                  <li key={i} className="flex items-baseline gap-2.5">
                    <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 shrink-0">
                      0{i + 1}
                    </span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-3">
                Actionable Recommendations
              </h3>
              <ul className="space-y-2.5 text-sm text-slate-700 dark:text-slate-300">
                {latestScore.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-baseline gap-2.5">
                    <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400 shrink-0">
                      0{i + 1}
                    </span>
                    <span>{rec}</span>
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
