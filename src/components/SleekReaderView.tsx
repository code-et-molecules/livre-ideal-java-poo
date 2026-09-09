import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  CheckCircle,
  Eye,
  EyeOff,
  Terminal,
  Zap,
  Bookmark,
  Share2,
  Code2,
  HelpCircle,
  Clock,
  BookOpen,
} from 'lucide-react';
import { Chapter, ThemeMode, FontFamily, FontSize } from '../types';
import { JavaCodeBlock } from './JavaCodeBlock';
import { MarkdownRenderer } from './MarkdownRenderer';
import { MemoryVisualizer } from './MemoryVisualizer';

interface SleekReaderViewProps {
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

export const SleekReaderView: React.FC<SleekReaderViewProps> = ({
  chapter,
  onNextChapter,
  onPrevChapter,
  hasNext,
  hasPrev,
  onMarkChapterCompleted,
  isCompleted,
}) => {
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [revealedSolutions, setRevealedSolutions] = useState<Record<string, boolean>>({});
  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState<Record<string, number>>({});

  const activeSection = chapter.sections[activeSectionIndex] || chapter.sections[0];

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
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      {/* BANNIÈRE HERO SLEEK & POLIE */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl p-6 sm:p-10">
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-gradient-to-br from-cyan-500/15 via-blue-500/15 to-indigo-500/0 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <Zap className="h-3.5 w-3.5 text-cyan-500" />
              <span>Sleek Edition</span>
              <span className="text-slate-400">•</span>
              <span>Devis 420.B0</span>
              <span className="text-slate-400">•</span>
              <span>Chapitre {chapter.number}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {chapter.title}
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-normal">
              {chapter.subtitle}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-2">
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-cyan-500" />
                ~{chapter.estimatedPages} pages d'assimilation
              </span>
              <span>•</span>
              <span>Objectif : <strong className="text-slate-700 dark:text-slate-200">{chapter.competencyGoal}</strong></span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-3 shrink-0">
            <button
              onClick={() => onMarkChapterCompleted(chapter.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer ${
                isCompleted
                  ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                  : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90'
              }`}
            >
              <CheckCircle className="h-4 w-4" />
              {isCompleted ? 'Chapitre complété' : 'Valider ce chapitre'}
            </button>
            <span className="text-[11px] text-slate-400">
              {chapter.sections.length} sections didactiques
            </span>
          </div>
        </div>

        {/* INTRODUCTION & CONTEXTE */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          <MarkdownRenderer content={chapter.introduction} />
        </div>
      </div>

      {/* SÉLECTEUR SLEEK DES SECTIONS (PILLS) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {chapter.sections.map((sec, idx) => (
          <button
            key={sec.id}
            onClick={() => setActiveSectionIndex(idx)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
              activeSectionIndex === idx
                ? 'bg-cyan-500 text-white border-cyan-500 shadow-md shadow-cyan-500/20'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            {idx + 1}. {sec.title.replace(/^\d+\.\s*/, '')}
          </button>
        ))}
      </div>

      {/* SECTION ACTIVE : CONTENU SLEEK */}
      <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-6 sm:p-9 shadow-lg space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-bold text-cyan-600 dark:text-cyan-400">
              Section {activeSectionIndex + 1} sur {chapter.sections.length}
            </span>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {activeSection.title}
            </h2>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
            ~{activeSection.estimatedPages} pages
          </span>
        </div>

        {activeSection.quebecPedagogicalNote && (
          <div className="rounded-2xl p-4 bg-gradient-to-r from-amber-500/10 to-orange-500/5 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-amber-700 dark:text-amber-300">
              <Sparkles className="h-4 w-4" />
              Recommandation collégiale
            </div>
            <MarkdownRenderer content={activeSection.quebecPedagogicalNote} inline={true} />
          </div>
        )}

        <div className="text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300">
          <MarkdownRenderer content={activeSection.contentMarkdown} />
        </div>

        {/* Snippets de code */}
        {activeSection.codeSnippets?.map((snip, sIdx) => (
          <div key={sIdx} className="pt-2">
            <JavaCodeBlock
              code={snip.code}
              filename={snip.filename}
              explanation={snip.explanation}
            />
          </div>
        ))}
      </div>

      {/* VISUALISEUR MÉMOIRE SI CHAPITRE 1 */}
      {chapter.id === 'chapitre-1' && (
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-md">
          <MemoryVisualizer />
        </div>
      )}

      {/* ATELIERS PRATIQUES SLEEK */}
      {chapter.exercises && chapter.exercises.length > 0 && (
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-lg space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <Code2 className="h-5 w-5 text-cyan-500" />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Ateliers pratiques de programmation
              </h3>
            </div>
            <span className="text-xs text-slate-500">
              {chapter.exercises.length} exercices
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {chapter.exercises.map((ex) => (
              <div
                key={ex.id}
                className="rounded-2xl border border-slate-200/90 dark:border-slate-800/90 p-5 bg-slate-50/60 dark:bg-slate-850/60 space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-cyan-600 dark:text-cyan-400">
                      Exercice {ex.number}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300">
                      {ex.difficulty}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">
                    {ex.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                    {ex.contextQuebec}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    {ex.instructions.length} étapes
                  </span>
                  <button
                    onClick={() => toggleSolution(ex.id)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline cursor-pointer"
                  >
                    {revealedSolutions[ex.id] ? (
                      <>
                        <EyeOff className="h-3.5 w-3.5" /> Masquer
                      </>
                    ) : (
                      <>
                        <Eye className="h-3.5 w-3.5" /> Voir corrigé
                      </>
                    )}
                  </button>
                </div>

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
        </div>
      )}

      {/* AUTO-ÉVALUATION SLEEK */}
      {chapter.quiz && chapter.quiz.length > 0 && (
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-lg space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <HelpCircle className="h-5 w-5 text-cyan-500" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Validation des connaissances
            </h3>
          </div>

          <div className="space-y-4">
            {chapter.quiz.map((q, idx) => (
              <div
                key={q.id}
                className="rounded-2xl border border-slate-200/70 dark:border-slate-800/70 p-5 bg-slate-50/50 dark:bg-slate-850/50 space-y-3"
              >
                <div className="text-sm font-semibold text-slate-900 dark:text-white">
                  {idx + 1}. {q.question}
                </div>
                <div className="space-y-2">
                  {q.options.map((opt, oIdx) => {
                    const isSelected = selectedQuizAnswers[q.id] === oIdx;
                    const isSubmitted = selectedQuizAnswers[q.id] !== undefined;
                    const isCorrect = oIdx === q.correctIndex;
                    return (
                      <button
                        key={oIdx}
                        onClick={() => handleSelectQuizOption(q.id, oIdx)}
                        className={`w-full text-left px-4 py-2.5 rounded-xl text-xs transition-all cursor-pointer flex items-center justify-between border ${
                          isSelected
                            ? isCorrect
                              ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-800 dark:text-emerald-200 font-semibold'
                              : 'bg-rose-50 dark:bg-rose-950/60 border-rose-500 text-rose-800 dark:text-rose-200 font-semibold'
                            : isSubmitted && isCorrect
                            ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-400/50 text-emerald-700 dark:text-emerald-300'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                        }`}
                      >
                        <span>{opt}</span>
                        {isSubmitted && isCorrect && <span className="text-[10px] font-bold text-emerald-500">✓ Correct</span>}
                      </button>
                    );
                  })}
                </div>
                {selectedQuizAnswers[q.id] !== undefined && (
                  <div className="text-xs text-slate-500 dark:text-slate-400 p-3 rounded-xl bg-slate-100 dark:bg-slate-800">
                    <strong>Explication : </strong> {q.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PIED DE PAGE SLEEK AVEC COMMANDES DE NAVIGATION */}
      <div className="flex items-center justify-between pt-4 pb-8">
        {hasPrev ? (
          <button
            onClick={onPrevChapter}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
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
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-xs font-semibold text-white transition-colors shadow-md shadow-cyan-600/20 cursor-pointer"
          >
            Chapitre suivant
            <ChevronRight className="h-4 w-4" />
          </button>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
};
