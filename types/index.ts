export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
}

export interface Conversation {
  _id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ConversationListItem {
  _id: string;
  title: string;
  updatedAt: Date;
}

export interface ChatRequest {
  conversationId: string | null;
  messages: Array<{
    role: "user" | "assistant";
    content: string;
  }>;
}

export interface ApiError {
  error: string;
  message: string;
}
