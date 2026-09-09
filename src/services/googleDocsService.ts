/**
 * Service d'exportation vers Google Docs et Google Drive
 * Utilise Google Identity Services (GSI) côté client pour l'acquisition du jeton OAuth.
 */

import { Chapter } from '../types';

declare global {
  interface Window {
    google?: {
      accounts?: {
        oauth2?: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: { access_token?: string; error?: unknown }) => void;
          }) => {
            requestAccessToken: (options?: { prompt?: string }) => void;
          };
        };
      };
    };
  }
}

// Client ID provisionné dans le projet GCP de l'application
const OAUTH_CLIENT_ID =
  ((import.meta as unknown as { env?: Record<string, string> }).env?.VITE_GOOGLE_OAUTH_CLIENT_ID) ||
  '388977298742-uee118tuae7abuqlm1s0av53bru9lt6h.apps.googleusercontent.com';
const SCOPES = 'https://www.googleapis.com/auth/documents https://www.googleapis.com/auth/drive.file';

let cachedAccessToken: string | null = null;
let tokenExpiresAt = 0;

export async function getGoogleAccessToken(): Promise<string> {
  if (cachedAccessToken && Date.now() < tokenExpiresAt) {
    return cachedAccessToken;
  }

  return new Promise((resolve, reject) => {
    if (!window.google?.accounts?.oauth2) {
      reject(new Error("Le script d'authentification Google n'est pas encore chargé. Veuillez patienter ou vérifier votre connexion."));
      return;
    }

    try {
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: OAUTH_CLIENT_ID,
        scope: SCOPES,
        callback: (tokenResponse) => {
          if (tokenResponse.error) {
            reject(new Error(`Erreur d'authentification Google : ${JSON.stringify(tokenResponse.error)}`));
            return;
          }
          if (tokenResponse.access_token) {
            cachedAccessToken = tokenResponse.access_token;
            // Valide pour 55 minutes
            tokenExpiresAt = Date.now() + 55 * 60 * 1000;
            resolve(tokenResponse.access_token);
          } else {
            reject(new Error("Aucun jeton d'accès n'a été retourné par Google."));
          }
        },
      });

      tokenClient.requestAccessToken({ prompt: '' });
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Exporte un chapitre ou le manuel entier vers un nouveau document Google Docs
 */
export async function exportToGoogleDocs(options: {
  title: string;
  chapters: Chapter[];
  includeExercises: boolean;
  includeSolutions: boolean;
  onProgress?: (statusText: string) => void;
}): Promise<{ documentId: string; documentUrl: string }> {
  const { title, chapters, includeExercises, includeSolutions, onProgress } = options;

  onProgress?.("Authentification auprès de votre compte Google...");
  const accessToken = await getGoogleAccessToken();

  onProgress?.("Création du document Google Docs...");
  const createResponse = await fetch('https://docs.googleapis.com/v1/documents', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: title,
    }),
  });

  if (!createResponse.ok) {
    const errorData = await createResponse.json().catch(() => ({}));
    throw new Error(`Échec de création du document Google Docs : ${createResponse.status} ${JSON.stringify(errorData)}`);
  }

  const documentData = await createResponse.json();
  const documentId = documentData.documentId;
  const documentUrl = `https://docs.google.com/document/d/${documentId}/edit`;

  onProgress?.("Génération et formatage du contenu dans Google Docs...");

  // Préparation des requêtes batchUpdate
  let fullText = `${title.toUpperCase()}\n`;
  fullText += `Manuel collégial québécois - Techniques de l'informatique\n`;
  fullText += `Généré depuis l'application interactive « Livre idéal - Java POO »\n\n`;

  for (const chap of chapters) {
    fullText += `========================================================\n`;
    fullText += `${typeof chap.number === 'number' ? `Chapitre ${chap.number}` : chap.number} : ${chap.title}\n`;
    fullText += `${chap.subtitle}\n`;
    fullText += `Compétence ministérielle visée : ${chap.competencyGoal}\n`;
    fullText += `========================================================\n\n`;
    fullText += `${chap.introduction}\n\n`;

    for (const sec of chap.sections) {
      fullText += `--- ${sec.title} ---\n\n`;
      fullText += `${sec.contentMarkdown.replace(/[#*`_]/g, '')}\n\n`;

      if (sec.codeSnippets && sec.codeSnippets.length > 0) {
        for (const snippet of sec.codeSnippets) {
          if (snippet.filename) fullText += `[Fichier Java : ${snippet.filename}]\n`;
          fullText += `${snippet.code}\n\n`;
          if (snippet.explanation) fullText += `Explication : ${snippet.explanation}\n\n`;
        }
      }
    }

    if (includeExercises && chap.exercises.length > 0) {
      fullText += `\nEXERCICES DE LABORATOIRE DU CHAPITRE\n\n`;
      for (const ex of chap.exercises) {
        fullText += `Exercice ${ex.number} : ${ex.title} (Niveau : ${ex.difficulty})\n`;
        fullText += `Contexte collégial : ${ex.contextQuebec}\n`;
        fullText += `Directives :\n`;
        ex.instructions.forEach((ins, idx) => {
          fullText += `  ${idx + 1}. ${ins}\n`;
        });
        fullText += `\n`;

        if (includeSolutions && ex.solutionCode) {
          fullText += `Corrigé commenté (Exercice ${ex.number}) :\n`;
          fullText += `${ex.solutionCode}\n\n`;
          fullText += `Analyse didactique : ${ex.explanation}\n\n`;
        }
      }
    }

    fullText += `\n\n`;
  }

  // Google Docs API insère le texte par batchUpdate
  // L'insertion à l'index 1 place le texte au début du document
  const requests = [
    {
      insertText: {
        location: {
          index: 1,
        },
        text: fullText,
      },
    },
  ];

  const updateResponse = await fetch(`https://docs.googleapis.com/v1/documents/${documentId}:batchUpdate`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      requests: requests,
    }),
  });

  if (!updateResponse.ok) {
    console.warn("Avertissement lors du batchUpdate Google Docs:", await updateResponse.text());
  }

  onProgress?.("Exportation complétée avec succès !");
  return { documentId, documentUrl };
}
