import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  CheckCircle,
  Eye,
  EyeOff,
  Quote,
  Feather,
  BookOpenCheck,
  Bookmark,
} from 'lucide-react';
import { Chapter, ThemeMode, FontFamily, FontSize } from '../types';
import { JavaCodeBlock } from './JavaCodeBlock';
import { MarkdownRenderer } from './MarkdownRenderer';
import { MemoryVisualizer } from './MemoryVisualizer';

interface EditorialReaderViewProps {
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

export const EditorialReaderView: React.FC<EditorialReaderViewProps> = ({
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
    <div className="w-full min-h-screen bg-[#faf9f6] dark:bg-[#151515] text-[#1c1c1c] dark:text-[#eaeaea] py-12 px-4 sm:px-6 lg:px-8 font-serif">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* EN-TÊTE ÉDITORIAL AVEC TYPOGRAPHIE CLASSIQUE */}
        <header className="border-b-2 border-stone-800 dark:border-stone-200 pb-8 space-y-6">
          <div className="flex items-center justify-between font-sans text-xs uppercase tracking-widest text-stone-500 dark:text-stone-400 border-b border-stone-300 dark:border-stone-800 pb-3">
            <span className="flex items-center gap-1.5 font-semibold">
              <Feather className="h-3.5 w-3.5" />
              Édition Collégiale • Devis 420.B0
            </span>
            <div className="flex items-center gap-4">
              <span>Fascicule {chapter.number}</span>
              <button
                onClick={() => onMarkChapterCompleted(chapter.id)}
                className={`flex items-center gap-1 text-xs cursor-pointer font-sans normal-case px-2.5 py-1 rounded transition-colors ${
                  isCompleted
                    ? 'bg-emerald-800 text-white font-medium'
                    : 'border border-stone-400 hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200'
                }`}
              >
                <CheckCircle className="h-3.5 w-3.5" />
                {isCompleted ? 'Validé' : 'Marquer comme lu'}
              </button>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="font-sans text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400">
              Chapitre {chapter.number}
            </div>
            <h1 className="text-4xl sm:text-5xl font-normal tracking-tight text-stone-900 dark:text-stone-100 font-serif leading-tight">
              {chapter.title}
            </h1>
            <p className="text-lg sm:text-xl text-stone-600 dark:text-stone-400 italic font-serif">
              {chapter.subtitle}
            </p>
          </div>

          <div className="font-sans text-xs text-stone-500 dark:text-stone-400 flex flex-wrap items-center justify-between gap-2 pt-2">
            <span>Volume I : Fondements et Paradigmes Objets</span>
            <span>Longueur estimée : ~{chapter.estimatedPages} pages d'étude</span>
          </div>
        </header>

        {/* CITATION OU OBJECTIF ÉDITORIAL */}
        <div className="p-6 rounded-r-xl border-l-4 border-stone-800 dark:border-stone-200 bg-stone-100/70 dark:bg-stone-900/70 space-y-2">
          <div className="font-sans text-[11px] font-bold uppercase tracking-widest text-stone-600 dark:text-stone-400 flex items-center gap-1.5">
            <Quote className="h-3.5 w-3.5 text-stone-800 dark:text-stone-200" />
            Visée pédagogique du chapitre
          </div>
          <p className="text-base text-stone-800 dark:text-stone-200 leading-relaxed italic">
            "{chapter.competencyGoal}"
          </p>
        </div>

        {/* INTRODUCTION */}
        <section className="text-lg leading-relaxed text-stone-800 dark:text-stone-200 space-y-4">
          <MarkdownRenderer content={chapter.introduction} />
        </section>

        {/* SÉPARATEUR ÉDITORIAL D'ORNEMENT */}
        <div className="flex items-center justify-center gap-3 py-4 text-stone-400">
          <div className="w-16 h-px bg-stone-300 dark:bg-stone-700" />
          <span className="text-sm font-sans tracking-widest">§</span>
          <div className="w-16 h-px bg-stone-300 dark:bg-stone-700" />
        </div>

        {/* SECTIONS */}
        <div className="space-y-12">
          {chapter.sections.map((sec, idx) => (
            <article key={sec.id} className="space-y-6">
              <div className="border-b border-stone-300 dark:border-stone-800 pb-3 flex items-baseline justify-between">
                <h2 className="text-2xl sm:text-3xl font-serif text-stone-950 dark:text-stone-50">
                  {sec.title}
                </h2>
                <span className="font-sans text-xs text-stone-500">
                  ~{sec.estimatedPages} pages
                </span>
              </div>

              {sec.quebecPedagogicalNote && (
                <div className="p-4 rounded bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-xs font-sans text-amber-900 dark:text-amber-200 space-y-1">
                  <span className="font-bold block uppercase tracking-wider text-[10px] text-amber-800 dark:text-amber-300">
                    Remarque terminologique & Devis
                  </span>
                  <MarkdownRenderer content={sec.quebecPedagogicalNote} inline={true} />
                </div>
              )}

              <div className="text-base sm:text-lg leading-relaxed text-stone-800 dark:text-stone-200">
                <MarkdownRenderer content={sec.contentMarkdown} />
              </div>

              {sec.codeSnippets?.map((snip, sIdx) => (
                <div key={sIdx} className="font-sans pt-2">
                  <JavaCodeBlock
                    code={snip.code}
                    filename={snip.filename}
                    explanation={snip.explanation}
                  />
                </div>
              ))}
            </article>
          ))}
        </div>

        {/* VISUALISEUR MÉMOIRE SI CHAPITRE 1 */}
        {chapter.id === 'chapitre-1' && (
          <div className="font-sans rounded-xl border border-stone-300 dark:border-stone-800 p-6 bg-white dark:bg-stone-900">
            <MemoryVisualizer />
          </div>
        )}

        {/* EXERCICES ÉDITORIAUX */}
        {chapter.exercises && chapter.exercises.length > 0 && (
          <section className="border-t-2 border-stone-800 dark:border-stone-200 pt-8 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-stone-300 dark:border-stone-800">
              <h3 className="text-2xl font-serif text-stone-950 dark:text-stone-50">
                Travaux dirigés et exercices
              </h3>
              <span className="font-sans text-xs text-stone-500">
                {chapter.exercises.length} problèmes
              </span>
            </div>

            <div className="space-y-6">
              {chapter.exercises.map((ex) => (
                <div
                  key={ex.id}
                  className="p-5 rounded-lg border border-stone-300 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 space-y-3"
                >
                  <div className="flex items-center justify-between font-sans text-xs">
                    <span className="font-bold text-stone-900 dark:text-stone-100">
                      Problème {ex.number} — {ex.title}
                    </span>
                    <span className="italic text-stone-500">{ex.difficulty}</span>
                  </div>

                  <p className="text-sm text-stone-700 dark:text-stone-300 italic">
                    {ex.contextQuebec}
                  </p>

                  <div className="font-sans text-xs flex items-center justify-between pt-2 border-t border-stone-200 dark:border-stone-800">
                    <span className="text-stone-500">
                      {ex.instructions.length} consignes méthodologiques
                    </span>
                    <button
                      onClick={() => toggleSolution(ex.id)}
                      className="font-semibold text-rose-700 dark:text-rose-400 hover:underline cursor-pointer flex items-center gap-1"
                    >
                      {revealedSolutions[ex.id] ? (
                        <>
                          <EyeOff className="h-3.5 w-3.5" /> Masquer la résolution
                        </>
                      ) : (
                        <>
                          <Eye className="h-3.5 w-3.5" /> Consulter la résolution
                        </>
                      )}
                    </button>
                  </div>

                  {revealedSolutions[ex.id] && (
                    <div className="font-sans pt-2">
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

        {/* QUESTIONNAIRE DE VALIDATION */}
        {chapter.quiz && chapter.quiz.length > 0 && (
          <section className="border-t border-stone-300 dark:border-stone-800 pt-8 space-y-5">
            <h3 className="text-2xl font-serif text-stone-950 dark:text-stone-50">
              Questions de synthèse
            </h3>

            <div className="space-y-4 font-sans">
              {chapter.quiz.map((q, idx) => (
                <div
                  key={q.id}
                  className="p-5 rounded border border-stone-300 dark:border-stone-800 bg-white dark:bg-stone-900 space-y-3"
                >
                  <div className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                    {idx + 1}. {q.question}
                  </div>
                  <div className="space-y-2">
                    {q.options.map((opt, oIdx) => {
                      const isSelected = selectedQuizAnswers[q.id] === oIdx;
                      return (
                        <button
                          key={oIdx}
                          onClick={() => handleSelectQuizOption(q.id, oIdx)}
                          className={`w-full text-left p-2.5 rounded text-xs transition-colors cursor-pointer border ${
                            isSelected
                              ? 'bg-stone-800 text-white dark:bg-stone-200 dark:text-stone-900 font-medium'
                              : 'bg-stone-50 dark:bg-stone-850 border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                  {selectedQuizAnswers[q.id] !== undefined && (
                    <div className="text-xs text-stone-600 dark:text-stone-400 pt-1">
                      <strong>Commentaire didactique : </strong> {q.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* PIED DE PAGE NAVIGATION */}
        <div className="flex items-center justify-between pt-6 pb-12 font-sans border-t border-stone-300 dark:border-stone-800">
          {hasPrev ? (
            <button
              onClick={onPrevChapter}
              className="flex items-center gap-2 px-5 py-2.5 rounded border border-stone-400 dark:border-stone-600 text-xs font-semibold hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
              Chapitre précédent
            </button>
          ) : (
            <div />
          )}

          {hasNext ? (
            <button
              onClick={onNextChapter}
              className="flex items-center gap-2 px-5 py-2.5 rounded bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer"
            >
              Chapitre suivant
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  );
};
