"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CodeBlock } from "./CodeBlock";
import type { Components } from "react-markdown";

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const components: Components = {
    code({ className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || "");
      const isInline = !match && !className;

      if (isInline) {
        return (
          <code
            className="rounded bg-zinc-200 px-1.5 py-0.5 text-sm dark:bg-zinc-800"
            {...props}
          >
            {children}
          </code>
        );
      }

      return (
        <CodeBlock
          language={match ? match[1] : undefined}
          code={String(children).replace(/\n$/, "")}
        />
      );
    },
    pre({ children }) {
      return <>{children}</>;
    },
    p({ children }) {
      return <p className="mb-4 last:mb-0">{children}</p>;
    },
    ul({ children }) {
      return <ul className="mb-4 list-disc pl-6 last:mb-0">{children}</ul>;
    },
    ol({ children }) {
      return <ol className="mb-4 list-decimal pl-6 last:mb-0">{children}</ol>;
    },
    li({ children }) {
      return <li className="mb-1">{children}</li>;
    },
    h1({ children }) {
      return <h1 className="mb-4 text-2xl font-bold">{children}</h1>;
    },
    h2({ children }) {
      return <h2 className="mb-3 text-xl font-bold">{children}</h2>;
    },
    h3({ children }) {
      return <h3 className="mb-2 text-lg font-bold">{children}</h3>;
    },
    blockquote({ children }) {
      return (
        <blockquote className="mb-4 border-l-4 border-zinc-300 pl-4 italic dark:border-zinc-700">
          {children}
        </blockquote>
      );
    },
    a({ children, href }) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          {children}
        </a>
      );
    },
    table({ children }) {
      return (
        <div className="mb-4 overflow-x-auto">
          <table className="min-w-full border-collapse border border-zinc-300 dark:border-zinc-700">
            {children}
          </table>
        </div>
      );
    },
    th({ children }) {
      return (
        <th className="border border-zinc-300 bg-zinc-100 px-4 py-2 text-left font-semibold dark:border-zinc-700 dark:bg-zinc-800">
          {children}
        </th>
      );
    },
    td({ children }) {
      return (
        <td className="border border-zinc-300 px-4 py-2 dark:border-zinc-700">
          {children}
        </td>
      );
    },
  };

  return (
    <div className="prose prose-zinc max-w-none dark:prose-invert">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
