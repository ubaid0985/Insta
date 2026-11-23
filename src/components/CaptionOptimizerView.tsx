import type { CaptionOptimizerResult } from '../types/seo';
import {
  CopyButton,
  EditableTextBlock,
  ErrorBanner,
  InlineScoreSummary,
  ModuleToolbar,
  SkeletonOutput,
} from './ActionControls';

export function CaptionOptimizerView({
  existingCaption,
  existingHashtags,
  onExistingCaptionChange,
  onExistingHashtagsChange,
  result,
  isLoading,
  error,
  onGenerate,
  onUpdate,
  onSaveProject,
  onDownloadReport,
  onOpenScoreDashboard,
}: {
  existingCaption: string;
  existingHashtags: string;
  onExistingCaptionChange: (val: string) => void;
  onExistingHashtagsChange: (val: string) => void;
  result: CaptionOptimizerResult | null;
  isLoading: boolean;
  error: string | null;
  onGenerate: () => void;
  onUpdate: (next: CaptionOptimizerResult) => void;
  onSaveProject: () => void;
  onDownloadReport: () => void;
  onOpenScoreDashboard: () => void;
}) {
  return (
    <div className="space-y-6">
      <ModuleToolbar
        title="Caption Optimizer"
        description="Paste your draft caption and hashtags to audit SEO quality, keyword placement, readability, engagement potential, CTA clarity, and get an upgraded rewrite."
        isLoading={isLoading}
        hasResult={Boolean(result)}
        onGenerate={onGenerate}
        onSaveProject={onSaveProject}
        onDownloadReport={onDownloadReport}
        generateLabel="Analyze & Optimize Caption"
      />

      {/* Input Editor */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="draft-caption-input"
              className="text-xs font-medium text-slate-700 dark:text-slate-300"
            >
              Existing Caption Draft
            </label>
            <span className="text-xs font-mono tabular-nums text-slate-500 dark:text-slate-400">
              {existingCaption.length} / 2,200 chars
            </span>
          </div>
          <textarea
            id="draft-caption-input"
            rows={5}
            value={existingCaption}
            onChange={(e) => onExistingCaptionChange(e.target.value)}
            placeholder="Paste your existing Instagram caption here to audit and rewrite..."
            className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-3 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label
            htmlFor="draft-hashtags-input"
            className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
          >
            Existing Hashtags (Optional)
          </label>
          <input
            id="draft-hashtags-input"
            type="text"
            value={existingHashtags}
            onChange={(e) => onExistingHashtagsChange(e.target.value)}
            placeholder="#creator #instagramtips #studytok ..."
            className="w-full h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 text-sm font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {error && <ErrorBanner message={error} onRetry={onGenerate} />}
      {isLoading && <SkeletonOutput />}

      {!isLoading && result && (
        <div className="space-y-6">
          <InlineScoreSummary
            score={result.scoreBreakdown}
            onOpenDashboard={onOpenScoreDashboard}
          />

          <EditableTextBlock
            title="Improved SEO Caption"
            subtitle="Rewritten in your creator voice & target language — edit inline or copy directly"
            value={result.improvedCaption}
            onSave={(val) => onUpdate({ ...result, improvedCaption: val })}
            multiline
          />

          <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
            <div className="flex items-center justify-between gap-2 mb-3">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                Refined Hashtags
              </h3>
              <CopyButton text={result.improvedHashtags.join(' ')} label="Copy All" />
            </div>
            <p className="text-xs font-mono text-slate-700 dark:text-slate-300 leading-relaxed">
              {result.improvedHashtags.map((h) => (h.startsWith('#') ? h : `#${h}`)).join('  ')}
            </p>
          </section>

          <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-4">
              6-Point Caption Diagnostic
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <h4 className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
                  SEO Quality
                </h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {result.analysis.seoQuality}
                </p>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
                  Keyword Placement
                </h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {result.analysis.keywordPlacement}
                </p>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
                  Readability
                </h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {result.analysis.readabilityFeedback}
                </p>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
                  Engagement Potential
                </h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {result.analysis.engagementPotential}
                </p>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
                  CTA Quality
                </h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {result.analysis.ctaQuality}
                </p>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
                  Hashtag Relevance
                </h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {result.analysis.hashtagRelevanceFeedback}
                </p>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
