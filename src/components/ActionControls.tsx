import { Check, Copy, Pencil, RotateCcw, Save } from 'lucide-react';
import { useState } from 'react';
import type { SeoScoreBreakdown } from '../types/seo';

export function CopyButton({
  text,
  label = 'Copy',
  compact = false,
}: {
  text: string;
  label?: string;
  compact?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Fallback for clipboard permissions
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
        compact ? 'px-2.5 py-1.5 text-xs font-medium' : 'px-3 py-1.5 text-xs font-medium'
      }`}
      aria-label={copied ? 'Copied to clipboard' : label}
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Copied</span>
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
}

export function EditableTextBlock({
  title,
  subtitle,
  value,
  onSave,
  multiline = true,
  charLimit,
}: {
  title: string;
  subtitle?: string;
  value: string;
  onSave: (nextValue: string) => void;
  multiline?: boolean;
  charLimit?: number;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  const startEdit = () => {
    setDraft(value);
    setEditing(true);
  };

  const commit = () => {
    onSave(draft);
    setEditing(false);
  };

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 transition-colors">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-2.5">
        <div className="min-w-0">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</h4>
          {subtitle && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {typeof charLimit === 'number' && (
            <span
              className={`text-xs font-mono tabular-nums ${
                (editing ? draft.length : value.length) > charLimit
                  ? 'text-rose-600 dark:text-rose-400 font-semibold'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {editing ? draft.length : value.length}/{charLimit} chars
            </span>
          )}
          {editing ? (
            <button
              type="button"
              onClick={commit}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 whitespace-nowrap shrink-0"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Apply</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={startEdit}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 whitespace-nowrap shrink-0"
            >
              <Pencil className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>Edit</span>
            </button>
          )}
          <CopyButton text={editing ? draft : value} compact />
        </div>
      </div>
      {editing ? (
        multiline ? (
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={5}
            className="w-full rounded-lg border border-indigo-300 dark:border-indigo-700 bg-slate-50 dark:bg-slate-950 p-3 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        ) : (
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="w-full rounded-lg border border-indigo-300 dark:border-indigo-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        )
      ) : (
        <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
          {value}
        </p>
      )}
    </div>
  );
}

export function ModuleToolbar({
  title,
  description,
  isLoading,
  hasResult,
  onGenerate,
  onSaveProject,
  onDownloadReport,
  generateLabel = 'Generate SEO',
  extraActions,
}: {
  title: string;
  description: string;
  isLoading: boolean;
  hasResult: boolean;
  onGenerate: () => void;
  onSaveProject?: () => void;
  onDownloadReport?: () => void;
  generateLabel?: string;
  extraActions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
      <div className="min-w-0">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white text-balance">
          {title}
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
          {description}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2.5 shrink-0">
        {extraActions}
        {hasResult && onSaveProject && (
          <button
            type="button"
            onClick={onSaveProject}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Project</span>
          </button>
        )}
        {hasResult && onDownloadReport && (
          <button
            type="button"
            onClick={onDownloadReport}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
          >
            <span>Download Report</span>
          </button>
        )}
        <button
          type="button"
          onClick={onGenerate}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 via-violet-600 to-blue-600 hover:from-indigo-500 hover:via-violet-500 hover:to-blue-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-sm whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          <RotateCcw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isLoading ? 'Generating...' : hasResult ? 'Regenerate' : generateLabel}</span>
        </button>
      </div>
    </div>
  );
}

export function ScoreBarRow({ label, score }: { label: string; score: number }) {
  const clamped = Math.max(0, Math.min(100, Math.round(score)));
  const statusLabel =
    clamped >= 80 ? 'Strong' : clamped >= 60 ? 'Fair' : 'Needs work';
  const statusColor =
    clamped >= 80
      ? 'text-emerald-600 dark:text-emerald-400'
      : clamped >= 60
      ? 'text-amber-600 dark:text-amber-400'
      : 'text-rose-600 dark:text-rose-400';

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-slate-700 dark:text-slate-200">{label}</span>
        <div className="flex items-center gap-2 font-mono tabular-nums">
          <span className={statusColor}>{statusLabel}</span>
          <span className="text-slate-900 dark:text-white font-semibold">{clamped}/100</span>
        </div>
      </div>
      <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-600 via-violet-600 to-blue-500 transition-all duration-300"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}

export function InlineScoreSummary({
  score,
  onOpenDashboard,
}: {
  score: SeoScoreBreakdown;
  onOpenDashboard?: () => void;
}) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            Estimated SEO Score Breakdown
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Overall Searchability & Engagement Readiness
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-2xl font-bold font-mono tabular-nums bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-indigo-400 dark:to-blue-400 bg-clip-text text-transparent">
              {score.overallScore}/100
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Overall Score</div>
          </div>
          {onOpenDashboard && (
            <button
              type="button"
              onClick={onOpenDashboard}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 whitespace-nowrap shrink-0"
            >
              Full Score Dashboard
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 pt-4">
        <ScoreBarRow label="Caption" score={score.captionScore} />
        <ScoreBarRow label="Keywords" score={score.keywordScore} />
        <ScoreBarRow label="Hashtags" score={score.hashtagRelevance} />
        <ScoreBarRow label="Readability" score={score.readability} />
        <ScoreBarRow label="CTA" score={score.ctaScore} />
      </div>
    </div>
  );
}

export function SkeletonOutput() {
  return (
    <div className="space-y-4 animate-pulse" aria-busy="true" aria-label="Generating SEO output">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-32 rounded-xl bg-slate-200/70 dark:bg-slate-800/70" />
        <div className="h-32 rounded-xl bg-slate-200/70 dark:bg-slate-800/70" />
      </div>
      <div className="h-44 rounded-xl bg-slate-200/70 dark:bg-slate-800/70" />
      <div className="h-36 rounded-xl bg-slate-200/70 dark:bg-slate-800/70" />
    </div>
  );
}

export function ErrorBanner({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div
      role="alert"
      className="rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/80 dark:bg-rose-950/30 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
    >
      <div className="text-sm text-rose-800 dark:text-rose-200">
        <span className="font-semibold">Generation failed: </span>
        <span>{message}</span>
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="px-3.5 py-1.5 rounded-lg border border-rose-300 dark:border-rose-800 bg-white dark:bg-slate-900 text-xs font-medium text-rose-700 dark:text-rose-200 hover:bg-rose-50 dark:hover:bg-rose-900/40 whitespace-nowrap shrink-0"
        >
          Try Again
        </button>
      )}
    </div>
  );
}

export function EmptyModuleState({
  title,
  description,
  actionLabel,
  onAction,
}: {
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
}) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-900/50 p-8 sm:p-12 text-center">
      <h3 className="text-base font-semibold text-slate-900 dark:text-white">{title}</h3>
      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1.5 max-w-lg mx-auto leading-relaxed">
        {description}
      </p>
      <button
        type="button"
        onClick={onAction}
        className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 via-violet-600 to-blue-600 hover:from-indigo-500 hover:via-violet-500 hover:to-blue-500 shadow-sm transition-all"
      >
        <span>{actionLabel}</span>
      </button>
    </div>
  );
}
