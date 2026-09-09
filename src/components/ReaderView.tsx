import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  GraduationCap,
  AlertTriangle,
  Lightbulb,
  CheckCircle,
  Eye,
  EyeOff,
  HelpCircle,
  Layers,
  Code2,
} from 'lucide-react';
import { Chapter, Exercise, QuizQuestion, Section, ThemeMode, FontFamily, FontSize } from '../types';
import { JavaCodeBlock } from './JavaCodeBlock';
import { MemoryVisualizer } from './MemoryVisualizer';
import { MarkdownRenderer } from './MarkdownRenderer';

interface ReaderViewProps {
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

export const ReaderView: React.FC<ReaderViewProps> = ({
  chapter,
  onNextChapter,
  onPrevChapter,
  hasNext,
  hasPrev,
  themeMode,
  fontFamily,
  fontSize,
  onMarkChapterCompleted,
  isCompleted,
}) => {
  const [revealedSolutions, setRevealedSolutions] = useState<Record<string, boolean>>({});
  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState<Record<string, number>>({});
  const [showMemorySimulator, setShowMemorySimulator] = useState(chapter.id === 'chapitre-1');

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

  // Classes de typographie
  const fontClass = fontFamily === 'serif' ? 'font-serif-book' : 'font-sans-ui';

  const textSizeClasses: Record<FontSize, { body: string; h1: string; h2: string; h3: string }> = {
    sm: {
      body: 'text-[15px] leading-relaxed',
      h1: 'text-2xl',
      h2: 'text-xl',
      h3: 'text-base',
    },
    base: {
      body: 'text-[17px] leading-[1.75]',
      h1: 'text-3xl',
      h2: 'text-2xl',
      h3: 'text-lg',
    },
    lg: {
      body: 'text-[19px] leading-[1.8]',
      h1: 'text-4xl',
      h2: 'text-3xl',
      h3: 'text-xl',
    },
    xl: {
      body: 'text-[21px] leading-[1.85]',
      h1: 'text-5xl',
      h2: 'text-4xl',
      h3: 'text-2xl',
    },
  };

  return (
    <article className={`max-w-4xl mx-auto px-4 sm:px-8 py-8 sm:py-12 ${fontClass}`}>
      {/* En-tête de chapitre */}
      <header className="border-b border-slate-200 pb-8 dark:border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <span className="text-blue-600 dark:text-blue-400 font-bold text-sm uppercase tracking-wide">
            {typeof chapter.number === 'number'
              ? `Chapitre ${chapter.number}`
              : chapter.number}
          </span>
          <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 text-xs font-normal">
            <span>Équivalent de ~{chapter.estimatedPages} pages</span>
            {isCompleted ? (
              <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                <CheckCircle className="h-3.5 w-3.5" /> Lu
              </span>
            ) : (
              <button
                onClick={() => onMarkChapterCompleted(chapter.id)}
                className="text-blue-600 hover:underline cursor-pointer font-medium"
              >
                Marquer comme lu
              </button>
            )}
          </div>
        </div>

        {/* Titre en casse de phrase (aucun Title Case !) */}
        <h1
          className={`${textSizeClasses[fontSize].h1} font-serif text-slate-900 dark:text-slate-50 mt-2 mb-4 leading-tight font-bold`}
        >
          {chapter.title}
        </h1>

        <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-light">
          {chapter.subtitle}
        </p>

        {/* Objectif de compétence ministérielle et concepts clés */}
        <div className="mt-6 bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-2">
            <span className="text-blue-600 text-base">•</span>
            Compétence ministérielle visée (Devis 420.B0)
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            <MarkdownRenderer content={chapter.competencyGoal} inline={true} />
          </p>
        </div>

        {/* Introduction */}
        <div className="mt-4 rounded-xl bg-slate-100/70 dark:bg-slate-800/40 p-5 border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
          <span className="font-semibold text-slate-900 dark:text-white">Mise en situation : </span>
          <MarkdownRenderer content={chapter.introduction} inline={true} />
        </div>
      </header>

      {/* Outil didactique de simulation mémoire (si applicable) */}
      {(chapter.id === 'chapitre-1' || chapter.id === 'chapitre-2') && (
        <div className="my-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="h-4 w-4" />
              Laboratoire visuel interactif
            </span>
            <button
              onClick={() => setShowMemorySimulator(!showMemorySimulator)}
              className="text-xs text-indigo-600 hover:underline cursor-pointer"
            >
              {showMemorySimulator ? "Masquer le simulateur" : "Afficher le simulateur de mémoire"}
            </button>
          </div>
          {showMemorySimulator && <MemoryVisualizer />}
        </div>
      )}

      {/* Corps des sections */}
      <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
        {chapter.sections.map((section: Section) => (
          <section key={section.id} id={section.id} className="py-8 sm:py-10">
            {/* Titre de la section (aucun Title Case) */}
            <h2
              className={`${textSizeClasses[fontSize].h2} font-bold text-slate-900 dark:text-slate-100 tracking-tight`}
            >
              {section.title}
            </h2>

            {/* Note pédagogique cégep */}
            {section.quebecPedagogicalNote && (
              <div className="my-4 flex items-start gap-2.5 rounded-xl border border-sky-200 bg-sky-50/70 p-3.5 text-xs text-sky-900 dark:border-sky-900/60 dark:bg-sky-950/20 dark:text-sky-200">
                <Lightbulb className="h-4 w-4 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong className="font-semibold">Remarque collégiale québécoise : </strong>
                  <MarkdownRenderer content={section.quebecPedagogicalNote} inline={true} />
                </p>
              </div>
            )}

            {/* Contenu textuel */}
            <div
              className={`mt-4 ${textSizeClasses[fontSize].body} text-slate-800 dark:text-slate-200`}
            >
              <MarkdownRenderer content={section.contentMarkdown} />
            </div>

            {/* Diagrammes UML ou mémoire */}
            {section.diagrams && section.diagrams.length > 0 && (
              <div className="my-6 space-y-4">
                {section.diagrams.map((d, dIdx) => (
                  <div
                    key={dIdx}
                    className="rounded-2xl border border-slate-300 bg-slate-50 p-4 font-mono text-xs dark:border-slate-700 dark:bg-slate-900/90 shadow-xs"
                  >
                    <div className="font-sans text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                      Diagramme : {d.title}
                    </div>
                    <pre className="overflow-x-auto text-slate-800 dark:text-slate-200 leading-relaxed font-mono">
                      {d.asciiOrSvg}
                    </pre>
                    <p className="mt-2 font-sans text-[11px] text-slate-500 dark:text-slate-400 italic">
                      {d.caption}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Blocs de code Java */}
            {section.codeSnippets && section.codeSnippets.length > 0 && (
              <div className="mt-5 space-y-4">
                {section.codeSnippets.map((snippet, sIdx) => (
                  <JavaCodeBlock
                    key={sIdx}
                    code={snippet.code}
                    filename={snippet.filename}
                    explanation={snippet.explanation}
                  />
                ))}
              </div>
            )}
          </section>
        ))}
      </div>

      {/* Section des exercices pratiques de laboratoire */}
      {chapter.exercises.length > 0 && (
        <section className="mt-12 rounded-3xl border border-slate-200 bg-slate-50/50 p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-900/50">
          <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold uppercase tracking-wider text-xs mb-2">
            <Code2 className="h-4 w-4" />
            Travaux pratiques et exercices de laboratoire
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Ateliers pratiques adaptés au cégep
          </h2>
          <p className="text-xs text-slate-500 mt-1 mb-6">
            Mettez en application les compétences du chapitre dans des scénarios collégiaux authentiques avec corrigés complets.
          </p>

          <div className="space-y-8">
            {chapter.exercises.map((ex: Exercise) => {
              const isRevealed = !!revealedSolutions[ex.id];

              return (
                <div
                  key={ex.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900 shadow-xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                      Exercice {ex.number} : {ex.title}
                    </h3>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                        ex.difficulty === 'Débutant'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : ex.difficulty === 'Intermédiaire'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      {ex.difficulty}
                    </span>
                  </div>

                  {/* Contexte cégep */}
                  <div className="mt-3 text-xs text-slate-600 dark:text-slate-300">
                    <strong className="font-semibold text-slate-800 dark:text-slate-200">
                      Mise en contexte :{' '}
                    </strong>
                    <MarkdownRenderer content={ex.contextQuebec} inline={true} />
                  </div>

                  {/* Directives */}
                  <div className="mt-3">
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Directives de laboratoire :
                    </span>
                    <ul className="mt-1.5 list-disc list-inside space-y-1 text-xs text-slate-600 dark:text-slate-400">
                      {ex.instructions.map((ins, idx) => (
                        <li key={idx}>
                          <MarkdownRenderer content={ins} inline={true} />
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Conseils didactiques */}
                  {ex.tips && ex.tips.length > 0 && (
                    <div className="mt-3 rounded-xl bg-amber-50/60 p-3 text-xs text-amber-900 dark:bg-amber-950/20 dark:text-amber-200 border border-amber-100 dark:border-amber-900/40">
                      <span className="font-semibold">Indice de résolution : </span>
                      <MarkdownRenderer content={ex.tips.join(' ')} inline={true} />
                    </div>
                  )}

                  {/* Code d'amorce */}
                  {ex.starterCode && (
                    <div className="mt-4">
                      <span className="text-xs font-semibold text-slate-500">
                        Point de départ (starter code) :
                      </span>
                      <JavaCodeBlock code={ex.starterCode} filename="AmorceExercice.java" />
                    </div>
                  )}

                  {/* Bouton bascule corrigé officiel */}
                  <div className="mt-5 border-t border-slate-100 pt-4 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                    <span className="text-xs text-slate-500">
                      Prenez le temps d'essayer sur votre EDI avant de consulter la solution.
                    </span>
                    <button
                      onClick={() => toggleSolution(ex.id)}
                      id={`btn-solution-${ex.id}`}
                      className="px-4 py-2 bg-amber-200 hover:bg-amber-300 text-amber-900 text-xs font-bold rounded uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      {isRevealed ? (
                        <>
                          <EyeOff className="h-3.5 w-3.5" />
                          <span>Masquer le corrigé</span>
                        </>
                      ) : (
                        <>
                          <Eye className="h-3.5 w-3.5" />
                          <span>Afficher le corrigé</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Corrigé commenté */}
                  {isRevealed && (
                    <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50/30 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/20 animate-fadeIn">
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300 mb-2">
                        <CheckCircle className="h-4 w-4" />
                        <span>Corrigé type officiel et analyse didactique</span>
                      </div>
                      <JavaCodeBlock
                        code={ex.solutionCode}
                        filename={`Solution_${ex.number.replace('.', '_')}.java`}
                        explanation={ex.explanation}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Section Quiz d'auto-évaluation formative */}
      {chapter.quiz && chapter.quiz.length > 0 && (
        <section className="mt-12 rounded-3xl border border-indigo-200 bg-indigo-50/30 p-6 sm:p-8 dark:border-indigo-900/50 dark:bg-indigo-950/20">
          <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 font-bold uppercase tracking-wider text-xs mb-2">
            <HelpCircle className="h-4 w-4" />
            Auto-évaluation formative
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Validez vos acquis avant de passer au chapitre suivant
          </h2>

          <div className="mt-6 space-y-6">
            {chapter.quiz.map((q: QuizQuestion, qIndex: number) => {
              const selectedAnswer = selectedQuizAnswers[q.id];
              const hasAnswered = selectedAnswer !== undefined;
              const isCorrect = selectedAnswer === q.correctIndex;

              return (
                <div
                  key={q.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-xs"
                >
                  <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">
                    <span className="mr-1">{qIndex + 1}.</span>
                    <MarkdownRenderer content={q.question} inline={true} />
                  </div>

                  <div className="space-y-2">
                    {q.options.map((option, optIdx) => {
                      let optionStyle =
                        'border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/60';

                      if (hasAnswered) {
                        if (optIdx === q.correctIndex) {
                          optionStyle =
                            'border-emerald-500 bg-emerald-50 text-emerald-900 dark:border-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-200 font-semibold';
                        } else if (optIdx === selectedAnswer) {
                          optionStyle =
                            'border-rose-400 bg-rose-50 text-rose-900 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-200';
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          disabled={hasAnswered}
                          onClick={() => handleSelectQuizOption(q.id, optIdx)}
                          className={`w-full text-left rounded-xl border p-3 text-xs transition-colors flex items-start gap-2.5 cursor-pointer ${optionStyle}`}
                        >
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span className="leading-relaxed">
                            <MarkdownRenderer content={option} inline={true} />
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Rétroaction explicative */}
                  {hasAnswered && (
                    <div
                      className={`mt-3 rounded-xl p-3 text-xs leading-relaxed ${
                        isCorrect
                          ? 'bg-emerald-50 text-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-200'
                          : 'bg-amber-50 text-amber-900 dark:bg-amber-950/30 dark:text-amber-200'
                      }`}
                    >
                      <strong className="font-semibold">
                        {isCorrect ? 'Excellente réponse ! ' : 'Explication didactique : '}
                      </strong>
                      <MarkdownRenderer content={q.explanation} inline={true} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Grille synthèse de révision */}
      {chapter.summaryChecklist && chapter.summaryChecklist.length > 0 && (
        <section className="mt-8 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 text-xs shadow-xs">
          <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-2">
            Grille d'auto-évaluation des apprentissages (Checklist)
          </h3>
          <ul className="space-y-1.5 text-slate-600 dark:text-slate-300">
            {chapter.summaryChecklist.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle className="h-3.5 w-3.5 text-blue-600 shrink-0 mt-0.5" />
                <span>
                  <MarkdownRenderer content={item} inline={true} />
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Navigation inter-chapitres */}
      <nav className="mt-12 flex items-center justify-between border-t border-slate-200 pt-6 dark:border-slate-800 no-print">
        {hasPrev ? (
          <button
            onClick={onPrevChapter}
            id="btn-prev-chapter"
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Chapitre précédent</span>
          </button>
        ) : (
          <div />
        )}

        {hasNext ? (
          <button
            onClick={onNextChapter}
            id="btn-next-chapter"
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition-colors cursor-pointer"
          >
            <span>Chapitre suivant</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        ) : (
          <div />
        )}
      </nav>
    </article>
  );
};
