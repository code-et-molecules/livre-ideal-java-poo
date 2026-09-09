import React, { useState, useEffect } from 'react';
import { ALL_CHAPTERS, TOTAL_BOOK_PAGES, getChapterStartIndex } from './data/allChapters';
import { Header } from './components/Header';
import { SidebarToc } from './components/SidebarToc';
import { ReaderView } from './components/ReaderView';
import { BentoReaderView } from './components/BentoReaderView';
import { DensityReaderView } from './components/DensityReaderView';
import { MinimalReaderView } from './components/MinimalReaderView';
import { SleekReaderView } from './components/SleekReaderView';
import { NaturalReaderView } from './components/NaturalReaderView';
import { SophisticatedDarkReaderView } from './components/SophisticatedDarkReaderView';
import { EditorialReaderView } from './components/EditorialReaderView';
import { GeometricReaderView } from './components/GeometricReaderView';
import { SearchModal } from './components/SearchModal';
import { ExportDocsModal } from './components/ExportDocsModal';
import { ThemeMode, FontFamily, FontSize, DesignArchetype } from './types';

export default function App() {
  const [currentChapterId, setCurrentChapterId] = useState<string>(() => {
    return localStorage.getItem('cegep_java_last_chapter') || 'chapitre-0';
  });

  const [currentDesign, setCurrentDesign] = useState<DesignArchetype>(() => {
    return 'professional';
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [exportDocsOpen, setExportDocsOpen] = useState(false);

  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    return (localStorage.getItem('cegep_java_theme') as ThemeMode) || 'light';
  });

  const [fontFamily, setFontFamily] = useState<FontFamily>(() => {
    return (localStorage.getItem('cegep_java_font') as FontFamily) || 'serif';
  });

  const [fontSize, setFontSize] = useState<FontSize>(() => {
    return (localStorage.getItem('cegep_java_fontsize') as FontSize) || 'base';
  });

  const [readChapterIds, setReadChapterIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('cegep_java_completed_chapters');
      return saved ? JSON.parse(saved) : ['chapitre-0'];
    } catch {
      return ['chapitre-0'];
    }
  });

  // Sauvegarde des préférences
  useEffect(() => {
    localStorage.setItem('cegep_java_last_chapter', currentChapterId);
  }, [currentChapterId]);

  useEffect(() => {
    localStorage.setItem('cegep_java_design', currentDesign);
  }, [currentDesign]);

  useEffect(() => {
    localStorage.setItem('cegep_java_theme', themeMode);
  }, [themeMode]);

  useEffect(() => {
    localStorage.setItem('cegep_java_font', fontFamily);
  }, [fontFamily]);

  useEffect(() => {
    localStorage.setItem('cegep_java_fontsize', fontSize);
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem('cegep_java_completed_chapters', JSON.stringify(readChapterIds));
  }, [readChapterIds]);

  // Raccourcis clavier (Ctrl+K pour la recherche)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const currentChapterIndex = ALL_CHAPTERS.findIndex((c) => c.id === currentChapterId);
  const currentChapter = ALL_CHAPTERS[currentChapterIndex] || ALL_CHAPTERS[0];

  const handleSelectChapter = (chapterId: string) => {
    setCurrentChapterId(chapterId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNextChapter = () => {
    if (currentChapterIndex < ALL_CHAPTERS.length - 1) {
      handleSelectChapter(ALL_CHAPTERS[currentChapterIndex + 1].id);
    }
  };

  const handlePrevChapter = () => {
    if (currentChapterIndex > 0) {
      handleSelectChapter(ALL_CHAPTERS[currentChapterIndex - 1].id);
    }
  };

  const handleMarkChapterCompleted = (chapterId: string) => {
    if (!readChapterIds.includes(chapterId)) {
      setReadChapterIds((prev) => [...prev, chapterId]);
    }
  };

  const currentPageNumber = getChapterStartIndex(currentChapter.id);

  // Thèmes d'ambiance visuelle
  const themeBackgroundClasses: Record<ThemeMode, string> = {
    light: 'bg-slate-50 text-slate-800',
    cream: 'bg-[#faf7f0] text-[#2c2a29]',
    sepia: 'bg-[#f4ecd8] text-[#3e3428]',
    dark: 'bg-slate-950 text-slate-100 dark',
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 flex flex-col ${themeBackgroundClasses[themeMode]}`}>
      {/* Barre d'en-tête */}
      <Header
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        onOpenSearch={() => setSearchOpen(true)}
        onOpenExportDocs={() => setExportDocsOpen(true)}
        themeMode={themeMode}
        setThemeMode={setThemeMode}
        fontFamily={fontFamily}
        setFontFamily={setFontFamily}
        fontSize={fontSize}
        setFontSize={setFontSize}
        currentPageNumber={currentPageNumber}
        totalBookPages={TOTAL_BOOK_PAGES}
      />

      {/* Contenu principal adaptatif selon le design sélectionné */}
      {currentDesign === 'professional' && (
        <div className="flex flex-1 mx-auto w-full max-w-7xl">
          <SidebarToc
            chapters={ALL_CHAPTERS}
            currentChapterId={currentChapter.id}
            onSelectChapter={handleSelectChapter}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            readChapterIds={readChapterIds}
          />

          <main className="flex-1 overflow-x-hidden min-w-0">
            <ReaderView
              chapter={currentChapter}
              onNextChapter={handleNextChapter}
              onPrevChapter={handlePrevChapter}
              hasNext={currentChapterIndex < ALL_CHAPTERS.length - 1}
              hasPrev={currentChapterIndex > 0}
              themeMode={themeMode}
              fontFamily={fontFamily}
              fontSize={fontSize}
              onMarkChapterCompleted={handleMarkChapterCompleted}
              isCompleted={readChapterIds.includes(currentChapter.id)}
            />
          </main>
        </div>
      )}

      {currentDesign === 'bento' && (
        <div className="flex flex-1 mx-auto w-full max-w-7xl">
          <SidebarToc
            chapters={ALL_CHAPTERS}
            currentChapterId={currentChapter.id}
            onSelectChapter={handleSelectChapter}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            readChapterIds={readChapterIds}
          />

          <main className="flex-1 overflow-x-hidden min-w-0">
            <BentoReaderView
              chapter={currentChapter}
              onNextChapter={handleNextChapter}
              onPrevChapter={handlePrevChapter}
              hasNext={currentChapterIndex < ALL_CHAPTERS.length - 1}
              hasPrev={currentChapterIndex > 0}
              themeMode={themeMode}
              fontFamily={fontFamily}
              fontSize={fontSize}
              onMarkChapterCompleted={handleMarkChapterCompleted}
              isCompleted={readChapterIds.includes(currentChapter.id)}
            />
          </main>
        </div>
      )}

      {currentDesign === 'density' && (
        <div className="flex-1 flex flex-col w-full">
          <DensityReaderView
            chapter={currentChapter}
            onNextChapter={handleNextChapter}
            onPrevChapter={handlePrevChapter}
            hasNext={currentChapterIndex < ALL_CHAPTERS.length - 1}
            hasPrev={currentChapterIndex > 0}
            themeMode={themeMode}
            fontFamily={fontFamily}
            fontSize={fontSize}
            onMarkChapterCompleted={handleMarkChapterCompleted}
            isCompleted={readChapterIds.includes(currentChapter.id)}
          />
        </div>
      )}

      {currentDesign === 'minimal' && (
        <div className="flex-1 w-full">
          <MinimalReaderView
            chapter={currentChapter}
            onNextChapter={handleNextChapter}
            onPrevChapter={handlePrevChapter}
            hasNext={currentChapterIndex < ALL_CHAPTERS.length - 1}
            hasPrev={currentChapterIndex > 0}
            themeMode={themeMode}
            fontFamily={fontFamily}
            fontSize={fontSize}
            onMarkChapterCompleted={handleMarkChapterCompleted}
            isCompleted={readChapterIds.includes(currentChapter.id)}
          />
        </div>
      )}

      {currentDesign === 'sleek' && (
        <div className="flex-1 w-full">
          <SleekReaderView
            chapter={currentChapter}
            onNextChapter={handleNextChapter}
            onPrevChapter={handlePrevChapter}
            hasNext={currentChapterIndex < ALL_CHAPTERS.length - 1}
            hasPrev={currentChapterIndex > 0}
            themeMode={themeMode}
            fontFamily={fontFamily}
            fontSize={fontSize}
            onMarkChapterCompleted={handleMarkChapterCompleted}
            isCompleted={readChapterIds.includes(currentChapter.id)}
          />
        </div>
      )}

      {currentDesign === 'natural' && (
        <div className="flex-1 w-full">
          <NaturalReaderView
            chapter={currentChapter}
            onNextChapter={handleNextChapter}
            onPrevChapter={handlePrevChapter}
            hasNext={currentChapterIndex < ALL_CHAPTERS.length - 1}
            hasPrev={currentChapterIndex > 0}
            themeMode={themeMode}
            fontFamily={fontFamily}
            fontSize={fontSize}
            onMarkChapterCompleted={handleMarkChapterCompleted}
            isCompleted={readChapterIds.includes(currentChapter.id)}
          />
        </div>
      )}

      {currentDesign === 'dark' && (
        <div className="flex-1 w-full bg-[#080a0f]">
          <SophisticatedDarkReaderView
            chapter={currentChapter}
            onNextChapter={handleNextChapter}
            onPrevChapter={handlePrevChapter}
            hasNext={currentChapterIndex < ALL_CHAPTERS.length - 1}
            hasPrev={currentChapterIndex > 0}
            themeMode={themeMode}
            fontFamily={fontFamily}
            fontSize={fontSize}
            onMarkChapterCompleted={handleMarkChapterCompleted}
            isCompleted={readChapterIds.includes(currentChapter.id)}
          />
        </div>
      )}

      {currentDesign === 'editorial' && (
        <div className="flex-1 w-full">
          <EditorialReaderView
            chapter={currentChapter}
            onNextChapter={handleNextChapter}
            onPrevChapter={handlePrevChapter}
            hasNext={currentChapterIndex < ALL_CHAPTERS.length - 1}
            hasPrev={currentChapterIndex > 0}
            themeMode={themeMode}
            fontFamily={fontFamily}
            fontSize={fontSize}
            onMarkChapterCompleted={handleMarkChapterCompleted}
            isCompleted={readChapterIds.includes(currentChapter.id)}
          />
        </div>
      )}

      {currentDesign === 'geometric' && (
        <div className="flex-1 w-full">
          <GeometricReaderView
            chapter={currentChapter}
            onNextChapter={handleNextChapter}
            onPrevChapter={handlePrevChapter}
            hasNext={currentChapterIndex < ALL_CHAPTERS.length - 1}
            hasPrev={currentChapterIndex > 0}
            themeMode={themeMode}
            fontFamily={fontFamily}
            fontSize={fontSize}
            onMarkChapterCompleted={handleMarkChapterCompleted}
            isCompleted={readChapterIds.includes(currentChapter.id)}
          />
        </div>
      )}

      {/* Pied de page collégial (masqué en mode minimal et density pour respecter leur ergonomie) */}
      {currentDesign !== 'density' && currentDesign !== 'minimal' && (
        <footer className="px-6 sm:px-8 py-3.5 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex flex-wrap justify-between items-center text-xs text-slate-500 dark:text-slate-400 no-print gap-3">
          <div>© Département d'informatique — Niveau collégial (Québec)</div>
          <div className="flex items-center gap-4">
            <span>Devis ministériel : 420.B0 (00Q2)</span>
            <span>Volume 1 : Fondements et POO (~88 pages)</span>
          </div>
        </footer>
      )}

      {/* Modale de recherche */}
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectChapter={handleSelectChapter}
      />

      {/* Modale d'exportation Google Docs */}
      <ExportDocsModal
        isOpen={exportDocsOpen}
        onClose={() => setExportDocsOpen(false)}
        currentChapter={currentChapter}
        allChapters={ALL_CHAPTERS}
      />
    </div>
  );
}
