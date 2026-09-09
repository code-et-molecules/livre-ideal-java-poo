import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Leaf,
  CheckCircle,
  Eye,
  EyeOff,
  Sun,
  Coffee,
  Bookmark,
  BookOpen,
  Trees,
} from 'lucide-react';
import { Chapter, ThemeMode, FontFamily, FontSize } from '../types';
import { JavaCodeBlock } from './JavaCodeBlock';
import { MarkdownRenderer } from './MarkdownRenderer';
import { MemoryVisualizer } from './MemoryVisualizer';

interface NaturalReaderViewProps {
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

export const NaturalReaderView: React.FC<NaturalReaderViewProps> = ({
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
    <div className="w-full min-h-screen bg-[#faf8f4] dark:bg-[#1a1b18] text-[#2c2e29] dark:text-[#e4e4dd] py-10 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-300">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* EN-TÊTE ÉCOLOGIQUE ET NATUREL */}
        <header className="rounded-3xl bg-[#f2ede4] dark:bg-[#232420] border border-[#e5ded2] dark:border-[#353630] p-6 sm:p-10 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#e8e0d2] dark:bg-[#2e2f29] text-[#55584e] dark:text-[#c4c6bd] font-medium">
              <Leaf className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Tons Naturels & Papier Doux</span>
              <span>•</span>
              <span>Devis 420.B0</span>
            </div>

            <button
              onClick={() => onMarkChapterCompleted(chapter.id)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                isCompleted
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-[#ded4c3] dark:bg-[#383a32] text-[#42443b] dark:text-[#e0e2d8] hover:opacity-90'
              }`}
            >
              <CheckCircle className="h-4 w-4" />
              {isCompleted ? 'Chapitre validé' : 'Marquer comme lu'}
            </button>
          </div>

          <div className="space-y-2 pt-2">
            <div className="text-xs font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
              Chapitre {chapter.number}
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1e201b] dark:text-[#f2f2ec]">
              {chapter.title}
            </h1>
            <p className="text-base sm:text-lg text-[#5a5c53] dark:text-[#b4b7ab] font-normal">
              {chapter.subtitle}
            </p>
          </div>

          <div className="pt-3 border-t border-[#e2d8c9] dark:border-[#33342d] flex flex-wrap items-center justify-between text-xs text-[#6e7166] dark:text-[#9fa295] gap-2">
            <span>Volume 1 : Programmation Orientée Objet en Java</span>
            <span>~{chapter.estimatedPages} pages • Confort de lecture oculaire</span>
          </div>
        </header>

        {/* CADRE D'OBJECTIF D'APPRENTISSAGE */}
        <div className="rounded-2xl bg-[#efe9dd] dark:bg-[#22231e] border-l-4 border-emerald-600 dark:border-emerald-500 p-5 space-y-2 text-xs leading-relaxed">
          <strong className="text-emerald-800 dark:text-emerald-300 font-bold flex items-center gap-1.5">
            <Trees className="h-4 w-4" />
            Objectif ministériel ciblé :
          </strong>
          <div className="text-[#3c3e37] dark:text-[#d0d3c6]">
            {chapter.competencyGoal}
          </div>
        </div>

        {/* INTRODUCTION DIDACTIQUE */}
        <section className="text-base leading-relaxed text-[#353730] dark:text-[#d2d4cb] space-y-4">
          <MarkdownRenderer content={chapter.introduction} />
        </section>

        {/* SECTIONS AVEC RYTHME ORGANIQUE */}
        <div className="space-y-12">
          {chapter.sections.map((section, sIdx) => (
            <article
              key={section.id}
              className="rounded-3xl bg-[#fbf9f5] dark:bg-[#20211d] border border-[#e8dfd2] dark:border-[#31332c] p-6 sm:p-9 shadow-xs space-y-6"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#ece3d6] dark:border-[#2f302a]">
                <h2 className="text-2xl font-bold text-[#1f211c] dark:text-[#f4f4ee]">
                  {section.title}
                </h2>
                <span className="text-xs px-2.5 py-1 rounded-full bg-[#eee6d9] dark:bg-[#2b2c26] text-[#5e6155] dark:text-[#abb0a2]">
                  ~{section.estimatedPages}p
                </span>
              </div>

              {section.quebecPedagogicalNote && (
                <div className="rounded-xl p-4 bg-[#f4ece0] dark:bg-[#28261e] border-l-3 border-[#c27c38] text-xs text-[#5d4629] dark:text-[#dfcaa7] space-y-1">
                  <strong className="font-semibold block text-[#844c18] dark:text-[#ebb57d]">
                    Repère québécois & Recommandation :
                  </strong>
                  <MarkdownRenderer content={section.quebecPedagogicalNote} inline={true} />
                </div>
              )}

              <div className="text-sm sm:text-base leading-relaxed text-[#3a3c35] dark:text-[#cfd2c7]">
                <MarkdownRenderer content={section.contentMarkdown} />
              </div>

              {section.codeSnippets?.map((snip, snipIdx) => (
                <div key={snipIdx} className="pt-2">
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
          <div className="rounded-3xl bg-[#f5efe5] dark:bg-[#20211d] border border-[#e8dfd2] dark:border-[#31332c] p-6 sm:p-8">
            <MemoryVisualizer />
          </div>
        )}

        {/* EXERCICES ET ATELIERS */}
        {chapter.exercises && chapter.exercises.length > 0 && (
          <section className="rounded-3xl bg-[#f6f1e8] dark:bg-[#21221e] border border-[#e7ddd0] dark:border-[#32332d] p-6 sm:p-9 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#e2d7c8] dark:border-[#2f312a]">
              <h3 className="text-xl font-bold text-[#1f211c] dark:text-[#f4f4ee] flex items-center gap-2">
                <Coffee className="h-5 w-5 text-emerald-700 dark:text-emerald-400" />
                Ateliers pratiques de laboratoire
              </h3>
              <span className="text-xs text-[#717467] dark:text-[#9ea194]">
                {chapter.exercises.length} exercices
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {chapter.exercises.map((ex) => (
                <div
                  key={ex.id}
                  className="rounded-2xl bg-[#faf7f1] dark:bg-[#262822] border border-[#e6ddd0] dark:border-[#36382f] p-5 flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-emerald-800 dark:text-emerald-400">
                        Exercice {ex.number}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#ebe2d4] dark:bg-[#34362d] text-[#55584d] dark:text-[#c4c7bc]">
                        {ex.difficulty}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-[#1f211c] dark:text-[#f0f0ea]">
                      {ex.title}
                    </h4>
                    <p className="text-xs text-[#595c52] dark:text-[#abb0a2] mt-1">
                      {ex.contextQuebec}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#ece2d4] dark:border-[#32342b] flex items-center justify-between">
                    <span className="text-[11px] text-[#7d8174]">
                      {ex.instructions.length} consignes
                    </span>
                    <button
                      onClick={() => toggleSolution(ex.id)}
                      className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer flex items-center gap-1"
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
          </section>
        )}

        {/* QUIZ D'AUTO-ÉVALUATION */}
        {chapter.quiz && chapter.quiz.length > 0 && (
          <section className="rounded-3xl bg-[#f6f1e8] dark:bg-[#21221e] border border-[#e7ddd0] dark:border-[#32332d] p-6 sm:p-9 space-y-5">
            <h3 className="text-xl font-bold text-[#1f211c] dark:text-[#f4f4ee]">
              Auto-évaluation des notions
            </h3>

            <div className="space-y-4">
              {chapter.quiz.map((q, idx) => (
                <div
                  key={q.id}
                  className="rounded-2xl bg-[#faf7f1] dark:bg-[#262822] border border-[#e6ddd0] dark:border-[#36382f] p-5 space-y-3"
                >
                  <div className="text-xs sm:text-sm font-semibold text-[#1e201b] dark:text-[#f2f2ec]">
                    {idx + 1}. {q.question}
                  </div>
                  <div className="space-y-2">
                    {q.options.map((opt, oIdx) => {
                      const isSelected = selectedQuizAnswers[q.id] === oIdx;
                      return (
                        <button
                          key={oIdx}
                          onClick={() => handleSelectQuizOption(q.id, oIdx)}
                          className={`w-full text-left p-2.5 rounded-xl text-xs transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-700 text-white font-medium'
                              : 'bg-[#ede5d8] dark:bg-[#2f312a] text-[#3c3e36] dark:text-[#d3d6cc] hover:bg-[#e4dbcc]'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                  {selectedQuizAnswers[q.id] !== undefined && (
                    <div className="text-xs text-[#62665a] dark:text-[#a6aaa0] pt-1">
                      <strong>Explication : </strong> {q.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* NAVIGATION BAS DE PAGE */}
        <div className="flex items-center justify-between pt-4 pb-12">
          {hasPrev ? (
            <button
              onClick={onPrevChapter}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#ede5d8] dark:bg-[#2b2c26] text-xs font-semibold text-[#3b3d35] dark:text-[#dcdfd6] hover:opacity-90 transition-opacity cursor-pointer"
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
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-700 text-xs font-semibold text-white hover:bg-emerald-800 transition-colors shadow-xs cursor-pointer"
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
