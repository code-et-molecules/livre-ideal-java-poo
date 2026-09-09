import React, { useState } from 'react';
import {
  Menu,
  Search,
  FileText,
  Printer,
  Settings,
  BookOpen,
  Sun,
  Moon,
  Coffee,
  BookmarkCheck,
  Sparkles,
} from 'lucide-react';
import { ThemeMode, FontFamily, FontSize } from '../types';
import { BOOK_METADATA } from '../data/bookMetadata';

interface HeaderProps {
  onToggleSidebar: () => void;
  onOpenSearch: () => void;
  onOpenExportDocs: () => void;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  fontFamily: FontFamily;
  setFontFamily: (font: FontFamily) => void;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  currentPageNumber: number;
  totalBookPages: number;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  onOpenSearch,
  onOpenExportDocs,
  themeMode,
  setThemeMode,
  fontFamily,
  setFontFamily,
  fontSize,
  setFontSize,
  currentPageNumber,
  totalBookPages,
}) => {
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 transition-colors no-print">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Côté gauche : Bouton menu + Badge 'J' + Titre */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            id="btn-toggle-toc"
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer lg:hidden"
            title="Afficher la table des matières"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold shadow-xs">
              J
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-base sm:text-lg font-semibold tracking-tight text-slate-800 dark:text-slate-100">
                  Livre idéal — Java POO
                </h1>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Programme collégial québécois
              </p>
            </div>
          </div>
        </div>

        {/* Milieu : Badge ministériel et navigation de section */}
        <div className="hidden md:flex items-center gap-4">
          <div className="px-3.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-xs font-bold text-slate-600 dark:text-slate-300 tracking-wider">
            TECHNIQUES DE L'INFORMATIQUE
          </div>
          <div className="hidden lg:flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300">
            <BookmarkCheck className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
            <span>
              Page <strong className="font-semibold text-slate-900 dark:text-slate-100">{currentPageNumber}</strong> / {totalBookPages}
            </span>
          </div>
        </div>

        {/* Côté droit : Actions principales */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Recherche */}
          <button
            onClick={onOpenSearch}
            id="btn-search"
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-600 hover:border-slate-300 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 cursor-pointer"
            title="Rechercher dans tout le manuel (Ctrl+K)"
          >
            <Search className="h-4 w-4 text-slate-400" />
            <span className="hidden sm:inline">Rechercher...</span>
          </button>

          {/* Exportation Google Docs */}
          <button
            onClick={onOpenExportDocs}
            id="btn-export-gdocs"
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition-colors cursor-pointer"
            title="Exporter le manuel ou le chapitre vers Google Docs"
          >
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Google Docs</span>
          </button>

          {/* Impression / Export PDF */}
          <button
            onClick={handlePrint}
            id="btn-print-pdf"
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer hidden md:block"
            title="Imprimer ou enregistrer en PDF"
          >
            <Printer className="h-4 w-4" />
          </button>

          {/* Menu de configuration typographique et thème */}
          <div className="relative">
            <button
              onClick={() => setShowSettingsDropdown(!showSettingsDropdown)}
              id="btn-reader-settings"
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer"
              title="Préférences de lecture et typographie"
            >
              <Settings className="h-4 w-4" />
            </button>

            {showSettingsDropdown && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl dark:border-slate-800 dark:bg-slate-900 z-50 text-xs">
                <div className="font-bold text-slate-800 dark:text-slate-100 border-b border-slate-100 pb-2 dark:border-slate-800">
                  Préférences de lecture
                </div>

                {/* Thème de couleur */}
                <div className="mt-3">
                  <span className="text-slate-500 text-[11px] font-semibold uppercase">
                    Ambiance de page
                  </span>
                  <div className="mt-1.5 grid grid-cols-4 gap-1.5">
                    <button
                      onClick={() => setThemeMode('sepia')}
                      className={`flex flex-col items-center gap-1 rounded-lg border p-1.5 ${
                        themeMode === 'sepia'
                          ? 'border-amber-600 bg-amber-50'
                          : 'border-slate-200 bg-[#fbf0d9]'
                      }`}
                    >
                      <Coffee className="h-3.5 w-3.5 text-amber-800" />
                      <span className="text-[10px] text-amber-900">Sépia</span>
                    </button>
                    <button
                      onClick={() => setThemeMode('light')}
                      className={`flex flex-col items-center gap-1 rounded-lg border p-1.5 ${
                        themeMode === 'light'
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-slate-200 bg-white'
                      }`}
                    >
                      <Sun className="h-3.5 w-3.5 text-slate-700" />
                      <span className="text-[10px] text-slate-700">Clair</span>
                    </button>
                    <button
                      onClick={() => setThemeMode('cream')}
                      className={`flex flex-col items-center gap-1 rounded-lg border p-1.5 ${
                        themeMode === 'cream'
                          ? 'border-amber-600 bg-amber-50'
                          : 'border-slate-200 bg-[#faf6ee]'
                      }`}
                    >
                      <Sparkles className="h-3.5 w-3.5 text-amber-700" />
                      <span className="text-[10px] text-amber-900">Crème</span>
                    </button>
                    <button
                      onClick={() => setThemeMode('dark')}
                      className={`flex flex-col items-center gap-1 rounded-lg border p-1.5 ${
                        themeMode === 'dark'
                          ? 'border-indigo-500 bg-slate-800'
                          : 'border-slate-700 bg-slate-900'
                      }`}
                    >
                      <Moon className="h-3.5 w-3.5 text-slate-200" />
                      <span className="text-[10px] text-slate-200">Sombre</span>
                    </button>
                  </div>
                </div>

                {/* Choix de police */}
                <div className="mt-3">
                  <span className="text-slate-500 text-[11px] font-semibold uppercase">
                    Police de caractères
                  </span>
                  <div className="mt-1.5 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setFontFamily('serif')}
                      className={`rounded-lg border p-2 text-center ${
                        fontFamily === 'serif'
                          ? 'border-amber-600 bg-amber-50 font-serif font-bold text-amber-900'
                          : 'border-slate-200 font-serif'
                      }`}
                    >
                      Sérif (Livre)
                    </button>
                    <button
                      onClick={() => setFontFamily('sans')}
                      className={`rounded-lg border p-2 text-center ${
                        fontFamily === 'sans'
                          ? 'border-amber-600 bg-amber-50 font-sans font-bold text-amber-900'
                          : 'border-slate-200 font-sans'
                      }`}
                    >
                      Sans sérif (Écran)
                    </button>
                  </div>
                </div>

                {/* Taille de texte */}
                <div className="mt-3">
                  <span className="text-slate-500 text-[11px] font-semibold uppercase">
                    Taille du texte
                  </span>
                  <div className="mt-1.5 flex rounded-lg border border-slate-200 p-1 dark:border-slate-700">
                    {(['sm', 'base', 'lg', 'xl'] as FontSize[]).map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setFontSize(sz)}
                        className={`flex-1 rounded py-1 font-bold ${
                          fontSize === sz
                            ? 'bg-amber-600 text-white'
                            : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400'
                        }`}
                      >
                        {sz.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
