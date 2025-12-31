"use client";

import { AlertCircle } from "lucide-react";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";
import type { Message, ImageAttachment } from "@/types";

interface ChatContainerProps {
  messages: Message[];
  isLoading: boolean;
  error?: string | null;
  onSendMessage: (content: string, images?: ImageAttachment[]) => void;
}

export function ChatContainer({
  messages,
  isLoading,
  error,
  onSendMessage,
}: ChatContainerProps) {
  const handleSampleClick = (text: string) => {
    onSendMessage(text);
  };

  return (
    <div className="flex h-full flex-col">
      <MessageList
        messages={messages}
        isLoading={isLoading}
        onSampleClick={handleSampleClick}
      />
      {error && (
        <div className="mx-auto max-w-3xl px-4 pb-2">
          <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950 dark:text-red-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        </div>
      )}
      <ChatInput onSend={onSendMessage} disabled={isLoading} />
    </div>
  );
}
