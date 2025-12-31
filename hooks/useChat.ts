"use client";

import { useState, useCallback } from "react";
import type { Message, ImageAttachment } from "@/types";

interface UseChatOptions {
  conversationId: string | null;
  initialMessages?: Message[];
  onConversationCreated?: (id: string) => void;
}

export function useChat({
  conversationId,
  initialMessages = [],
  onConversationCreated,
}: UseChatOptions) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(
    async (content: string, images?: ImageAttachment[]) => {
      setIsLoading(true);
      setError(null);

      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content,
        images,
        createdAt: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "",
        createdAt: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      try {
        let currentConversationId = conversationId;

        if (!currentConversationId) {
          const createRes = await fetch("/api/conversations", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: content.slice(0, 50) + (content.length > 50 ? "..." : ""),
            }),
          });
          const newConversation = await createRes.json();
          currentConversationId = newConversation._id as string;
          onConversationCreated?.(currentConversationId);
        }

        const allMessages = [...messages, userMessage].map((msg) => ({
          role: msg.role,
          content: msg.content,
          images: msg.images,
        }));

        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            conversationId: currentConversationId,
            messages: allMessages,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to send message");
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) {
          throw new Error("No response body");
        }

        let fullContent = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") continue;

              try {
                const parsed = JSON.parse(data);
                if (parsed.text) {
                  fullContent += parsed.text;
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === assistantMessage.id
                        ? { ...msg, content: fullContent }
                        : msg
                    )
                  );
                }
              } catch {
                // Skip invalid JSON
              }
            }
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setMessages((prev) =>
          prev.filter((msg) => msg.id !== assistantMessage.id)
        );
      } finally {
        setIsLoading(false);
      }
    },
    [conversationId, messages, onConversationCreated]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    setMessages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
  };
}
