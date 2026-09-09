import React from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
  className?: string;
  inline?: boolean;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  className = '',
  inline = false,
}) => {
  if (!content) return null;

  if (inline) {
    return (
      <span className={`inline-markdown ${className}`}>
        <Markdown
          remarkPlugins={[remarkGfm]}
          components={{
            p: ({ children }) => <span className="inline">{children}</span>,
            strong: ({ children }) => (
              <strong className="font-bold text-inherit">{children}</strong>
            ),
            em: ({ children }) => <em className="italic">{children}</em>,
            code: ({ children }) => (
              <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[0.85em] text-blue-700 dark:bg-slate-800 dark:text-blue-300">
                {children}
              </code>
            ),
          }}
        >
          {content}
        </Markdown>
      </span>
    );
  }

  return (
    <div className={`markdown-content leading-relaxed ${className}`}>
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          strong: ({ children }) => (
            <strong className="font-bold text-slate-900 dark:text-slate-100">
              {children}
            </strong>
          ),
          em: ({ children }) => <em className="italic">{children}</em>,
          p: ({ children }) => (
            <p className="mb-4 leading-relaxed last:mb-0">{children}</p>
          ),
          h3: ({ children }) => (
            <h3 className="mt-6 mb-2 text-lg font-bold text-slate-900 dark:text-slate-100">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="mt-4 mb-2 text-base font-bold text-slate-900 dark:text-slate-100">
              {children}
            </h4>
          ),
          ul: ({ children }) => (
            <ul className="my-3 ml-6 list-disc space-y-1">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="my-3 ml-6 list-decimal space-y-1">{children}</ol>
          ),
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="my-3 rounded-r border-l-4 border-blue-500 bg-blue-50/50 py-2 pl-4 pr-3 italic text-slate-700 dark:bg-blue-950/20 dark:text-slate-300">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="my-6 w-full overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
              <table className="w-full border-collapse text-left text-sm">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="border-b border-slate-200 bg-slate-100/90 font-semibold text-slate-800 dark:border-slate-800 dark:bg-slate-800/90 dark:text-slate-200">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {children}
            </tbody>
          ),
          tr: ({ children }) => (
            <tr className="transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
              {children}
            </tr>
          ),
          th: ({ children }) => (
            <th className="px-4 py-3.5 text-left text-xs uppercase tracking-wider font-bold text-slate-900 dark:text-slate-100 border-r last:border-r-0 border-slate-200 dark:border-slate-800">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-3 text-slate-700 dark:text-slate-300 align-top border-r last:border-r-0 border-slate-200 dark:border-slate-800">
              {children}
            </td>
          ),
          code: ({ children, className }) => {
            const isBlock = className || (typeof children === 'string' && children.includes('\n'));
            if (isBlock) {
              return (
                <code className="block font-mono text-[13px] text-slate-100">
                  {children}
                </code>
              );
            }
            return (
              <code className="rounded bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 font-mono text-[0.88em] font-semibold text-blue-700 dark:text-blue-300 border border-slate-200/80 dark:border-slate-700/60">
                {children}
              </code>
            );
          },
          pre: ({ children }) => (
            <pre className="my-4 overflow-x-auto rounded-xl bg-[#0b1120] p-4 border border-slate-700/80 font-mono text-xs text-slate-100 shadow-md">
              {children}
            </pre>
          ),
        }}
      >
        {content}
      </Markdown>
    </div>
  );
};
