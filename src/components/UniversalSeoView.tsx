import type { UniversalSeoResult } from '../types/seo';
import {
  CopyButton,
  EditableTextBlock,
  EmptyModuleState,
  ErrorBanner,
  InlineScoreSummary,
  ModuleToolbar,
  SkeletonOutput,
} from './ActionControls';

export function UniversalSeoView({
  result,
  isLoading,
  error,
  onGenerate,
  onUpdate,
  onSaveProject,
  onDownloadReport,
  onOpenScoreDashboard,
}: {
  result: UniversalSeoResult | null;
  isLoading: boolean;
  error: string | null;
  onGenerate: () => void;
  onUpdate: (next: UniversalSeoResult) => void;
  onSaveProject: () => void;
  onDownloadReport: () => void;
  onOpenScoreDashboard: () => void;
}) {
  return (
    <div className="space-y-6">
      <ModuleToolbar
        title="Universal Instagram SEO Generator"
        description="Generate search-indexed titles, 3 distinct captions, 40 hashtags, layered keywords, alt text, first comment, CTAs, and cover lines tailored to your creator mode."
        isLoading={isLoading}
        hasResult={Boolean(result)}
        onGenerate={onGenerate}
        onSaveProject={onSaveProject}
        onDownloadReport={onDownloadReport}
        generateLabel="Generate Universal SEO"
      />

      {error && <ErrorBanner message={error} onRetry={onGenerate} />}

      {isLoading && <SkeletonOutput />}

      {!isLoading && !result && !error && (
        <EmptyModuleState
          title="Ready to optimize your next Instagram post"
          description="Confirm your Creator Mode, Niche, Topic, and Language above, then generate a complete 360-degree Instagram SEO package powered by Gemini AI."
          actionLabel="Generate Universal SEO"
          onAction={onGenerate}
        />
      )}

      {!isLoading && result && (
        <div className="space-y-6">
          <InlineScoreSummary
            score={result.scoreBreakdown}
            onOpenDashboard={onOpenScoreDashboard}
          />

          {/* 5 SEO-Friendly Titles */}
          <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
            <div className="flex items-center justify-between gap-3 mb-3">
              <div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                  5 SEO-Friendly Titles
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Search-aligned hooks for cover slides, Reel titles, or lead lines
                </p>
              </div>
              <CopyButton text={result.titles.join('\n')} label="Copy All" />
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {result.titles.map((title, idx) => (
                <div
                  key={idx}
                  className="py-2.5 flex items-center justify-between gap-3"
                >
                  <div className="flex items-baseline gap-3 min-w-0">
                    <span className="text-xs font-mono tabular-nums text-slate-400 shrink-0">
                      0{idx + 1}
                    </span>
                    <span className="text-sm font-medium text-slate-800 dark:text-slate-100">
                      {title}
                    </span>
                  </div>
                  <CopyButton text={title} compact />
                </div>
              ))}
            </div>
          </section>

          {/* 3 Optimized Captions (Editable) */}
          <section className="space-y-3">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              3 Optimized Captions
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {result.captions.map((cap, idx) => (
                <EditableTextBlock
                  key={idx}
                  title={`Caption Option ${idx + 1}: ${cap.style}`}
                  subtitle="Click Edit to customize wording before copying"
                  value={cap.text}
                  onSave={(nextVal) => {
                    const updated = [...result.captions];
                    updated[idx] = { ...cap, text: nextVal };
                    onUpdate({ ...result, captions: updated });
                  }}
                />
              ))}
            </div>
          </section>

          {/* Keywords Matrix */}
          <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                  Instagram Search Keyword Architecture
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Use naturally across captions, spoken audio, on-screen text, and alt text
                </p>
              </div>
              <CopyButton
                text={[
                  ...result.primaryKeywords,
                  ...result.secondaryKeywords,
                  ...result.longTailKeywords,
                ].join(', ')}
                label="Copy Keywords"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <h4 className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-2">
                  Primary Keywords
                </h4>
                <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                  {result.primaryKeywords.join(' · ')}
                </p>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-2">
                  Secondary Keywords
                </h4>
                <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                  {result.secondaryKeywords.join(' · ')}
                </p>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-2">
                  Long-Tail Keywords
                </h4>
                <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                  {result.longTailKeywords.join(' · ')}
                </p>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-2">
                  Related Instagram Search Terms
                </h4>
                <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                  {result.relatedSearchTerms.join(' · ')}
                </p>
              </div>
            </div>
          </section>

          {/* 40 Relevant Hashtags */}
          <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                  40 Relevant Hashtags
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums">
                  {result.hashtags.length} hashtags generated · Click any tag to copy individually
                </p>
              </div>
              <div className="flex items-center gap-2">
                <CopyButton text={result.hashtags.slice(0, 15).join(' ')} label="Copy Top 15" />
                <CopyButton text={result.hashtags.join(' ')} label="Copy All 40" />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {result.hashtags.map((tag, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => navigator.clipboard?.writeText(tag)}
                  className="px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-mono text-slate-700 dark:text-slate-300 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  title="Click to copy hashtag"
                >
                  {tag.startsWith('#') ? tag : `#${tag}`}
                </button>
              ))}
            </div>
          </section>

          {/* Alt Text & First Comment */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <EditableTextBlock
              title="SEO-Friendly Alt Text"
              subtitle="Paste into Instagram Advanced Settings > Write Alt Text"
              value={result.altText}
              onSave={(nextVal) => onUpdate({ ...result, altText: nextVal })}
              multiline
            />
            <EditableTextBlock
              title="First Comment"
              subtitle="Pin immediately after publishing to anchor keywords & spark replies"
              value={result.firstComment}
              onSave={(nextVal) => onUpdate({ ...result, firstComment: nextVal })}
              multiline
            />
          </div>

          {/* CTA Suggestions & Cover Text Ideas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
              <div className="flex items-center justify-between gap-2 mb-3">
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                  CTA Suggestions
                </h3>
                <CopyButton text={result.ctaSuggestions.join('\n')} compact />
              </div>
              <ul className="space-y-2.5">
                {result.ctaSuggestions.map((cta, i) => (
                  <li key={i} className="flex items-start justify-between gap-3 text-sm text-slate-700 dark:text-slate-300">
                    <span>{cta}</span>
                    <CopyButton text={cta} compact />
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
              <div className="flex items-center justify-between gap-2 mb-3">
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                  Cover Text Ideas
                </h3>
                <CopyButton text={result.coverTextIdeas.join('\n')} compact />
              </div>
              <ul className="space-y-2.5">
                {result.coverTextIdeas.map((idea, i) => (
                  <li key={i} className="flex items-start justify-between gap-3 text-sm text-slate-700 dark:text-slate-300">
                    <span className="font-medium text-slate-900 dark:text-slate-100">{idea}</span>
                    <CopyButton text={idea} compact />
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
