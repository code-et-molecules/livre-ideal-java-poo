import React, { useState } from 'react';
import { FileText, ExternalLink, CheckCircle2, AlertCircle, Loader2, X, Download } from 'lucide-react';
import { Chapter } from '../types';
import { exportToGoogleDocs } from '../services/googleDocsService';

interface ExportDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentChapter: Chapter;
  allChapters: Chapter[];
}

export const ExportDocsModal: React.FC<ExportDocsModalProps> = ({
  isOpen,
  onClose,
  currentChapter,
  allChapters,
}) => {
  const [scopeOption, setScopeOption] = useState<'current' | 'all' | 'exercises'>('current');
  const [includeSolutions, setIncludeSolutions] = useState(true);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [createdDocUrl, setCreatedDocUrl] = useState('');

  if (!isOpen) return null;

  const handleExport = async () => {
    setStatus('loading');
    setStatusMessage("Initialisation de la connexion à Google Workspace...");

    try {
      let targetChapters: Chapter[] = [];
      let docTitle = "";

      if (scopeOption === 'current') {
        targetChapters = [currentChapter];
        docTitle = `Java POO - ${typeof currentChapter.number === 'number' ? `Chapitre ${currentChapter.number}` : currentChapter.number} : ${currentChapter.title}`;
      } else if (scopeOption === 'all') {
        targetChapters = allChapters;
        docTitle = "Livre idéal - Java POO (Manuel collégial complet)";
      } else {
        targetChapters = allChapters.filter((ch) => ch.exercises.length > 0);
        docTitle = "Cahier de laboratoire et exercices résolus - Java POO";
      }

      const result = await exportToGoogleDocs({
        title: docTitle,
        chapters: targetChapters,
        includeExercises: true,
        includeSolutions: includeSolutions,
        onProgress: (msg) => setStatusMessage(msg),
      });

      setCreatedDocUrl(result.documentUrl);
      setStatus('success');
    } catch (err: unknown) {
      console.error("Erreur lors de l'exportation Google Docs :", err);
      const message = err instanceof Error ? err.message : String(err);
      setStatusMessage(message);
      setStatus('error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        {/* En-tête */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                Exporter vers Google Docs
              </h3>
              <p className="text-xs text-slate-500">
                Intégration directe avec votre Google Drive universitaire
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            id="btn-close-export-modal"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Corps */}
        <div className="mt-4 space-y-4">
          {status === 'idle' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Périmètre du document à exporter :
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/60 cursor-pointer">
                    <input
                      type="radio"
                      name="exportScope"
                      checked={scopeOption === 'current'}
                      onChange={() => setScopeOption('current')}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <div className="text-xs">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">
                        Chapitre en cours uniquement
                      </div>
                      <div className="text-slate-500 text-[11px]">
                        {typeof currentChapter.number === 'number' ? `Chapitre ${currentChapter.number}` : currentChapter.number} : {currentChapter.title} (~{currentChapter.estimatedPages} pages)
                      </div>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/60 cursor-pointer">
                    <input
                      type="radio"
                      name="exportScope"
                      checked={scopeOption === 'exercises'}
                      onChange={() => setScopeOption('exercises')}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <div className="text-xs">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">
                        Cahier d'exercices et corrigés de laboratoire
                      </div>
                      <div className="text-slate-500 text-[11px]">
                        Recueil intégral des ateliers pratiques adaptés au cégep
                      </div>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/60 cursor-pointer">
                    <input
                      type="radio"
                      name="exportScope"
                      checked={scopeOption === 'all'}
                      onChange={() => setScopeOption('all')}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <div className="text-xs">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">
                        Manuel complet (« Livre idéal - Java POO »)
                      </div>
                      <div className="text-slate-500 text-[11px]">
                        Tous les 10 chapitres, avant-propos et annexes (~74 pages)
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              <div className="pt-1">
                <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeSolutions}
                    onChange={(e) => setIncludeSolutions(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>Inclure les solutions et corrigés détaillés commentés</span>
                </label>
              </div>
            </>
          )}

          {status === 'loading' && (
            <div className="py-8 text-center space-y-3">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto" />
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                {statusMessage}
              </p>
              <p className="text-xs text-slate-400">
                Veuillez autoriser la fenêtre d'authentification Google si elle apparaît.
              </p>
            </div>
          )}

          {status === 'success' && (
            <div className="py-6 text-center space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 mx-auto">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h4 className="text-base font-bold text-slate-800 dark:text-slate-100">
                Document Google Docs généré !
              </h4>
              <p className="text-xs text-slate-500">
                Le document a été créé dans votre compte Google Drive avec la typographie et la mise en page collégiale.
              </p>
              <a
                href={createdDocUrl}
                target="_blank"
                rel="noopener noreferrer"
                id="link-open-gdoc"
                className="mt-3 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-blue-700 transition-colors"
              >
                <span>Ouvrir dans Google Docs</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          )}

          {status === 'error' && (
            <div className="py-6 text-center space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 mx-auto">
                <AlertCircle className="h-6 w-6" />
              </div>
              <h4 className="text-base font-bold text-slate-800 dark:text-slate-100">
                Impossible de créer le document
              </h4>
              <p className="text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 p-3 rounded-lg text-left">
                {statusMessage}
              </p>
              <button
                onClick={() => setStatus('idle')}
                className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
              >
                Réessayer avec d'autres options
              </button>
            </div>
          )}
        </div>

        {/* Pied de modal */}
        <div className="mt-6 flex items-center justify-end gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
          <button
            onClick={onClose}
            className="rounded-lg px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 cursor-pointer"
          >
            Fermer
          </button>
          {status === 'idle' && (
            <button
              onClick={handleExport}
              id="btn-confirm-export-gdocs"
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Générer le Google Doc</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
