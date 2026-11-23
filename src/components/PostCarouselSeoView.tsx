import type { PostCarouselSeoResult } from '../types/seo';
import {
  CopyButton,
  EditableTextBlock,
  EmptyModuleState,
  ErrorBanner,
  InlineScoreSummary,
  ModuleToolbar,
  SkeletonOutput,
} from './ActionControls';

export function PostCarouselSeoView({
  slideCount,
  onSlideCountChange,
  result,
  isLoading,
  error,
  onGenerate,
  onUpdate,
  onSaveProject,
  onDownloadReport,
  onOpenScoreDashboard,
}: {
  slideCount: number;
  onSlideCountChange: (count: number) => void;
  result: PostCarouselSeoResult | null;
  isLoading: boolean;
  error: string | null;
  onGenerate: () => void;
  onUpdate: (next: PostCarouselSeoResult) => void;
  onSaveProject: () => void;
  onDownloadReport: () => void;
  onOpenScoreDashboard: () => void;
}) {
  return (
    <div className="space-y-6">
      <ModuleToolbar
        title="Instagram Post & Carousel SEO"
        description="Build slide-by-slide carousel narratives with high-save cover titles, SEO captions, descriptive alt text, and comment-sparking questions."
        isLoading={isLoading}
        hasResult={Boolean(result)}
        onGenerate={onGenerate}
        onSaveProject={onSaveProject}
        onDownloadReport={onDownloadReport}
        generateLabel="Generate Post & Carousel SEO"
        extraActions={
          <select
            aria-label="Carousel slide count"
            value={slideCount}
            onChange={(e) => onSlideCountChange(Number(e.target.value))}
            className="h-9 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {[5, 6, 7, 8, 9, 10].map((n) => (
              <option key={n} value={n}>
                {n} Slides
              </option>
            ))}
          </select>
        }
      />

      {error && <ErrorBanner message={error} onRetry={onGenerate} />}
      {isLoading && <SkeletonOutput />}

      {!isLoading && !result && !error && (
        <EmptyModuleState
          title="Design a save-worthy Carousel or Feed Post"
          description="Generate structured slide-by-slide copy, visual layout notes, SEO captions, alt text, and engagement questions tailored to your niche."
          actionLabel="Generate Post & Carousel SEO"
          onAction={onGenerate}
        />
      )}

      {!isLoading && result && (
        <div className="space-y-6">
          <InlineScoreSummary
            score={result.scoreBreakdown}
            onOpenDashboard={onOpenScoreDashboard}
          />

          {/* Carousel Titles */}
          <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
            <div className="flex items-center justify-between gap-3 mb-3">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                Carousel Cover Titles
              </h3>
              <CopyButton text={result.carouselTitles.join('\n')} label="Copy All" />
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {result.carouselTitles.map((title, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-slate-800 dark:text-slate-100">
                    {title}
                  </span>
                  <CopyButton text={title} compact />
                </div>
              ))}
            </div>
          </section>

          {/* Slide-by-Slide Content Suggestions */}
          <section className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                  Slide-by-Slide Content Suggestions
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Sequential structure engineered for swipe-through completion and saves
                </p>
              </div>
              <CopyButton
                text={result.slides
                  .map((s) => `Slide ${s.slideNumber}: ${s.heading}\n${s.body}\nVisual: ${s.visualDirection}`)
                  .join('\n\n')}
                label="Copy All Slides"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.slides.map((slide, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 flex flex-col justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-mono tabular-nums font-semibold text-indigo-600 dark:text-indigo-400">
                        Slide {String(slide.slideNumber).padStart(2, '0')}
                      </span>
                      <CopyButton text={`${slide.heading}\n${slide.body}`} compact />
                    </div>
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-1.5">
                      {slide.heading}
                    </h4>
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      {slide.body}
                    </p>
                  </div>
                  <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                    Visual note: {slide.visualDirection}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SEO Captions */}
          <section className="space-y-3">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              SEO Captions
            </h3>
            <div className="space-y-4">
              {result.seoCaptions.map((cap, idx) => (
                <EditableTextBlock
                  key={idx}
                  title={`Caption ${idx + 1}: ${cap.style}`}
                  value={cap.text}
                  onSave={(val) => {
                    const next = [...result.seoCaptions];
                    next[idx] = { ...cap, text: val };
                    onUpdate({ ...result, seoCaptions: next });
                  }}
                />
              ))}
            </div>
          </section>

          {/* Alt Text & Engagement Questions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <EditableTextBlock
              title="Descriptive Alt Text"
              subtitle="Add to Instagram Accessibility Settings for image search indexing"
              value={result.altText}
              onSave={(val) => onUpdate({ ...result, altText: val })}
              multiline
            />

            <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
              <div className="flex items-center justify-between gap-2 mb-3">
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                  Engagement Questions
                </h3>
                <CopyButton text={result.engagementQuestions.join('\n')} compact />
              </div>
              <ul className="space-y-2.5">
                {result.engagementQuestions.map((q, i) => (
                  <li key={i} className="flex items-start justify-between gap-3 text-sm text-slate-700 dark:text-slate-300">
                    <span>{q}</span>
                    <CopyButton text={q} compact />
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Hashtags */}
          <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
            <div className="flex items-center justify-between gap-3 mb-3">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                Post & Carousel Hashtags
              </h3>
              <CopyButton text={result.hashtags.join(' ')} label="Copy All" />
            </div>
            <p className="text-xs font-mono text-slate-700 dark:text-slate-300 leading-relaxed">
              {result.hashtags.map((h) => (h.startsWith('#') ? h : `#${h}`)).join('  ')}
            </p>
          </section>
        </div>
      )}
    </div>
  );
}
