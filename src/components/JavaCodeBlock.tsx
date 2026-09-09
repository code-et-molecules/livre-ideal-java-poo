import React, { useState } from 'react';
import { Copy, Check, Download } from 'lucide-react';
import { MarkdownRenderer } from './MarkdownRenderer';

interface JavaCodeBlockProps {
  code: string;
  filename?: string;
  explanation?: string;
  className?: string;
}

// Expressions régulières pour la tokenisation syntaxique Java avec haute lisibilité
const JAVA_TOKEN_REGEX =
  /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|(@[A-Za-z0-9_]+)|(\b(?:public|private|protected|class|record|interface|enum|extends|implements|abstract|final|static|void|new|return|this|super|throws|throw|try|catch|finally|import|package|if|else|for|while|do|switch|case|break|continue|default|instanceof|sealed|permits|non-sealed|yield|var|native|transient|volatile|synchronized)\b)|(\b(?:int|double|float|long|short|byte|boolean|char|String|List|ArrayList|LinkedList|Map|HashMap|TreeMap|Set|HashSet|TreeSet|Queue|Deque|ArrayDeque|Path|Files|Object|Exception|RuntimeException|IllegalArgumentException|IllegalStateException|NullPointerException|IndexOutOfBoundsException|Double|Integer|Float|Long|Short|Byte|Boolean|Character|StandardCharsets|Collections|Arrays|Objects|Math|Optional|Stream|Scanner|LocalDate|LocalTime|LocalDateTime|DateTimeFormatter|BigDecimal|BigInteger|PrintStream|StringBuilder|StringBuffer|Comparator|Comparable)\b)|(\b[a-zA-Z_$][a-zA-Z0-9_$]*\b(?=\s*\())|(\b[A-Z][A-Za-z0-9_]*\b)|(\b\d+(?:\.\d+)?[fFdDlL]?\b|\b0x[0-9a-fA-F]+\b)/g;

function renderHighlightedLine(line: string, lineIndex: number): React.ReactNode {
  if (!line) {
    return <span>&nbsp;</span>;
  }

  // Réinitialiser l'index du regex global
  JAVA_TOKEN_REGEX.lastIndex = 0;

  const elements: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = JAVA_TOKEN_REGEX.exec(line)) !== null) {
    if (match.index > lastIndex) {
      elements.push(
        <span key={`txt-${lineIndex}-${lastIndex}`} className="text-slate-100">
          {line.substring(lastIndex, match.index)}
        </span>
      );
    }

    const [, comment, str, annotation, keyword, typeName, methodName, className, num] = match;

    if (comment) {
      // Commentaires à contraste élevé : vert émeraude clair très lisible
      elements.push(
        <span key={`tok-${lineIndex}-${match.index}`} className="text-emerald-400 font-normal">
          {comment}
        </span>
      );
    } else if (str) {
      // Chaînes de caractères : vert lime lumineux
      elements.push(
        <span key={`tok-${lineIndex}-${match.index}`} className="text-lime-300">
          {str}
        </span>
      );
    } else if (annotation) {
      // Annotations Java : fuchsia / violet lumineux
      elements.push(
        <span key={`tok-${lineIndex}-${match.index}`} className="text-fuchsia-300 font-semibold">
          {annotation}
        </span>
      );
    } else if (keyword) {
      // Mots-clés Java du langage : rose / corail vibrant
      elements.push(
        <span key={`tok-${lineIndex}-${match.index}`} className="text-rose-400 font-semibold">
          {keyword}
        </span>
      );
    } else if (typeName) {
      // Types primitifs et classes de base de l'API standard : bleu ciel
      elements.push(
        <span key={`tok-${lineIndex}-${match.index}`} className="text-sky-300 font-medium">
          {typeName}
        </span>
      );
    } else if (methodName) {
      // Noms de méthodes (déclarations et appels) : ambre / doré très distinct et contrasté
      elements.push(
        <span key={`tok-${lineIndex}-${match.index}`} className="text-amber-300 font-semibold">
          {methodName}
        </span>
      );
    } else if (className) {
      // Noms de classes personnalisées : cyan clair
      elements.push(
        <span key={`tok-${lineIndex}-${match.index}`} className="text-cyan-200 font-medium">
          {className}
        </span>
      );
    } else if (num) {
      // Nombres et valeurs numériques : orange lumineux
      elements.push(
        <span key={`tok-${lineIndex}-${match.index}`} className="text-orange-300">
          {num}
        </span>
      );
    }

    lastIndex = JAVA_TOKEN_REGEX.lastIndex;
  }

  if (lastIndex < line.length) {
    elements.push(
      <span key={`end-${lineIndex}-${lastIndex}`} className="text-slate-100">
        {line.substring(lastIndex)}
      </span>
    );
  }

  return elements.length > 0 ? elements : <span>&nbsp;</span>;
}

export const JavaCodeBlock: React.FC<JavaCodeBlockProps> = ({
  code,
  filename,
  explanation,
  className = '',
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || 'ExempleJava.java';
    link.click();
    URL.revokeObjectURL(url);
  };

  const lines = code.split('\n');

  return (
    <div
      className={`my-5 overflow-hidden rounded-xl bg-[#0b1120] text-slate-100 shadow-xl font-mono text-xs border border-slate-700/80 ${className}`}
    >
      {/* Barre supérieure du terminal avec feux tricolores */}
      <div className="flex items-center justify-between border-b border-slate-700/80 bg-[#0f172a] px-4 py-2.5 text-xs text-slate-200 select-none">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
          </div>
          <span className="font-sans text-[11px] font-semibold text-slate-200 tracking-wide">
            {filename || 'Exemple.java'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            id="btn-copy-code"
            className="flex items-center gap-1.5 rounded bg-slate-800 px-2.5 py-1 text-slate-200 hover:bg-slate-700 hover:text-white transition-colors cursor-pointer text-[11px] border border-slate-700/60"
            title="Copier le code source"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 text-emerald-400" />
                <span className="text-emerald-400 font-medium">Copié</span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                <span>Copier</span>
              </>
            )}
          </button>
          <button
            onClick={handleDownload}
            id="btn-download-code"
            className="flex items-center gap-1.5 rounded bg-slate-800 px-2.5 py-1 text-slate-200 hover:bg-slate-700 hover:text-white transition-colors cursor-pointer text-[11px] border border-slate-700/60"
            title="Télécharger le fichier source .java"
          >
            <Download className="h-3 w-3" />
            <span>.java</span>
          </button>
        </div>
      </div>

      {/* Contenu du code avec numéros de lignes */}
      <div className="overflow-x-auto p-4 bg-[#0b1120] text-slate-100">
        <div className="table w-full">
          {lines.map((line, lineIndex) => (
            <div key={lineIndex} className="table-row font-mono text-[13px] leading-6">
              <span className="table-cell select-none pr-3 text-right text-slate-500 font-mono w-10 border-r border-slate-800/80">
                {lineIndex + 1}
              </span>
              <span className="table-cell pl-4 whitespace-pre font-mono">
                {renderHighlightedLine(line, lineIndex)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Explication didactique optionnelle */}
      {explanation && (
        <div className="border-t border-slate-700/80 bg-[#0f172a] px-4 py-2.5 font-sans text-xs text-slate-200">
          <span className="font-semibold text-sky-400">Analyse du code : </span>
          <MarkdownRenderer content={explanation} inline={true} />
        </div>
      )}
    </div>
  );
};
