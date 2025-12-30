"use client";

import { MessageSquare, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { ConversationListItem } from "@/types";

interface ConversationListProps {
  conversations: ConversationListItem[];
  currentId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ConversationList({
  conversations,
  currentId,
  onSelect,
  onDelete,
}: ConversationListProps) {
  if (conversations.length === 0) {
    return (
      <div className="p-4 text-center text-sm text-zinc-500">
        No conversations yet
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1">
      <div className="space-y-1 p-2">
        {conversations.map((conversation) => (
          <div
            key={conversation._id}
            className={cn(
              "group flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
              currentId === conversation._id
                ? "bg-zinc-200 dark:bg-zinc-800"
                : "hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
            )}
          >
            <button
              onClick={() => onSelect(conversation._id)}
              className="flex min-w-0 flex-1 items-center gap-2"
            >
              <MessageSquare className="h-4 w-4 shrink-0 text-zinc-500" />
              <span className="truncate">{conversation.title}</span>
            </button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(conversation._id);
              }}
            >
              <Trash2 className="h-4 w-4 text-zinc-500 hover:text-red-500" />
            </Button>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
