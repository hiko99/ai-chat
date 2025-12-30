"use client";

import { User, Bot } from "lucide-react";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { cn } from "@/lib/utils";
import type { Message } from "@/types";

interface MessageItemProps {
  message: Message;
}

export function MessageItem({ message }: MessageItemProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex gap-4 px-4 py-6",
        isUser ? "bg-transparent" : "bg-zinc-50 dark:bg-zinc-900"
      )}
    >
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
          isUser
            ? "bg-zinc-700 text-white"
            : "bg-emerald-600 text-white"
        )}
      >
        {isUser ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-1 text-sm font-medium text-zinc-500 dark:text-zinc-400">
          {isUser ? "You" : "AI Assistant"}
        </div>
        <div className="text-zinc-900 dark:text-zinc-100">
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <MarkdownRenderer content={message.content} />
          )}
        </div>
      </div>
    </div>
  );
}
