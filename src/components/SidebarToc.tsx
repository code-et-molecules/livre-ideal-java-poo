import React from 'react';
import { Book, CheckCircle, GraduationCap, X, ChevronRight } from 'lucide-react';
import { Chapter } from '../types';
import { BOOK_METADATA } from '../data/bookMetadata';

interface SidebarTocProps {
  chapters: Chapter[];
  currentChapterId: string;
  onSelectChapter: (chapterId: string) => void;
  isOpen: boolean;
  onClose: () => void;
  readChapterIds: string[];
}

export const SidebarToc: React.FC<SidebarTocProps> = ({
  chapters,
  currentChapterId,
  onSelectChapter,
  isOpen,
  onClose,
  readChapterIds,
}) => {
  // Calcul de la progression du cours
  const totalPages = BOOK_METADATA.totalEstimatedPages;
  const completedPages = chapters
    .filter((ch) => readChapterIds.includes(ch.id))
    .reduce((sum, ch) => sum + ch.estimatedPages, 0);
  const progressPercent = Math.min(100, Math.round((completedPages / totalPages) * 100));

  return (
    <>
      {/* Overlay pour écran mobile */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 lg:w-80 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* En-tête de la table des matières */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Table des matières
            </h2>
            <button
              onClick={onClose}
              className="lg:hidden rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {chapters.length} modules • ~{totalPages} pages de formation
          </p>
        </div>

        {/* Liste des chapitres */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          {chapters.map((chapter) => {
            const isSelected = chapter.id === currentChapterId;
            const isCompleted = readChapterIds.includes(chapter.id);
            const numDisplay = typeof chapter.number === 'number'
              ? (chapter.number < 10 ? `0${chapter.number}` : `${chapter.number}`)
              : 'AN';

            return (
              <button
                key={chapter.id}
                onClick={() => {
                  onSelectChapter(chapter.id);
                  onClose();
                }}
                className={`w-full text-left rounded-lg p-2.5 transition-colors flex items-center gap-3 text-sm cursor-pointer ${
                  isSelected
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 font-medium'
                    : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/60'
                }`}
              >
                <span
                  className={`font-mono text-xs ${
                    isSelected
                      ? 'text-blue-600 dark:text-blue-400 font-bold opacity-100'
                      : 'opacity-40 text-slate-500'
                  }`}
                >
                  {numDisplay}
                </span>

                <div className="flex-1 min-w-0">
                  <div className="truncate font-medium text-xs sm:text-sm">
                    {chapter.title}
                  </div>
                </div>

                {isCompleted && (
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Carte de progression du cours - Professional Polish */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <div className="bg-slate-900 rounded-xl p-4 text-white shadow-sm">
            <p className="text-xs opacity-70 mb-2">Progression du cours</p>
            <div className="flex justify-between items-end mb-2">
              <span className="text-2xl font-bold">{progressPercent}%</span>
              <span className="text-xs opacity-70">
                {completedPages} / {totalPages} pages
              </span>
            </div>
            <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-blue-400 h-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
