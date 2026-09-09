import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Shapes,
  CheckCircle,
  Eye,
  EyeOff,
  Code2,
  Box,
  Layers,
  HelpCircle,
  Grid,
} from 'lucide-react';
import { Chapter, ThemeMode, FontFamily, FontSize } from '../types';
import { JavaCodeBlock } from './JavaCodeBlock';
import { MarkdownRenderer } from './MarkdownRenderer';
import { MemoryVisualizer } from './MemoryVisualizer';

interface GeometricReaderViewProps {
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

export const GeometricReaderView: React.FC<GeometricReaderViewProps> = ({
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
    <div className="w-full min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* EN-TÊTE GÉOMÉTRIQUE STYLE BAUHAUS / SWISS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-12 border-2 border-slate-900 dark:border-slate-100 bg-white dark:bg-slate-900">
          {/* Bloc indicateur numérique 3 cols */}
          <div className="md:col-span-3 p-6 sm:p-8 bg-blue-600 text-white flex flex-col justify-between border-b-2 md:border-b-0 md:border-r-2 border-slate-900 dark:border-slate-100">
            <div className="space-y-1">
              <div className="font-mono text-xs uppercase tracking-widest text-blue-200">
                DEVIS 420.B0
              </div>
              <div className="text-5xl font-black tracking-tighter">
                0{chapter.number}
              </div>
            </div>

            <div className="pt-8 space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-blue-200 flex items-center gap-1.5">
                <Shapes className="h-4 w-4" />
                Geometric Balance
              </div>
              <div className="text-xs font-mono text-blue-100">
                ~{chapter.estimatedPages} pages • {chapter.sections.length} modules
              </div>
            </div>
          </div>

          {/* Bloc titre & méta 9 cols */}
          <div className="md:col-span-9 p-6 sm:p-8 flex flex-col justify-between space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="px-3 py-1 font-mono text-xs uppercase font-bold border border-slate-900 dark:border-slate-100 bg-amber-400 text-slate-900">
                JAVA 21 LTS
              </span>

              <button
                onClick={() => onMarkChapterCompleted(chapter.id)}
                className={`flex items-center gap-2 px-4 py-2 font-mono text-xs font-bold uppercase border border-slate-900 dark:border-slate-100 transition-transform active:translate-x-0.5 active:translate-y-0.5 cursor-pointer ${
                  isCompleted
                    ? 'bg-emerald-500 text-white'
                    : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-100'
                }`}
              >
                <CheckCircle className="h-4 w-4" />
                {isCompleted ? 'Statut : Validé' : 'Valider ce chapitre'}
              </button>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
                {chapter.title}
              </h1>
              <p className="text-sm sm:text-base font-medium text-slate-600 dark:text-slate-300">
                {chapter.subtitle}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-600 dark:text-slate-400">
              <strong className="text-blue-600 dark:text-blue-400 uppercase">Cible ministérielle : </strong>
              {chapter.competencyGoal}
            </div>
          </div>
        </div>

        {/* INTRODUCTION CADRÉE GÉOMÉTRIQUE */}
        <div className="border-2 border-slate-900 dark:border-slate-100 bg-white dark:bg-slate-900 p-6 sm:p-8">
          <div className="font-mono text-xs uppercase tracking-widest font-bold text-blue-600 dark:text-blue-400 mb-2">
            // Cadre d'introduction
          </div>
          <div className="text-sm sm:text-base leading-relaxed text-slate-800 dark:text-slate-200">
            <MarkdownRenderer content={chapter.introduction} />
          </div>
        </div>

        {/* GRILLE DES SECTIONS */}
        <div className="space-y-6">
          {chapter.sections.map((sec, idx) => (
            <div
              key={sec.id}
              className="border-2 border-slate-900 dark:border-slate-100 bg-white dark:bg-slate-900"
            >
              {/* Entête de section */}
              <div className="flex flex-wrap items-center justify-between p-4 bg-slate-100 dark:bg-slate-850 border-b-2 border-slate-900 dark:border-slate-100 font-mono text-xs font-bold uppercase">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-none bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 flex items-center justify-center font-black">
                    {idx + 1}
                  </span>
                  <span className="text-sm text-slate-900 dark:text-white">{sec.title}</span>
                </div>
                <span className="text-slate-500">~{sec.estimatedPages} pages</span>
              </div>

              <div className="p-6 sm:p-8 space-y-6">
                {sec.quebecPedagogicalNote && (
                  <div className="p-4 border-l-4 border-amber-500 bg-amber-50 dark:bg-amber-950/30 text-xs text-slate-800 dark:text-slate-200 space-y-1">
                    <span className="font-mono font-bold uppercase text-amber-700 dark:text-amber-400 text-[10px] block">
                      Recommandation pédagogique
                    </span>
                    <MarkdownRenderer content={sec.quebecPedagogicalNote} inline={true} />
                  </div>
                )}

                <div className="text-sm sm:text-base leading-relaxed text-slate-800 dark:text-slate-200">
                  <MarkdownRenderer content={sec.contentMarkdown} />
                </div>

                {sec.codeSnippets?.map((snip, sIdx) => (
                  <div key={sIdx} className="pt-2">
                    <JavaCodeBlock
                      code={snip.code}
                      filename={snip.filename}
                      explanation={snip.explanation}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* VISUALISEUR MÉMOIRE SI CHAPITRE 1 */}
        {chapter.id === 'chapitre-1' && (
          <div className="border-2 border-slate-900 dark:border-slate-100 bg-white dark:bg-slate-900 p-6 sm:p-8">
            <MemoryVisualizer />
          </div>
        )}

        {/* EXERCICES GÉOMÉTRIQUES */}
        {chapter.exercises && chapter.exercises.length > 0 && (
          <div className="border-2 border-slate-900 dark:border-slate-100 bg-white dark:bg-slate-900">
            <div className="p-4 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 flex items-center justify-between font-mono text-xs font-black uppercase">
              <span className="flex items-center gap-2">
                <Box className="h-4 w-4" />
                Ateliers pratiques de laboratoire
              </span>
              <span>{chapter.exercises.length} modules</span>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {chapter.exercises.map((ex) => (
                <div
                  key={ex.id}
                  className="border-2 border-slate-900 dark:border-slate-100 p-5 space-y-3 flex flex-col justify-between bg-slate-50 dark:bg-slate-850"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono mb-1">
                      <span className="font-bold text-blue-600 dark:text-blue-400">
                        EX_{ex.number}
                      </span>
                      <span className="px-2 py-0.5 font-bold uppercase bg-slate-200 dark:bg-slate-700 text-[10px]">
                        {ex.difficulty}
                      </span>
                    </div>
                    <h4 className="text-sm font-black uppercase text-slate-900 dark:text-white">
                      {ex.title}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                      {ex.contextQuebec}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-300 dark:border-slate-700 flex items-center justify-between text-xs">
                    <span className="font-mono text-[10px] text-slate-500">
                      {ex.instructions.length} directives
                    </span>
                    <button
                      onClick={() => toggleSolution(ex.id)}
                      className="font-mono font-bold uppercase text-blue-600 dark:text-blue-400 hover:underline cursor-pointer flex items-center gap-1"
                    >
                      {revealedSolutions[ex.id] ? (
                        <>
                          <EyeOff className="h-3.5 w-3.5" /> Masquer
                        </>
                      ) : (
                        <>
                          <Eye className="h-3.5 w-3.5" /> Solution
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

        {/* QUIZ DE VALIDATION GÉOMÉTRIQUE */}
        {chapter.quiz && chapter.quiz.length > 0 && (
          <div className="border-2 border-slate-900 dark:border-slate-100 bg-white dark:bg-slate-900 p-6 space-y-5">
            <div className="font-mono font-black uppercase text-sm text-slate-900 dark:text-white pb-3 border-b-2 border-slate-900 dark:border-slate-100 flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              Contrôle géométrique de connaissances
            </div>

            <div className="space-y-4">
              {chapter.quiz.map((q, idx) => (
                <div
                  key={q.id}
                  className="border border-slate-900 dark:border-slate-100 p-4 space-y-3"
                >
                  <div className="text-xs sm:text-sm font-bold font-mono">
                    [{idx + 1}] {q.question}
                  </div>
                  <div className="space-y-2 font-mono text-xs">
                    {q.options.map((opt, oIdx) => {
                      const isSelected = selectedQuizAnswers[q.id] === oIdx;
                      return (
                        <button
                          key={oIdx}
                          onClick={() => handleSelectQuizOption(q.id, oIdx)}
                          className={`w-full text-left p-2.5 border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold border-slate-900 dark:border-white'
                              : 'bg-slate-50 dark:bg-slate-850 border-slate-300 dark:border-slate-700 hover:border-slate-900'
                          }`}
                        >
                          &gt; {opt}
                        </button>
                      );
                    })}
                  </div>
                  {selectedQuizAnswers[q.id] !== undefined && (
                    <div className="text-xs text-slate-600 dark:text-slate-400 pt-1 font-mono">
                      <strong>ANALYSE : </strong> {q.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* NAVIGATION BAS DE PAGE */}
        <div className="flex items-center justify-between pt-4 pb-12 font-mono text-xs font-bold uppercase">
          {hasPrev ? (
            <button
              onClick={onPrevChapter}
              className="flex items-center gap-2 px-5 py-3 border-2 border-slate-900 dark:border-slate-100 bg-white dark:bg-slate-900 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
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
              className="flex items-center gap-2 px-5 py-3 border-2 border-slate-900 dark:border-slate-100 bg-blue-600 text-white hover:bg-blue-700 transition-colors cursor-pointer"
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
