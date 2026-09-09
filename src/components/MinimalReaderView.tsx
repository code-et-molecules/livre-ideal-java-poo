import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Eye,
  EyeOff,
  HelpCircle,
  Bookmark,
} from 'lucide-react';
import { Chapter, ThemeMode, FontFamily, FontSize } from '../types';
import { JavaCodeBlock } from './JavaCodeBlock';
import { MarkdownRenderer } from './MarkdownRenderer';
import { MemoryVisualizer } from './MemoryVisualizer';

interface MinimalReaderViewProps {
  chapter: Chapter;
  onNextChapter?: () => void;
  onPrevChapter?: () => void;
  hasNext: boolean;
  hasPrev: boolean;
  themeMode: ThemeMode;
  fontFamily: FontFamily;
  fontSize: FontSize;
  onMarkChapterCompleted: (chapterId: string) => void;
  isCompleted: boolean;
}

export const MinimalReaderView: React.FC<MinimalReaderViewProps> = ({
  chapter,
  onNextChapter,
  onPrevChapter,
  hasNext,
  hasPrev,
  onMarkChapterCompleted,
  isCompleted,
}) => {
  const [revealedSolutions, setRevealedSolutions] = useState<Record<string, boolean>>({});
  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState<Record<string, number>>({});

  const toggleSolution = (exerciseId: string) => {
    setRevealedSolutions((prev) => ({
      ...prev,
      [exerciseId]: !prev[exerciseId],
    }));
  };

  const handleSelectQuizOption = (questionId: string, optionIndex: number) => {
    setSelectedQuizAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  return (
    <div className="w-full min-h-screen pb-24 font-serif">
      {/* COLONNE CENTRÉE SANS DISTRACTION (SWISS MINIMALISM) */}
      <article className="max-w-2xl mx-auto px-6 sm:px-8 pt-12 sm:pt-16 space-y-12">
        {/* EN-TÊTE ÉDITORIAL ÉPURÉ */}
        <header className="space-y-4 text-center border-b border-slate-200/80 dark:border-slate-800/80 pb-10">
          <div className="font-sans text-xs uppercase tracking-widest text-slate-400 dark:text-slate-500">
            Programme collégial québécois • Devis 420.B0
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
            {chapter.title}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 italic font-normal">
            {chapter.subtitle}
          </p>

          <div className="pt-2 flex items-center justify-center gap-3 text-xs font-sans text-slate-500">
            <span>Chapitre {chapter.number}</span>
            <span>•</span>
            <span>~{chapter.estimatedPages} pages de lecture</span>
          </div>
        </header>

        {/* INTRODUCTION & OBJECTIF DE COMPÉTENCE */}
        <section className="space-y-6">
          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900/60 border-l-2 border-slate-400 dark:border-slate-600 font-sans text-xs leading-relaxed text-slate-700 dark:text-slate-300">
            <strong className="block text-slate-900 dark:text-slate-100 font-semibold mb-1">
              Objectif d'apprentissage :
            </strong>
            <MarkdownRenderer content={chapter.competencyGoal} inline={true} />
          </div>

          <div className="text-base sm:text-lg leading-relaxed text-slate-800 dark:text-slate-200">
            <MarkdownRenderer content={chapter.introduction} />
          </div>
        </section>

        {/* SECTIONS DIDACTIQUES */}
        <div className="space-y-16">
          {chapter.sections.map((section, sIdx) => (
            <section key={section.id} className="space-y-6 pt-6 border-t border-slate-100 dark:border-slate-900">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                {section.title}
              </h2>

              {section.quebecPedagogicalNote && (
                <div className="py-2 px-3 border-l-2 border-amber-500/80 font-sans text-xs text-amber-900 dark:text-amber-200 bg-amber-50/40 dark:bg-amber-950/20">
                  <MarkdownRenderer content={section.quebecPedagogicalNote} inline={true} />
                </div>
              )}

              <div className="text-base leading-relaxed text-slate-800 dark:text-slate-200">
                <MarkdownRenderer content={section.contentMarkdown} />
              </div>

              {section.codeSnippets?.map((snippet, snipIdx) => (
                <div key={snipIdx} className="my-6">
                  <JavaCodeBlock
                    code={snippet.code}
                    filename={snippet.filename}
                    explanation={snippet.explanation}
                  />
                </div>
              ))}
            </section>
          ))}
        </div>

        {/* VISUALISEUR MÉMOIRE SI CHAPITRE 1 */}
        {chapter.id === 'chapitre-1' && (
          <div className="my-8">
            <MemoryVisualizer />
          </div>
        )}

        {/* EXERCICES PRATIQUES MINIMALISTES */}
        {chapter.exercises && chapter.exercises.length > 0 && (
          <section className="space-y-8 pt-10 border-t border-slate-200 dark:border-slate-800">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white font-sans tracking-tight">
              Exercices & Pratique
            </h3>

            <div className="space-y-6">
              {chapter.exercises.map((ex) => (
                <div
                  key={ex.id}
                  className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3 font-sans text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white text-sm">
                      {ex.number}. {ex.title}
                    </span>
                    <span className="text-[11px] text-slate-500">{ex.difficulty}</span>
                  </div>

                  <p className="text-slate-600 dark:text-slate-300">{ex.contextQuebec}</p>

                  <button
                    onClick={() => toggleSolution(ex.id)}
                    className="text-blue-600 dark:text-blue-400 font-medium hover:underline cursor-pointer flex items-center gap-1"
                  >
                    {revealedSolutions[ex.id] ? (
                      <>
                        <EyeOff className="h-3.5 w-3.5" /> Masquer le corrigé
                      </>
                    ) : (
                      <>
                        <Eye className="h-3.5 w-3.5" /> Consulter le corrigé
                      </>
                    )}
                  </button>

                  {revealedSolutions[ex.id] && (
                    <div className="pt-2">
                      <JavaCodeBlock
                        code={ex.solutionCode}
                        filename={`Solution_${ex.number}.java`}
                        explanation={ex.explanation}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* AUTO-ÉVALUATION MINIMALISTE */}
        {chapter.quiz && chapter.quiz.length > 0 && (
          <section className="space-y-6 pt-10 border-t border-slate-200 dark:border-slate-800 font-sans">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Validation des connaissances
            </h3>

            <div className="space-y-4">
              {chapter.quiz.map((q, idx) => (
                <div key={q.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-2">
                  <div className="font-semibold text-slate-900 dark:text-slate-100">
                    {idx + 1}. {q.question}
                  </div>
                  <div className="space-y-1">
                    {q.options.map((opt, oIdx) => {
                      const isSelected = selectedQuizAnswers[q.id] === oIdx;
                      return (
                        <button
                          key={oIdx}
                          onClick={() => handleSelectQuizOption(q.id, oIdx)}
                          className={`w-full text-left p-2 rounded text-xs transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-medium'
                              : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                  {selectedQuizAnswers[q.id] !== undefined && (
                    <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-100 dark:border-slate-800">
                      {q.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ACTION FINALE : VALIDATION DU CHAPITRE */}
        <div className="pt-8 pb-12 flex justify-center font-sans">
          <button
            onClick={() => onMarkChapterCompleted(chapter.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
              isCompleted
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:opacity-90'
            }`}
          >
            <CheckCircle className="h-4 w-4" />
            {isCompleted ? 'Chapitre complété avec succès' : 'Marquer ce chapitre comme terminé'}
          </button>
        </div>
      </article>

      {/* PILULE DE NAVIGATION FLOTTANTE MINIMALISTE (BOTTOM FLOATING BAR) */}
      <nav aria-label="Navigation du chapitre" className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 px-4 py-2 rounded-full bg-slate-900/90 dark:bg-slate-800/90 backdrop-blur-md text-white shadow-xl border border-white/10 text-xs font-sans">
        {hasPrev ? (
          <button
            onClick={onPrevChapter}
            className="flex items-center gap-1 hover:text-slate-300 cursor-pointer"
            title="Chapitre précédent"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Précédent</span>
          </button>
        ) : (
          <span className="text-slate-500">Précédent</span>
        )}

        <span className="text-slate-500">•</span>
        <span className="font-semibold truncate max-w-[150px] sm:max-w-[200px]">
          Chapitre {chapter.number}
        </span>
        <span className="text-slate-500">•</span>

        {hasNext ? (
          <button
            onClick={onNextChapter}
            className="flex items-center gap-1 hover:text-slate-300 cursor-pointer"
            title="Chapitre suivant"
          >
            <span className="hidden sm:inline">Suivant</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        ) : (
          <span className="text-slate-500">Suivant</span>
        )}
      </nav>
    </div>
  );
};
