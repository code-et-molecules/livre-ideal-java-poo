import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Moon,
  CheckCircle,
  Eye,
  EyeOff,
  Code2,
  Shield,
  HelpCircle,
  Terminal,
  Layers,
  Sparkles,
  Award,
} from 'lucide-react';
import { Chapter, ThemeMode, FontFamily, FontSize } from '../types';
import { JavaCodeBlock } from './JavaCodeBlock';
import { MarkdownRenderer } from './MarkdownRenderer';
import { MemoryVisualizer } from './MemoryVisualizer';

interface SophisticatedDarkReaderViewProps {
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

export const SophisticatedDarkReaderView: React.FC<SophisticatedDarkReaderViewProps> = ({
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
    <div className="w-full min-h-screen bg-[#080a0f] text-[#e2e8f0] py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* HERO HEADER OBSIDIAN LUXE */}
        <div className="relative rounded-2xl bg-gradient-to-b from-[#111624] via-[#0d121c] to-[#0a0d14] border border-[#1e293b] p-6 sm:p-10 shadow-2xl overflow-hidden">
          {/* Subtle ambient light */}
          <div className="absolute top-0 right-1/4 w-96 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-96 h-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-1 rounded-md text-[11px] font-mono tracking-wider bg-[#1b2234] border border-[#2d3a54] text-cyan-400 uppercase font-semibold">
                  DEVIS 420.B0
                </span>
                <span className="text-xs text-slate-500">|</span>
                <span className="text-xs text-amber-400 font-medium flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5" />
                  Sophisticated Dark Studio
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                <span className="text-slate-500 font-mono mr-3">
                  0{chapter.number}.
                </span>
                {chapter.title}
              </h1>

              <p className="text-sm sm:text-base text-slate-400 max-w-2xl font-normal">
                {chapter.subtitle}
              </p>
            </div>

            <div className="shrink-0 flex flex-col items-start md:items-end gap-3">
              <button
                onClick={() => onMarkChapterCompleted(chapter.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wide border cursor-pointer transition-all ${
                  isCompleted
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700 shadow-md shadow-emerald-950/50'
                    : 'bg-[#182030] hover:bg-[#202b40] text-slate-200 border-[#2d3a54]'
                }`}
              >
                <CheckCircle className="h-4 w-4 text-emerald-400" />
                {isCompleted ? 'Validé avec succès' : 'Marquer comme validé'}
              </button>
              <div className="text-[11px] font-mono text-slate-500">
                {chapter.estimatedPages} pages • Java 21 LTS
              </div>
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-[#1a2334] text-xs text-slate-400 leading-relaxed">
            <span className="font-mono text-cyan-400 uppercase tracking-wider text-[10px] block mb-1">
              Objectif ministériel
            </span>
            {chapter.competencyGoal}
          </div>
        </div>

        {/* INTRODUCTION DANS UN CADRE SOMBRE ÉPURÉ */}
        <div className="rounded-2xl bg-[#0c1018] border border-[#1a2334] p-6 sm:p-8 text-sm sm:text-base leading-relaxed text-slate-300">
          <div className="font-mono text-[11px] uppercase tracking-widest text-slate-500 mb-3 flex items-center gap-2">
            <Terminal className="h-3.5 w-3.5 text-cyan-400" />
            Introduction didactique
          </div>
          <MarkdownRenderer content={chapter.introduction} />
        </div>

        {/* SECTIONS */}
        <div className="space-y-8">
          {chapter.sections.map((sec, idx) => (
            <div
              key={sec.id}
              className="rounded-2xl bg-[#0c1018] border border-[#192234] p-6 sm:p-9 space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#182233] gap-2">
                <div>
                  <div className="font-mono text-[11px] text-cyan-400 uppercase tracking-widest">
                    Section {idx + 1} • {sec.estimatedPages} pages
                  </div>
                  <h2 className="text-2xl font-bold text-white mt-1">
                    {sec.title}
                  </h2>
                </div>
              </div>

              {sec.quebecPedagogicalNote && (
                <div className="rounded-xl p-4 bg-[#14120b] border-l-2 border-amber-500/80 text-xs text-amber-200/90 space-y-1">
                  <div className="font-mono uppercase text-[10px] text-amber-400 font-bold tracking-wider">
                    Note pédagogique collégiale
                  </div>
                  <MarkdownRenderer content={sec.quebecPedagogicalNote} inline={true} />
                </div>
              )}

              <div className="text-sm sm:text-base leading-relaxed text-slate-300">
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
          ))}
        </div>

        {/* VISUALISEUR MÉMOIRE SI CHAPITRE 1 */}
        {chapter.id === 'chapitre-1' && (
          <div className="rounded-2xl bg-[#0c1018] border border-[#192234] p-6 sm:p-8">
            <MemoryVisualizer />
          </div>
        )}

        {/* ATELIERS LABO */}
        {chapter.exercises && chapter.exercises.length > 0 && (
          <div className="rounded-2xl bg-[#0c1018] border border-[#192234] p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#182233]">
              <div className="flex items-center gap-2">
                <Code2 className="h-5 w-5 text-cyan-400" />
                <h3 className="text-xl font-bold text-white">
                  Laboratoires de programmation
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-500">
                {chapter.exercises.length} exercices
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {chapter.exercises.map((ex) => (
                <div
                  key={ex.id}
                  className="rounded-xl bg-[#090d14] border border-[#1b2538] p-5 space-y-3 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-mono text-cyan-400 font-semibold">
                        Lab {ex.number}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#141b2a] text-slate-300 border border-[#232f48]">
                        {ex.difficulty}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white">{ex.title}</h4>
                    <p className="text-xs text-slate-400 mt-1">{ex.contextQuebec}</p>
                  </div>

                  <div className="pt-2 border-t border-[#172032] flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-500">
                      {ex.instructions.length} directives
                    </span>
                    <button
                      onClick={() => toggleSolution(ex.id)}
                      className="text-xs font-mono text-cyan-400 hover:text-cyan-300 cursor-pointer flex items-center gap-1"
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

        {/* QUIZ */}
        {chapter.quiz && chapter.quiz.length > 0 && (
          <div className="rounded-2xl bg-[#0c1018] border border-[#192234] p-6 sm:p-8 space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-[#182233]">
              <HelpCircle className="h-5 w-5 text-cyan-400" />
              <h3 className="text-xl font-bold text-white">
                Contrôle de connaissances
              </h3>
            </div>

            <div className="space-y-4">
              {chapter.quiz.map((q, idx) => (
                <div
                  key={q.id}
                  className="rounded-xl bg-[#090d14] border border-[#1b2538] p-5 space-y-3"
                >
                  <div className="text-sm font-semibold text-slate-200">
                    <span className="text-cyan-400 font-mono mr-2">Q{idx + 1}.</span>
                    {q.question}
                  </div>
                  <div className="space-y-2">
                    {q.options.map((opt, oIdx) => {
                      const isSelected = selectedQuizAnswers[q.id] === oIdx;
                      return (
                        <button
                          key={oIdx}
                          onClick={() => handleSelectQuizOption(q.id, oIdx)}
                          className={`w-full text-left p-3 rounded-lg text-xs font-mono transition-colors cursor-pointer border ${
                            isSelected
                              ? 'bg-cyan-950/80 border-cyan-500 text-cyan-200'
                              : 'bg-[#0e1420] border-[#1c273c] text-slate-300 hover:border-slate-600'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                  {selectedQuizAnswers[q.id] !== undefined && (
                    <div className="text-xs text-slate-400 pt-1 font-mono">
                      <strong className="text-cyan-400">Analyse : </strong> {q.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* NAVIGATION BAS DE PAGE */}
        <div className="flex items-center justify-between pt-4 pb-12">
          {hasPrev ? (
            <button
              onClick={onPrevChapter}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#121826] border border-[#222f46] text-xs font-mono text-slate-300 hover:bg-[#182236] transition-colors cursor-pointer"
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
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-xs font-mono font-semibold text-white transition-colors cursor-pointer"
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
