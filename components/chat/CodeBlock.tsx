"use client";

import { Check, Copy } from "lucide-react";
import { useState, useEffect } from "react";
import hljs from "highlight.js";
import { Button } from "@/components/ui/button";

interface CodeBlockProps {
  language?: string;
  code: string;
}

export function CodeBlock({ language, code }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [highlightedCode, setHighlightedCode] = useState<string>("");

  useEffect(() => {
    if (language && hljs.getLanguage(language)) {
      const result = hljs.highlight(code, { language });
      setHighlightedCode(result.value);
    } else {
      const result = hljs.highlightAuto(code);
      setHighlightedCode(result.value);
    }
  }, [code, language]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative my-4 rounded-lg bg-zinc-950 dark:bg-zinc-900">
      <div className="flex items-center justify-between rounded-t-lg bg-zinc-800 px-4 py-2 text-xs text-zinc-400">
        <span>{language || "text"}</span>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 px-2 text-zinc-400 hover:text-zinc-100"
          onClick={handleCopy}
        >
          {copied ? (
            <>
              <Check className="mr-1 h-3 w-3" />
              Copied
            </>
          ) : (
            <>
              <Copy className="mr-1 h-3 w-3" />
              Copy
            </>
          )}
        </Button>
      </div>
      <pre className="overflow-x-auto p-4">
        <code
          className={`text-sm ${language ? `language-${language}` : ""}`}
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
        />
      </pre>
    </div>
  );
}
