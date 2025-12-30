"use client";

import { useEffect, useCallback } from "react";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { ChatContainer } from "@/components/chat/ChatContainer";
import { useChat } from "@/hooks/useChat";
import { useConversations } from "@/hooks/useConversations";
import type { Message } from "@/types";

export default function Home() {
  const {
    conversations,
    currentConversation,
    fetchConversations,
    selectConversation,
    deleteConversation,
    startNewChat,
    setCurrentConversation,
  } = useConversations();

  const handleConversationCreated = useCallback(
    (id: string) => {
      fetchConversations();
      selectConversation(id);
    },
    [fetchConversations, selectConversation]
  );

  const {
    messages,
    setMessages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
  } = useChat({
    conversationId: currentConversation?._id ?? null,
    initialMessages: [],
    onConversationCreated: handleConversationCreated,
  });

  useEffect(() => {
    if (currentConversation?.messages) {
      const formattedMessages: Message[] = currentConversation.messages.map(
        (msg) => ({
          id: msg.id || crypto.randomUUID(),
          role: msg.role,
          content: msg.content,
          createdAt: new Date(msg.createdAt),
        })
      );
      setMessages(formattedMessages);
    }
  }, [currentConversation, setMessages]);

  const handleNewChat = useCallback(() => {
    startNewChat();
    clearMessages();
  }, [startNewChat, clearMessages]);

  const handleSelectConversation = useCallback(
    async (id: string) => {
      await selectConversation(id);
    },
    [selectConversation]
  );

  const handleDeleteConversation = useCallback(
    async (id: string) => {
      await deleteConversation(id);
      if (currentConversation?._id === id) {
        clearMessages();
        setCurrentConversation(null);
      }
    },
    [deleteConversation, currentConversation, clearMessages, setCurrentConversation]
  );

  return (
    <div className="flex h-screen bg-white dark:bg-zinc-950">
      <Sidebar
        conversations={conversations}
        currentConversationId={currentConversation?._id ?? null}
        onNewChat={handleNewChat}
        onSelectConversation={handleSelectConversation}
        onDeleteConversation={handleDeleteConversation}
      />
      <main className="relative flex flex-1 flex-col overflow-hidden">
        <ChatContainer
          messages={messages}
          isLoading={isLoading}
          error={error}
          onSendMessage={sendMessage}
        />
      </main>
    </div>
  );
}
