export type ThemeMode = 'sepia' | 'light' | 'dark' | 'cream';
export type FontFamily = 'serif' | 'sans';
export type FontSize = 'sm' | 'base' | 'lg' | 'xl';
export type DesignArchetype =
  | 'professional'
  | 'bento'
  | 'density'
  | 'minimal'
  | 'sleek'
  | 'natural'
  | 'dark'
  | 'editorial'
  | 'geometric';

export interface CodeSnippet {
  language: string;
  filename?: string;
  code: string;
  explanation?: string;
}

export interface DiagramModel {
  title: string;
  type: 'uml' | 'memory' | 'flow';
  asciiOrSvg: string;
  caption: string;
}

export interface Exercise {
  id: string;
  number: string;
  title: string;
  difficulty: 'Débutant' | 'Intermédiaire' | 'Avancé' | 'Projet intégrateur';
  contextQuebec: string;
  instructions: string[];
  tips: string[];
  starterCode?: string;
  solutionCode: string;
  explanation: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Section {
  id: string;
  title: string;
  estimatedPages: number;
  contentMarkdown: string;
  codeSnippets?: CodeSnippet[];
  diagrams?: DiagramModel[];
  quebecPedagogicalNote?: string;
}

export interface Chapter {
  id: string;
  number: number | string;
  title: string;
  subtitle: string;
  estimatedPages: number;
  competencyGoal: string;
  introduction: string;
  sections: Section[];
  exercises: Exercise[];
  quiz: QuizQuestion[];
  summaryChecklist: string[];
}

export interface Bookmark {
  chapterId: string;
  sectionId: string;
  title: string;
  createdAt: number;
}

export interface UserNote {
  id: string;
  chapterId: string;
  sectionId?: string;
  text: string;
  updatedAt: number;
}

export interface MemoryTraceStep {
  step: number;
  description: string;
  codeLine: string;
  stack: { name: string; type: string; value: string; isRef?: boolean }[];
  heap: { address: string; className: string; fields: Record<string, string> }[];
}
