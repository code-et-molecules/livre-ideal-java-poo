import { Chapter } from '../types';
import { chapter0 } from './chapters/chapter0';
import { chapter1 } from './chapters/chapter1';
import { chapter2 } from './chapters/chapter2';
import { chapter3 } from './chapters/chapter3';
import { chapter4 } from './chapters/chapter4';
import { chapter5 } from './chapters/chapter5';
import { chapter6 } from './chapters/chapter6';
import { chapter7 } from './chapters/chapter7';
import { chapter8 } from './chapters/chapter8';
import { chapter9 } from './chapters/chapter9';
import { chapter10 } from './chapters/chapter10';
import { annexes } from './chapters/annexes';

export const ALL_CHAPTERS: Chapter[] = [
  chapter0,
  chapter1,
  chapter2,
  chapter3,
  chapter4,
  chapter5,
  chapter6,
  chapter7,
  chapter8,
  chapter9,
  chapter10,
  annexes,
];

export const TOTAL_BOOK_PAGES = ALL_CHAPTERS.reduce((sum, ch) => sum + ch.estimatedPages, 0);

export function getChapterStartIndex(chapterId: string): number {
  let accumulated = 1;
  for (const ch of ALL_CHAPTERS) {
    if (ch.id === chapterId) {
      return accumulated;
    }
    accumulated += ch.estimatedPages;
  }
  return 1;
}

export function searchInBook(query: string): {
  chapter: Chapter;
  matchedSections: { sectionTitle: string; snippet: string }[];
}[] {
  if (!query || query.trim().length < 2) return [];
  const clean = query.trim().toLowerCase();

  const results: {
    chapter: Chapter;
    matchedSections: { sectionTitle: string; snippet: string }[];
  }[] = [];

  for (const chapter of ALL_CHAPTERS) {
    const matchedSections: { sectionTitle: string; snippet: string }[] = [];

    for (const sec of chapter.sections) {
      if (
        sec.title.toLowerCase().includes(clean) ||
        sec.contentMarkdown.toLowerCase().includes(clean)
      ) {
        // Extrait de texte autour de l'occurrence
        const idx = sec.contentMarkdown.toLowerCase().indexOf(clean);
        let snippet = "";
        if (idx !== -1) {
          const start = Math.max(0, idx - 60);
          const end = Math.min(sec.contentMarkdown.length, idx + clean.length + 80);
          snippet = (start > 0 ? "..." : "") + sec.contentMarkdown.substring(start, end).replace(/\n/g, ' ') + (end < sec.contentMarkdown.length ? "..." : "");
        } else {
          snippet = sec.contentMarkdown.substring(0, 120).replace(/\n/g, ' ') + "...";
        }
        matchedSections.push({
          sectionTitle: sec.title,
          snippet,
        });
      }
    }

    // Recherche dans les exercices
    for (const ex of chapter.exercises) {
      if (
        ex.title.toLowerCase().includes(clean) ||
        ex.contextQuebec.toLowerCase().includes(clean) ||
        ex.explanation.toLowerCase().includes(clean)
      ) {
        matchedSections.push({
          sectionTitle: `Exercice ${ex.number} : ${ex.title}`,
          snippet: ex.contextQuebec.substring(0, 120) + "...",
        });
      }
    }

    if (matchedSections.length > 0) {
      results.push({ chapter, matchedSections });
    }
  }

  return results;
}
