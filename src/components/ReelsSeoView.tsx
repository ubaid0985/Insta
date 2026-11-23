import type { ReelsSeoResult } from '../types/seo';
import {
  CopyButton,
  EditableTextBlock,
  EmptyModuleState,
  ErrorBanner,
  InlineScoreSummary,
  ModuleToolbar,
  SkeletonOutput,
} from './ActionControls';

export function ReelsSeoView({
  reelLength,
  onReelLengthChange,
  result,
  isLoading,
  error,
  onGenerate,
  onUpdate,
  onSaveProject,
  onDownloadReport,
  onOpenScoreDashboard,
}: {
  reelLength: string;
  onReelLengthChange: (val: string) => void;
  result: ReelsSeoResult | null;
  isLoading: boolean;
  error: string | null;
  onGenerate: () => void;
  onUpdate: (next: ReelsSeoResult) => void;
  onSaveProject: () => void;
  onDownloadReport: () => void;
  onOpenScoreDashboard: () => void;
}) {
  return (
    <div className="space-y-6">
      <ModuleToolbar
        title="Instagram Reels SEO"
        description="Optimize spoken audio keywords, on-screen text overlays, 10 scroll-stopping hooks, cover titles, and Reel captions for search and retention."
        isLoading={isLoading}
        hasResult={Boolean(result)}
        onGenerate={onGenerate}
        onSaveProject={onSaveProject}
        onDownloadReport={onDownloadReport}
        generateLabel="Generate Reels SEO"
        extraActions={
          <select
            aria-label="Reel length format"
            value={reelLength}
            onChange={(e) => onReelLengthChange(e.target.value)}
            className="h-9 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="7-15 seconds (Quick Hook / Trend)">7–15s Quick Hook</option>
            <option value="15-45 seconds (Tutorial / Story)">15–45s Tutorial / Story</option>
            <option value="45-90 seconds (Deep Dive / Podcast Clip)">45–90s Deep Dive</option>
          </select>
        }
      />

      {error && <ErrorBanner message={error} onRetry={onGenerate} />}
      {isLoading && <SkeletonOutput />}

      {!isLoading && !result && !error && (
        <EmptyModuleState
          title="Optimize your next Instagram Reel"
          description="Generate 10 opening hooks, spoken-word audio keywords for Instagram's automatic speech indexing, on-screen text overlays, and Reel captions."
          actionLabel="Generate Reels SEO"
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
              title="Cover Title"
              subtitle="Short grid-safe cover headline"
              value={result.coverTitle}
              onSave={(val) => onUpdate({ ...result, coverTitle: val })}
              multiline={false}
            />
            <EditableTextBlock
              title="Ending Call to Action (CTA)"
              subtitle="Spoken + caption closing prompt"
              value={result.cta}
              onSave={(val) => onUpdate({ ...result, cta: val })}
              multiline={false}
            />
          </div>

          {/* 10 Attention-Grabbing Hooks */}
          <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
            <div className="flex items-center justify-between gap-3 mb-3">
              <div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                  10 Attention-Grabbing Hooks
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Test these in the first 1–3 seconds (spoken + on-screen)
                </p>
              </div>
              <CopyButton text={result.hooks.join('\n')} label="Copy All 10" />
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {result.hooks.map((hook, i) => (
                <div key={i} className="py-2.5 flex items-center justify-between gap-3">
                  <div className="flex items-baseline gap-3 min-w-0">
                    <span className="text-xs font-mono tabular-nums text-slate-400 shrink-0">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="text-sm text-slate-800 dark:text-slate-100">{hook}</span>
                  </div>
                  <CopyButton text={hook} compact />
                </div>
              ))}
            </div>
          </section>

          {/* SEO-Friendly Reel Titles & Content Description */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
              <div className="flex items-center justify-between gap-2 mb-3">
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                  SEO-Friendly Reel Titles
                </h3>
                <CopyButton text={result.reelTitles.join('\n')} compact />
              </div>
              <ul className="space-y-2.5">
                {result.reelTitles.map((t, i) => (
                  <li key={i} className="flex items-start justify-between gap-3 text-sm text-slate-700 dark:text-slate-200">
                    <span>{t}</span>
                    <CopyButton text={t} compact />
                  </li>
                ))}
              </ul>
            </section>

            <EditableTextBlock
              title="Reel Content Description & Pacing"
              subtitle="Recommended visual flow from Hook to Payoff"
              value={result.contentDescription}
              onSave={(val) => onUpdate({ ...result, contentDescription: val })}
              multiline
            />
          </div>

          {/* Spoken Audio Keywords & On-Screen Text */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
              <div className="flex items-center justify-between gap-2 mb-3">
                <div>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                    Keywords for Spoken Audio
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Say these phrases clearly on camera so Instagram auto-captions index your topic
                  </p>
                </div>
                <CopyButton text={result.spokenAudioKeywords.join(', ')} compact />
              </div>
              <div className="flex flex-wrap gap-2">
                {result.spokenAudioKeywords.map((kw, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-700 dark:text-slate-300"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </section>

            <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
              <div className="flex items-center justify-between gap-2 mb-3">
                <div>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                    On-Screen Text Overlays
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Timed text cues to boost watch time & visual search indexing
                  </p>
                </div>
                <CopyButton text={result.onScreenText.join('\n')} compact />
              </div>
              <ul className="space-y-2">
                {result.onScreenText.map((txt, i) => (
                  <li key={i} className="text-sm text-slate-700 dark:text-slate-300 flex items-center justify-between gap-2">
                    <span>{txt}</span>
                    <CopyButton text={txt} compact />
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* 3 Reel Captions */}
          <section className="space-y-3">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              3 Reel Captions
            </h3>
            <div className="space-y-4">
              {result.captions.map((cap, idx) => (
                <EditableTextBlock
                  key={idx}
                  title={`Reel Caption ${idx + 1}: ${cap.angle}`}
                  value={cap.text}
                  onSave={(val) => {
                    const next = [...result.captions];
                    next[idx] = { ...cap, text: val };
                    onUpdate({ ...result, captions: next });
                  }}
                />
              ))}
            </div>
          </section>

          {/* Hashtags */}
          <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
            <div className="flex items-center justify-between gap-3 mb-3">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                Relevant Reel Hashtags
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
