import { NextRequest } from "next/server";
import {
  getAnthropicClient,
  SYSTEM_PROMPT,
  DEFAULT_MODEL,
  MAX_TOKENS,
} from "@/lib/anthropic";
import connectToDatabase from "@/lib/mongodb";
import Conversation from "@/models/Conversation";
import type {
  MessageParam,
  ImageBlockParam,
  TextBlockParam,
} from "@anthropic-ai/sdk/resources/messages";
import type { ImageAttachment } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  images?: ImageAttachment[];
}

interface ChatRequestBody {
  conversationId: string | null;
  messages: ChatMessage[];
}

function buildMessageContent(
  message: ChatMessage
): string | (TextBlockParam | ImageBlockParam)[] {
  // If no images, return simple string content
  if (!message.images || message.images.length === 0) {
    return message.content;
  }

  // Build multimodal content with images and text
  const content: (TextBlockParam | ImageBlockParam)[] = [];

  // Add images first
  for (const image of message.images) {
    content.push({
      type: "image",
      source: {
        type: "base64",
        media_type: image.mediaType,
        data: image.data,
      },
    });
  }

  // Add text content if present
  if (message.content) {
    content.push({
      type: "text",
      text: message.content,
    });
  }

  return content;
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequestBody = await request.json();
    const { conversationId, messages } = body;

    if (!messages || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "Messages are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const anthropicMessages: MessageParam[] = messages.map((msg) => ({
      role: msg.role,
      content: buildMessageContent(msg),
    }));

    const stream = getAnthropicClient().messages.stream({
      model: DEFAULT_MODEL,
      max_tokens: MAX_TOKENS,
      system: SYSTEM_PROMPT,
      messages: anthropicMessages,
    });

    const encoder = new TextEncoder();

    const readableStream = new ReadableStream({
      async start(controller) {
        let fullResponse = "";

        try {
          for await (const event of stream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              const text = event.delta.text;
              fullResponse += text;
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ text })}\n\n`)
              );
            }
          }

          if (conversationId) {
            await connectToDatabase();
            const userMessage = messages[messages.length - 1];

            // Store images as references (without the full base64 data for storage efficiency)
            const userImages = userMessage.images?.map((img) => ({
              id: img.id,
              type: img.type,
              mediaType: img.mediaType,
              // Store a truncated version for reference, full data is in the request
              data: img.data.slice(0, 100) + "...",
              name: img.name,
            }));

            await Conversation.findByIdAndUpdate(
              conversationId,
              {
                $push: {
                  messages: [
                    {
                      id: crypto.randomUUID(),
                      role: "user",
                      content: userMessage.content,
                      images: userImages,
                      createdAt: new Date(),
                    },
                    {
                      id: crypto.randomUUID(),
                      role: "assistant",
                      content: fullResponse,
                      createdAt: new Date(),
                    },
                  ],
                },
                updatedAt: new Date(),
              },
              { new: true }
            );
          }

          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (error) {
          console.error("Streaming error:", error);
          controller.error(error);
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
