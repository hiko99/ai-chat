export interface ImageAttachment {
  id: string;
  type: "image";
  mediaType: "image/jpeg" | "image/png" | "image/gif" | "image/webp";
  data: string; // Base64 encoded
  name?: string;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  images?: ImageAttachment[];
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
    images?: ImageAttachment[];
  }>;
}

export interface ApiError {
  error: string;
  message: string;
}
