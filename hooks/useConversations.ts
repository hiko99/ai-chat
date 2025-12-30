"use client";

import { useState, useCallback, useEffect } from "react";
import type { ConversationListItem, Conversation } from "@/types";

export function useConversations() {
  const [conversations, setConversations] = useState<ConversationListItem[]>(
    []
  );
  const [currentConversation, setCurrentConversation] =
    useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchConversations = useCallback(async () => {
    try {
      const res = await fetch("/api/conversations");
      const data = await res.json();
      setConversations(data.conversations || []);
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
    }
  }, []);

  const fetchConversation = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/conversations/${id}`);
      if (res.ok) {
        const data = await res.json();
        setCurrentConversation(data);
        return data;
      }
    } catch (error) {
      console.error("Failed to fetch conversation:", error);
    } finally {
      setIsLoading(false);
    }
    return null;
  }, []);

  const createConversation = useCallback(
    async (title: string = "New Conversation") => {
      try {
        const res = await fetch("/api/conversations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title }),
        });
        const data = await res.json();
        await fetchConversations();
        return data;
      } catch (error) {
        console.error("Failed to create conversation:", error);
        return null;
      }
    },
    [fetchConversations]
  );

  const deleteConversation = useCallback(
    async (id: string) => {
      try {
        await fetch(`/api/conversations/${id}`, { method: "DELETE" });
        setConversations((prev) => prev.filter((c) => c._id !== id));
        if (currentConversation?._id === id) {
          setCurrentConversation(null);
        }
      } catch (error) {
        console.error("Failed to delete conversation:", error);
      }
    },
    [currentConversation]
  );

  const selectConversation = useCallback(
    async (id: string) => {
      const conversation = await fetchConversation(id);
      return conversation;
    },
    [fetchConversation]
  );

  const startNewChat = useCallback(() => {
    setCurrentConversation(null);
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  return {
    conversations,
    currentConversation,
    isLoading,
    fetchConversations,
    selectConversation,
    createConversation,
    deleteConversation,
    startNewChat,
    setCurrentConversation,
  };
}
