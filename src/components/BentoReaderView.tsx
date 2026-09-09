import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  GraduationCap,
  Sparkles,
  CheckCircle,
  HelpCircle,
  Code2,
  Eye,
  EyeOff,
  Layers,
  Award,
  Terminal,
} from 'lucide-react';
import { Chapter, ThemeMode, FontFamily, FontSize } from '../types';
import { JavaCodeBlock } from './JavaCodeBlock';
import { MemoryVisualizer } from './MemoryVisualizer';
import { MarkdownRenderer } from './MarkdownRenderer';

interface BentoReaderViewProps {
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

export const BentoReaderView: React.FC<BentoReaderViewProps> = ({
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
  const [activeSectionId, setActiveSectionId] = useState<string>(
    chapter.sections[0]?.id || ''
  );

  const activeSection =
    chapter.sections.find((s) => s.id === activeSectionId) || chapter.sections[0];

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

  // Calcul du score au quiz
  const quizScore = chapter.quiz.reduce((acc, q) => {
    return selectedQuizAnswers[q.id] === q.correctIndex ? acc + 1 : acc;
  }, 0);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* GRILLE BENTO PRINCIPALE */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* CARTE 1: HERO BENTO (Span 2 col) */}
        <div className="md:col-span-2 lg:col-span-3 rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-6 sm:p-7 text-white shadow-md relative overflow-hidden flex flex-col justify-between">
          <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="space-y-3 relative z-10">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-white uppercase tracking-wider">
                Chapitre {chapter.number}
              </span>
              <span className="px-3 py-1 rounded-full bg-blue-900/40 text-blue-100">
                ~{chapter.estimatedPages} pages d'étude
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/30 text-emerald-200">
                Devis québécois 420.B0
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {chapter.title}
            </h2>
            <p className="text-sm sm:text-base text-blue-100/90 font-medium">
              {chapter.subtitle}
            </p>
          </div>

          <div className="mt-5 pt-4 border-t border-white/15 relative z-10 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-blue-100">
              <GraduationCap className="h-4 w-4" />
              <span>Objectif : <strong className="text-white">{chapter.competencyGoal}</strong></span>
            </div>
            <button
              onClick={() => onMarkChapterCompleted(chapter.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                isCompleted
                  ? 'bg-emerald-500 text-white shadow-xs'
                  : 'bg-white/20 hover:bg-white/30 text-white'
              }`}
            >
              <CheckCircle className="h-4 w-4" />
              {isCompleted ? 'Chapitre validé' : 'Marquer comme lu'}
            </button>
          </div>
        </div>

        {/* CARTE 2: WIDGET QUIZ SCORE (Span 1 col) */}
        <div className="rounded-2xl bg-white dark:bg-slate-850 p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
              <span className="flex items-center gap-1.5">
                <Award className="h-4 w-4" />
                Validation POO
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                {chapter.quiz.length} QCM
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mt-2">
              Auto-évaluation
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Score actuel : <strong className="text-purple-600 dark:text-purple-400 font-bold">{quizScore} / {chapter.quiz.length}</strong>
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 mb-2">
              <div
                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${chapter.quiz.length ? (quizScore / chapter.quiz.length) * 100 : 0}%` }}
              />
            </div>
            <span className="text-[11px] text-slate-400">
              {quizScore === chapter.quiz.length && chapter.quiz.length > 0
                ? 'Excellent ! Maîtrise parfaite des concepts.'
                : 'Répondez aux questions pour valider votre assimilation.'}
            </span>
          </div>
        </div>

        {/* CARTE 3: NAVIGATION ENTRE SECTIONS DU CHAPITRE (Span 1 col) */}
        <div className="rounded-2xl bg-white dark:bg-slate-850 p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <Layers className="h-4 w-4 text-blue-600" />
            <span>Sections thématiques</span>
          </div>
          <div className="space-y-1.5">
            {chapter.sections.map((sec, idx) => (
              <button
                key={sec.id}
                onClick={() => setActiveSectionId(sec.id)}
                className={`w-full text-left p-2.5 rounded-xl text-xs transition-all cursor-pointer flex items-center justify-between ${
                  activeSectionId === sec.id
                    ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-semibold border border-blue-200 dark:border-blue-800'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <span className="truncate">
                  {idx + 1}. {sec.title.replace(/^\d+\.\s*/, '')}
                </span>
                <span className="text-[10px] text-slate-400 shrink-0 ml-1">
                  ~{sec.estimatedPages}p
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* CARTE 4: CONTENU DIDACTIQUE DE LA SECTION ACTIVE (Span 3 col) */}
        <div className="md:col-span-2 lg:col-span-3 rounded-2xl bg-white dark:bg-slate-850 p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                Section active
              </span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                {activeSection?.title}
              </h3>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">
              ~{activeSection?.estimatedPages} pages
            </span>
          </div>

          {/* Note pédagogique québécoise */}
          {activeSection?.quebecPedagogicalNote && (
            <div className="rounded-xl p-4 bg-amber-50/80 dark:bg-amber-950/40 border-l-4 border-amber-500 text-xs text-amber-900 dark:text-amber-200 space-y-1">
              <strong className="font-bold flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-amber-500" />
                Note pédagogique du cégep
              </strong>
              <MarkdownRenderer content={activeSection.quebecPedagogicalNote} inline={true} />
            </div>
          )}

          {/* Contenu Markdown formatté avec tableaux et texte */}
          <div className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            <MarkdownRenderer content={activeSection?.contentMarkdown || ''} />
          </div>

          {/* Code Snippets rattachés */}
          {activeSection?.codeSnippets && activeSection.codeSnippets.length > 0 && (
            <div className="space-y-4 pt-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Terminal className="h-4 w-4 text-blue-600" />
                Code source Java de référence
              </div>
              {activeSection.codeSnippets.map((snippet, sIdx) => (
                <JavaCodeBlock
                  key={sIdx}
                  code={snippet.code}
                  filename={snippet.filename}
                  explanation={snippet.explanation}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* SECTION BENTO : SIMULATEUR MÉMOIRE (SI CHAPITRE 1) */}
      {chapter.id === 'chapitre-1' && (
        <div className="rounded-2xl bg-white dark:bg-slate-850 p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
          <MemoryVisualizer />
        </div>
      )}

      {/* SECTION BENTO : EXERCICES & ATELIERS PRATIQUES */}
      {chapter.exercises && chapter.exercises.length > 0 && (
        <div className="rounded-2xl bg-white dark:bg-slate-850 p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Code2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Ateliers pratiques et exercices québécois
              </h3>
            </div>
            <span className="text-xs text-slate-400">
              {chapter.exercises.length} exercices disponibles
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {chapter.exercises.map((ex) => (
              <div
                key={ex.id}
                className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 bg-slate-50/50 dark:bg-slate-900/40 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-bold text-blue-600 dark:text-blue-400">
                      Exercice {ex.number}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                      {ex.difficulty}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {ex.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                    {ex.contextQuebec}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    {ex.instructions.length} consignes
                  </span>
                  <button
                    onClick={() => toggleSolution(ex.id)}
                    className="flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                  >
                    {revealedSolutions[ex.id] ? (
                      <>
                        <EyeOff className="h-3.5 w-3.5" /> Masquer corrigé
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

      {/* BARRE DE NAVIGATION PRÉCÉDENT / SUIVANT */}
      <div className="flex items-center justify-between py-4">
        {hasPrev ? (
          <button
            onClick={onPrevChapter}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
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
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-xs font-semibold text-white hover:bg-blue-700 transition-colors shadow-xs cursor-pointer"
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
