"use client";

import { Plus, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { ConversationList } from "./ConversationList";
import type { ConversationListItem } from "@/types";

interface SidebarProps {
  conversations: ConversationListItem[];
  currentConversationId: string | null;
  onNewChat: () => void;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
}

function SidebarContent({
  conversations,
  currentConversationId,
  onNewChat,
  onSelectConversation,
  onDeleteConversation,
}: SidebarProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="p-4">
        <Button onClick={onNewChat} className="w-full" variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          New Chat
        </Button>
      </div>
      <Separator />
      <ConversationList
        conversations={conversations}
        currentId={currentConversationId}
        onSelect={onSelectConversation}
        onDelete={onDeleteConversation}
      />
      <Separator />
      <div className="flex items-center justify-between p-4">
        <span className="text-sm text-zinc-500">AI Chat</span>
        <ThemeToggle />
      </div>
    </div>
  );
}

export function Sidebar(props: SidebarProps) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 md:block">
        <SidebarContent {...props} />
      </aside>

      {/* Mobile sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-4 md:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation</SheetTitle>
          </SheetHeader>
          <SidebarContent {...props} />
        </SheetContent>
      </Sheet>
    </>
  );
}
