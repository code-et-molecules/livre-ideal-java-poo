import React, { useState } from 'react';
import {
  Terminal,
  FileCode,
  BookOpen,
  CheckCircle,
  HelpCircle,
  ChevronRight,
  ChevronDown,
  Layers,
  Sparkles,
  Sliders,
  Play,
  Cpu,
  Bookmark,
} from 'lucide-react';
import { Chapter, ThemeMode, FontFamily, FontSize } from '../types';
import { JavaCodeBlock } from './JavaCodeBlock';
import { MarkdownRenderer } from './MarkdownRenderer';
import { MemoryVisualizer } from './MemoryVisualizer';

interface DensityReaderViewProps {
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

export const DensityReaderView: React.FC<DensityReaderViewProps> = ({
  chapter,
  onNextChapter,
  onPrevChapter,
  hasNext,
  hasPrev,
  onMarkChapterCompleted,
  isCompleted,
}) => {
  const [activeTab, setActiveTab] = useState<'theory' | 'code' | 'exercises' | 'quiz'>('theory');
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState<Record<string, number>>({});
  const [revealedSolutions, setRevealedSolutions] = useState<Record<string, boolean>>({});

  const currentSection = chapter.sections[activeSectionIndex] || chapter.sections[0];

  const handleSelectQuizOption = (questionId: string, optionIndex: number) => {
    setSelectedQuizAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const toggleSolution = (exerciseId: string) => {
    setRevealedSolutions((prev) => ({
      ...prev,
      [exerciseId]: !prev[exerciseId],
    }));
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] w-full overflow-hidden bg-[#090d16] text-slate-200 font-sans text-xs">
      {/* BARRE D'ONGLETS SUPÉRIEURE FAÇON IDE */}
      <div className="flex items-center justify-between border-b border-slate-800 bg-[#0d121f] px-3 py-1 text-xs select-none">
        <div className="flex items-center gap-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('theory')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-t text-xs font-mono transition-colors cursor-pointer border-t-2 ${
              activeTab === 'theory'
                ? 'bg-[#090d16] text-sky-400 border-sky-400 font-bold'
                : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-800/50'
            }`}
          >
            <BookOpen className="h-3.5 w-3.5 text-sky-400" />
            <span>Theorie_Chapitre_{chapter.number}.md</span>
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-t text-xs font-mono transition-colors cursor-pointer border-t-2 ${
              activeTab === 'code'
                ? 'bg-[#090d16] text-amber-400 border-amber-400 font-bold'
                : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-800/50'
            }`}
          >
            <FileCode className="h-3.5 w-3.5 text-amber-400" />
            <span>Exemples_Java21.java</span>
          </button>

          <button
            onClick={() => setActiveTab('exercises')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-t text-xs font-mono transition-colors cursor-pointer border-t-2 ${
              activeTab === 'exercises'
                ? 'bg-[#090d16] text-emerald-400 border-emerald-400 font-bold'
                : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-800/50'
            }`}
          >
            <Terminal className="h-3.5 w-3.5 text-emerald-400" />
            <span>Ateliers_Quebec ({chapter.exercises.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('quiz')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-t text-xs font-mono transition-colors cursor-pointer border-t-2 ${
              activeTab === 'quiz'
                ? 'bg-[#090d16] text-purple-400 border-purple-400 font-bold'
                : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-800/50'
            }`}
          >
            <HelpCircle className="h-3.5 w-3.5 text-purple-400" />
            <span>AutoEval_Test ({chapter.quiz.length})</span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
          <span className="hidden sm:inline">Devis 420.B0</span>
          <button
            onClick={() => onMarkChapterCompleted(chapter.id)}
            className={`px-2 py-0.5 rounded text-[10px] font-semibold cursor-pointer ${
              isCompleted ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            {isCompleted ? '✓ Terminé' : 'Marquer fait'}
          </button>
        </div>
      </div>

      {/* ZONE CENTRALE TRIPLE PANNEAU */}
      <div className="flex flex-1 overflow-hidden">
        {/* PANNEAU GAUCHE : ARBORESCENCE DU CHAPITRE (OUTLINE) */}
        <div className="w-56 shrink-0 border-r border-slate-800 bg-[#0c101c] overflow-y-auto p-2 space-y-3 font-mono text-[11px] hidden md:block">
          <div className="flex items-center justify-between text-slate-400 font-bold text-[10px] uppercase tracking-wider px-1">
            <span>Explorateur de structure</span>
          </div>

          <div className="space-y-1">
            <div className="text-slate-300 font-semibold px-1 flex items-center gap-1 text-[11px]">
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              <span>Chapitre {chapter.number}</span>
            </div>

            <div className="pl-4 space-y-1">
              {chapter.sections.map((sec, idx) => (
                <button
                  key={sec.id}
                  onClick={() => {
                    setActiveSectionIndex(idx);
                    setActiveTab('theory');
                  }}
                  className={`w-full text-left px-2 py-1 rounded text-[11px] truncate flex items-center gap-1.5 transition-colors cursor-pointer ${
                    activeSectionIndex === idx && activeTab === 'theory'
                      ? 'bg-sky-950 text-sky-300 font-semibold border-l-2 border-sky-400'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  <span className="text-slate-500">{idx + 1}.</span>
                  <span className="truncate">{sec.title.replace(/^\d+\.\s*/, '')}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/80 space-y-1">
            <div className="text-slate-400 text-[10px] font-bold uppercase px-1">
              Symboles & Exercices
            </div>
            {chapter.exercises.map((ex, exIdx) => (
              <button
                key={ex.id}
                onClick={() => setActiveTab('exercises')}
                className="w-full text-left px-2 py-0.5 rounded text-[10px] text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 truncate flex items-center gap-1"
              >
                <span className="text-amber-400 font-mono">def</span>
                <span className="truncate">{ex.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* PANNEAU CENTRAL : CONTENU PRINCIPAL DENSE */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#090d16] space-y-5">
          {activeTab === 'theory' && (
            <div className="space-y-4 max-w-4xl">
              {/* Entête de section */}
              <div className="pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2 text-sky-400 font-mono text-[11px]">
                  <span>SECTION {activeSectionIndex + 1} / {chapter.sections.length}</span>
                  <span>•</span>
                  <span>~{currentSection?.estimatedPages} pages</span>
                </div>
                <h2 className="text-xl font-bold text-white mt-1">
                  {currentSection?.title}
                </h2>
              </div>

              {/* Note québécoise compacte */}
              {currentSection?.quebecPedagogicalNote && (
                <div className="rounded border-l-2 border-amber-400 bg-amber-950/30 p-2.5 text-xs text-amber-200">
                  <strong className="text-amber-300 font-bold block mb-1">
                    Directives collégiales (Québec) :
                  </strong>
                  <MarkdownRenderer content={currentSection.quebecPedagogicalNote} inline={true} />
                </div>
              )}

              {/* Contenu Markdown formatté */}
              <div className="text-slate-300 text-xs leading-relaxed">
                <MarkdownRenderer content={currentSection?.contentMarkdown || ''} />
              </div>

              {/* Snippets Java */}
              {currentSection?.codeSnippets?.map((snip, i) => (
                <JavaCodeBlock
                  key={i}
                  code={snip.code}
                  filename={snip.filename}
                  explanation={snip.explanation}
                />
              ))}

              {chapter.id === 'chapitre-1' && (
                <div className="mt-4">
                  <MemoryVisualizer />
                </div>
              )}
            </div>
          )}

          {activeTab === 'code' && (
            <div className="space-y-4 max-w-4xl">
              <div className="text-xs text-slate-400 flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="font-mono text-amber-400 font-bold">
                  Code source Java 21 LTS du chapitre
                </span>
                <span>Exemples complets conformes aux normes CEGEP</span>
              </div>
              {chapter.sections
                .flatMap((s) => s.codeSnippets || [])
                .map((snip, idx) => (
                  <JavaCodeBlock
                    key={idx}
                    code={snip.code}
                    filename={snip.filename || `Exemple_${idx + 1}.java`}
                    explanation={snip.explanation}
                  />
                ))}
            </div>
          )}

          {activeTab === 'exercises' && (
            <div className="space-y-4 max-w-4xl">
              <div className="text-xs text-slate-400 pb-2 border-b border-slate-800 font-mono">
                Ateliers pratiques — Total : {chapter.exercises.length} exercices
              </div>
              {chapter.exercises.map((ex) => (
                <div
                  key={ex.id}
                  className="rounded-lg border border-slate-800 bg-[#0c101c] p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 font-mono font-bold text-[10px]">
                        Exercice {ex.number}
                      </span>
                      <h4 className="text-sm font-bold text-white">{ex.title}</h4>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {ex.difficulty}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">{ex.contextQuebec}</p>
                  <ul className="list-disc list-inside text-xs text-slate-400 space-y-1">
                    {ex.instructions.map((ins, i) => (
                      <li key={i}>{ins}</li>
                    ))}
                  </ul>

                  <button
                    onClick={() => toggleSolution(ex.id)}
                    className="text-xs font-mono text-sky-400 hover:underline cursor-pointer"
                  >
                    {revealedSolutions[ex.id] ? '[-] Masquer le code solution' : '[+] Dévoiler le code solution'}
                  </button>

                  {revealedSolutions[ex.id] && (
                    <JavaCodeBlock
                      code={ex.solutionCode}
                      filename={`Solution_${ex.number}.java`}
                      explanation={ex.explanation}
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'quiz' && (
            <div className="space-y-4 max-w-3xl">
              <div className="text-xs text-slate-400 pb-2 border-b border-slate-800 font-mono">
                Validation des compétences — {chapter.quiz.length} questions
              </div>
              {chapter.quiz.map((q, qIdx) => (
                <div
                  key={q.id}
                  className="rounded-lg border border-slate-800 bg-[#0c101c] p-4 space-y-3"
                >
                  <div className="text-xs font-semibold text-white">
                    {qIdx + 1}. {q.question}
                  </div>
                  <div className="space-y-1.5">
                    {q.options.map((opt, oIdx) => {
                      const isSelected = selectedQuizAnswers[q.id] === oIdx;
                      const isSubmitted = selectedQuizAnswers[q.id] !== undefined;
                      const isCorrect = oIdx === q.correctIndex;
                      return (
                        <button
                          key={oIdx}
                          onClick={() => handleSelectQuizOption(q.id, oIdx)}
                          className={`w-full text-left p-2 rounded text-xs transition-colors cursor-pointer flex items-center justify-between ${
                            isSelected
                              ? isCorrect
                                ? 'bg-emerald-950 text-emerald-200 border border-emerald-800'
                                : 'bg-rose-950 text-rose-200 border border-rose-800'
                              : isSubmitted && isCorrect
                              ? 'bg-emerald-950/40 text-emerald-300'
                              : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800/60'
                          }`}
                        >
                          <span>{opt}</span>
                          {isSubmitted && isCorrect && <span className="text-[10px] text-emerald-400 font-bold">✓ Juste</span>}
                        </button>
                      );
                    })}
                  </div>
                  {selectedQuizAnswers[q.id] !== undefined && (
                    <div className="text-[11px] text-slate-400 bg-slate-900 p-2 rounded border border-slate-800">
                      <strong>Explication : </strong> {q.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* PANNEAU DROIT : INSPECTEUR TECHNIQUE & LEXIQUE (240px) */}
        <div className="w-60 shrink-0 border-l border-slate-800 bg-[#0c101c] overflow-y-auto p-3 space-y-4 font-mono text-[11px] hidden lg:block">
          <div className="text-slate-400 font-bold text-[10px] uppercase tracking-wider pb-1 border-b border-slate-800">
            Inspecteur & Diagnostic
          </div>

          <div className="space-y-1 text-slate-300">
            <div className="text-[10px] text-slate-500 uppercase">Devis ministériel</div>
            <div className="font-semibold text-sky-400">420.B0 (00Q2)</div>
          </div>

          <div className="space-y-1 text-slate-300">
            <div className="text-[10px] text-slate-500 uppercase">Compétence cible</div>
            <div className="text-[11px] text-slate-300 leading-tight">
              {chapter.competencyGoal}
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-800">
            <div className="text-[10px] text-slate-500 uppercase">Aide-mémoire syntaxique</div>
            <div className="p-2 rounded bg-slate-900 border border-slate-800 text-[10px] space-y-1">
              <div><span className="text-rose-400">class</span> NomClasse &#123; &#125;</div>
              <div><span className="text-rose-400">record</span> Nom(<span className="text-sky-300">...</span>) &#123; &#125;</div>
              <div><span className="text-rose-400">@Override</span></div>
              <div><span className="text-rose-400">super</span>.<span className="text-amber-300">methode</span>();</div>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-800">
            <div className="text-[10px] text-slate-500 uppercase">État de la compilation</div>
            <div className="flex items-center gap-1.5 text-emerald-400 text-[10px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
              <span>JVM Java 21 — Build clean</span>
            </div>
          </div>
        </div>
      </div>

      {/* BARRE D'ÉTAT INFÉRIEURE FAÇON IDE */}
      <div className="h-6 shrink-0 bg-[#0d121f] border-t border-slate-800 flex items-center justify-between px-3 text-[10px] font-mono text-slate-400 select-none">
        <div className="flex items-center gap-3">
          <span className="text-sky-400 font-bold">OpenJ9 / HotSpot 21</span>
          <span>Encodage: UTF-8</span>
          <span>LF: Linux</span>
        </div>
        <div className="flex items-center gap-3">
          <span>Chapitre {chapter.number}</span>
          <span>Page {chapter.estimatedPages}p</span>
          <div className="flex gap-2">
            {hasPrev && (
              <button onClick={onPrevChapter} className="hover:text-white cursor-pointer">
                ◀ Préc.
              </button>
            )}
            {hasNext && (
              <button onClick={onNextChapter} className="hover:text-white cursor-pointer">
                Suiv. ▶
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
