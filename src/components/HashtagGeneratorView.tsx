import type { HashtagGroupResult } from '../types/seo';
import {
  CopyButton,
  EmptyModuleState,
  ErrorBanner,
  InlineScoreSummary,
  ModuleToolbar,
  SkeletonOutput,
} from './ActionControls';

function HashtagBucket({
  title,
  subtitle,
  tags,
}: {
  title: string;
  subtitle: string;
  tags: string[];
}) {
  const normalized = tags.map((t) => (t.startsWith('#') ? t : `#${t}`));

  return (
    <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">{title}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>
        </div>
        <CopyButton text={normalized.join(' ')} label="Copy Set" compact />
      </div>
      <div className="flex flex-wrap gap-2">
        {normalized.map((tag, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => navigator.clipboard?.writeText(tag)}
            className="px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-mono text-slate-700 dark:text-slate-300 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            title="Click to copy tag"
          >
            {tag}
          </button>
        ))}
      </div>
    </section>
  );
}

export function HashtagGeneratorView({
  result,
  isLoading,
  error,
  onGenerate,
  onSaveProject,
  onDownloadReport,
  onOpenScoreDashboard,
}: {
  result: HashtagGroupResult | null;
  isLoading: boolean;
  error: string | null;
  onGenerate: () => void;
  onSaveProject: () => void;
  onDownloadReport: () => void;
  onOpenScoreDashboard: () => void;
}) {
  const allTags = result
    ? [...result.broad, ...result.medium, ...result.niche, ...result.longTail].map((t) =>
        t.startsWith('#') ? t : `#${t}`
      )
    : [];

  return (
    <div className="space-y-6">
      <ModuleToolbar
        title="Hashtag Generator"
        description="Generate structured, niche-accurate hashtags segmented into Broad, Medium, Niche, and Long-Tail clusters without fabricated volume estimates."
        isLoading={isLoading}
        hasResult={Boolean(result)}
        onGenerate={onGenerate}
        onSaveProject={onSaveProject}
        onDownloadReport={onDownloadReport}
        generateLabel="Generate Hashtags"
        extraActions={
          result ? <CopyButton text={allTags.join(' ')} label="Copy All Tiers" /> : undefined
        }
      />

      {error && <ErrorBanner message={error} onRetry={onGenerate} />}
      {isLoading && <SkeletonOutput />}

      {!isLoading && !result && !error && (
        <EmptyModuleState
          title="Build a balanced 4-tier hashtag mix"
          description="Generate Broad, Medium, Niche, and Long-Tail hashtags mapped to your exact Creator Mode, niche, and language."
          actionLabel="Generate Hashtags"
          onAction={onGenerate}
        />
      )}

      {!isLoading && result && (
        <div className="space-y-6">
          <InlineScoreSummary
            score={result.scoreBreakdown}
            onOpenDashboard={onOpenScoreDashboard}
          />

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-indigo-50/50 dark:bg-indigo-950/20 p-4 text-sm text-slate-700 dark:text-slate-300">
            <span className="font-semibold text-slate-900 dark:text-white">
              Hashtag Mix Guidance:{' '}
            </span>
            {result.strategyNote}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <HashtagBucket
              title="Broad Hashtags"
              subtitle="High-level category tags for broad topical context"
              tags={result.broad}
            />
            <HashtagBucket
              title="Medium Hashtags"
              subtitle="Active community & sub-category discovery tags"
              tags={result.medium}
            />
            <HashtagBucket
              title="Niche Hashtags"
              subtitle="Focused audience & creator-type cluster tags"
              tags={result.niche}
            />
            <HashtagBucket
              title="Long-Tail Hashtags"
              subtitle="Specific intent phrases matching what users search"
              tags={result.longTail}
            />
          </div>
        </div>
      )}
    </div>
  );
}
