"use client";

import { useEffect, useRef } from "react";
import { Bot, Sparkles, Code, FileText, Lightbulb } from "lucide-react";
import { MessageItem } from "./MessageItem";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Message } from "@/types";

interface MessageListProps {
  messages: Message[];
  isLoading?: boolean;
  onSampleClick?: (text: string) => void;
}

const samplePrompts = [
  {
    icon: Code,
    title: "Write code",
    prompt: "Write a Python function to calculate the Fibonacci sequence",
  },
  {
    icon: FileText,
    title: "Explain concepts",
    prompt: "Explain how async/await works in JavaScript",
  },
  {
    icon: Lightbulb,
    title: "Get ideas",
    prompt: "Give me 5 project ideas for learning React",
  },
];

export function MessageList({ messages, isLoading, onSampleClick }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  if (messages.length === 0 && !isLoading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-8">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900">
          <Bot className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h1 className="mb-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
          AI Chat
        </h1>
        <p className="mb-8 text-center text-zinc-500 dark:text-zinc-400">
          Ask me anything! I can help with coding, writing, analysis, and more.
        </p>
        {onSampleClick && (
          <div className="grid w-full max-w-md gap-3">
            {samplePrompts.map((sample, index) => (
              <button
                key={index}
                onClick={() => onSampleClick(sample.prompt)}
                className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-white p-4 text-left transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
                  <sample.icon className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
                </div>
                <div>
                  <div className="flex items-center gap-1 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    <Sparkles className="h-3 w-3" />
                    {sample.title}
                  </div>
                  <div className="text-sm text-zinc-500 dark:text-zinc-400">
                    {sample.prompt}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <ScrollArea className="min-h-0 flex-1">
      <div className="mx-auto max-w-3xl">
        {messages.map((message) => (
          <MessageItem key={message.id} message={message} />
        ))}
        {isLoading && messages[messages.length - 1]?.role === "assistant" &&
         messages[messages.length - 1]?.content === "" && (
          <div className="flex gap-4 bg-zinc-50 px-4 py-6 dark:bg-zinc-900">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
              <Bot className="h-5 w-5" />
            </div>
            <div className="flex items-center">
              <div className="flex space-x-1">
                <div className="h-2 w-2 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.3s]" />
                <div className="h-2 w-2 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.15s]" />
                <div className="h-2 w-2 animate-bounce rounded-full bg-zinc-400" />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
}
