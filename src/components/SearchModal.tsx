import React, { useState, useEffect, useRef } from 'react';
import { Search, X, BookOpen, ArrowRight } from 'lucide-react';
import { searchInBook } from '../data/allChapters';
import { Chapter } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectChapter: (chapterId: string, sectionId?: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectChapter,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const results = searchInBook(query);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/60 backdrop-blur-xs p-4 pt-16 sm:pt-24">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 overflow-hidden flex flex-col max-h-[80vh]">
        {/* Barre de recherche */}
        <div className="flex items-center gap-3 border-b border-slate-200 px-4 py-3.5 dark:border-slate-800">
          <Search className="h-5 w-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un concept, une classe, un exercice (ex: mémoire, equals, polymorphisme, TVQ)..."
            className="w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden dark:text-slate-100"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-2 py-0.5 text-xs text-slate-500 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800 cursor-pointer"
          >
            Échap
          </button>
        </div>

        {/* Résultats de recherche */}
        <div className="overflow-y-auto p-4 space-y-4 flex-1">
          {query.trim().length < 2 && (
            <div className="py-8 text-center text-xs text-slate-400">
              Saisissez au moins 2 caractères pour explorer les 88 pages du manuel collégial.
            </div>
          )}

          {query.trim().length >= 2 && results.length === 0 && (
            <div className="py-8 text-center text-xs text-slate-500">
              Aucun résultat trouvé pour « <span className="font-semibold">{query}</span> ».
            </div>
          )}

          {results.map(({ chapter, matchedSections }) => (
            <div
              key={chapter.id}
              className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 dark:border-slate-800/80 dark:bg-slate-800/40"
            >
              <div className="flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-400 mb-2">
                <BookOpen className="h-3.5 w-3.5" />
                <span>
                  {typeof chapter.number === 'number' ? `Chapitre ${chapter.number}` : chapter.number} : {chapter.title}
                </span>
              </div>

              <div className="space-y-2">
                {matchedSections.map((sec, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      onSelectChapter(chapter.id);
                      onClose();
                    }}
                    className="w-full text-left rounded-lg bg-white p-2.5 shadow-xs hover:bg-amber-50/60 dark:bg-slate-900 dark:hover:bg-slate-800 transition-colors group cursor-pointer block"
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-amber-700 dark:group-hover:text-amber-400">
                        {sec.sectionTitle}
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-amber-600 transition-transform group-hover:translate-x-0.5" />
                    </div>
                    <p className="mt-1 text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                      {sec.snippet.replace(/\*\*/g, '')}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
