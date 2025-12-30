import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
}

export interface IConversation extends Document {
  title: string;
  messages: IMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    id: { type: String, required: true },
    role: { type: String, enum: ["user", "assistant"], required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const ConversationSchema = new Schema<IConversation>(
  {
    title: { type: String, required: true, default: "New Conversation" },
    messages: { type: [MessageSchema], default: [] },
  },
  {
    timestamps: true,
  }
);

ConversationSchema.index({ createdAt: -1 });
ConversationSchema.index({ updatedAt: -1 });

const Conversation: Model<IConversation> =
  mongoose.models.Conversation ||
  mongoose.model<IConversation>("Conversation", ConversationSchema);

export default Conversation;
