import { Download, FolderOpen, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { SavedProject, SearchHistoryItem, StudioModuleId } from '../types/seo';
import { downloadTextFile, formatResultAsMarkdown } from '../utils/reportExport';

const MODULE_LABELS: Record<StudioModuleId, string> = {
  universal: 'Universal SEO',
  reels: 'Reels SEO',
  post_carousel: 'Post & Carousel',
  profile: 'Profile SEO',
  caption_optimizer: 'Caption Optimizer',
  hashtags: 'Hashtags',
  content_ideas: 'Content Ideas',
  competitor: 'Competitor Analysis',
  seo_dashboard: 'Score Dashboard',
  creator_profile: 'Creator Profile',
  saved_projects: 'Saved Projects',
};

export function SavedProjectsView({
  projects,
  history,
  onLoadProject,
  onDeleteProject,
  onLoadHistoryItem,
  onClearHistory,
}: {
  projects: SavedProject[];
  history: SearchHistoryItem[];
  onLoadProject: (project: SavedProject) => void;
  onDeleteProject: (id: string) => void;
  onLoadHistoryItem: (item: SearchHistoryItem) => void;
  onClearHistory: () => void;
}) {
  const [tab, setTab] = useState<'projects' | 'history'>('projects');
  const [query, setQuery] = useState('');

  const q = query.trim().toLowerCase();

  const filteredProjects = projects.filter(
    (p) =>
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.profile.niche.toLowerCase().includes(q) ||
      p.profile.topic.toLowerCase().includes(q) ||
      p.profile.creatorType.toLowerCase().includes(q)
  );

  const filteredHistory = history.filter(
    (h) =>
      !q ||
      h.topic.toLowerCase().includes(q) ||
      h.niche.toLowerCase().includes(q) ||
      h.creatorType.toLowerCase().includes(q) ||
      h.language.toLowerCase().includes(q)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Saved Projects & Search History
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Re-open previous SEO generations, inspect your topic search history, or download Markdown reports.
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-100 dark:bg-slate-800 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setTab('projects')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
              tab === 'projects'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Saved Projects ({projects.length})
          </button>
          <button
            type="button"
            onClick={() => setTab('history')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
              tab === 'history'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Search History ({history.length})
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter by title, niche, topic, or creator role..."
            className="w-full h-10 pl-9 pr-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        {tab === 'history' && history.length > 0 && (
          <button
            type="button"
            onClick={onClearHistory}
            className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 whitespace-nowrap self-start sm:self-auto"
          >
            Clear History
          </button>
        )}
      </div>

      {tab === 'projects' ? (
        filteredProjects.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-700 p-10 text-center">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              {projects.length === 0 ? 'No saved projects yet' : 'No matching saved projects'}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {projects.length === 0
                ? 'Generate results in any SEO module and click “Save Project” to keep them organized here.'
                : 'Try clearing or broadening your search filter.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200 dark:divide-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
            {filteredProjects.map((proj) => (
              <div
                key={proj.id}
                className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-medium text-indigo-600 dark:text-indigo-400">
                      {MODULE_LABELS[proj.module]}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{proj.profile.creatorType}</span>
                    <span aria-hidden="true">·</span>
                    <span>{proj.profile.language}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums">
                      {new Date(proj.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white mt-1 truncate">
                    {proj.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                    {proj.profile.niche} — {proj.profile.topic}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => onLoadProject(proj)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 whitespace-nowrap"
                  >
                    <FolderOpen className="w-3.5 h-3.5" />
                    <span>Open</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const md = formatResultAsMarkdown(proj.title, proj.profile, proj.payload);
                      downloadTextFile(
                        `${proj.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.md`,
                        md
                      );
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 whitespace-nowrap"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Report</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteProject(proj.id)}
                    aria-label={`Delete project ${proj.title}`}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-rose-600 hover:border-rose-300 dark:hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : filteredHistory.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-700 p-10 text-center">
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            No search history recorded yet
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Every Gemini SEO generation is automatically logged here so you can jump back to any previous run.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-slate-200 dark:divide-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
          {filteredHistory.map((item) => (
            <div
              key={item.id}
              className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-medium text-indigo-600 dark:text-indigo-400">
                    {MODULE_LABELS[item.module]}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{item.creatorType}</span>
                  <span aria-hidden="true">·</span>
                  <span>{item.language}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono tabular-nums">
                    {new Date(item.timestamp).toLocaleString()}
                  </span>
                </div>
                <div className="text-sm font-medium text-slate-900 dark:text-white mt-1 truncate">
                  {item.topic}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  Niche: {item.niche}
                </div>
              </div>
              <button
                type="button"
                onClick={() => onLoadHistoryItem(item)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 whitespace-nowrap shrink-0 self-start sm:self-auto"
              >
                Restore Output
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
