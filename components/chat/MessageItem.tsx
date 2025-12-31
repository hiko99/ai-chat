"use client";

import { User, Bot, ImageIcon } from "lucide-react";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { cn } from "@/lib/utils";
import type { Message } from "@/types";

interface MessageItemProps {
  message: Message;
}

function MessageImages({ message }: { message: Message }) {
  if (!message.images || message.images.length === 0) return null;

  return (
    <div className="mb-2 flex flex-wrap gap-2">
      {message.images.map((image) => {
        // Check if we have full image data or just a reference
        const hasFullData = image.data && !image.data.endsWith("...");

        if (hasFullData) {
          return (
            <div
              key={image.id}
              className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700"
            >
              <img
                src={`data:${image.mediaType};base64,${image.data}`}
                alt={image.name || "Attached image"}
                className="max-h-64 max-w-full object-contain"
              />
            </div>
          );
        }

        // Show placeholder for truncated image references
        return (
          <div
            key={image.id}
            className="flex h-20 w-20 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800"
          >
            <ImageIcon className="h-8 w-8 text-zinc-400" />
          </div>
        );
      })}
    </div>
  );
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
          <MessageImages message={message} />
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
