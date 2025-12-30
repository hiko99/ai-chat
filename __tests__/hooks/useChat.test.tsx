import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useChat } from "@/hooks/useChat";

describe("useChat", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("initializes with empty messages", () => {
    const { result } = renderHook(() =>
      useChat({ conversationId: null })
    );

    expect(result.current.messages).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it("initializes with provided messages", () => {
    const initialMessages = [
      { id: "1", role: "user" as const, content: "Hello", createdAt: new Date() },
    ];

    const { result } = renderHook(() =>
      useChat({ conversationId: "123", initialMessages })
    );

    expect(result.current.messages).toEqual(initialMessages);
  });

  it("clears messages when clearMessages is called", () => {
    const initialMessages = [
      { id: "1", role: "user" as const, content: "Hello", createdAt: new Date() },
    ];

    const { result } = renderHook(() =>
      useChat({ conversationId: "123", initialMessages })
    );

    act(() => {
      result.current.clearMessages();
    });

    expect(result.current.messages).toEqual([]);
  });

  it("sets loading state when sending message", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      body: {
        getReader: () => ({
          read: vi.fn()
            .mockResolvedValueOnce({
              done: false,
              value: new TextEncoder().encode('data: {"text":"Hello"}\n\n'),
            })
            .mockResolvedValueOnce({
              done: false,
              value: new TextEncoder().encode("data: [DONE]\n\n"),
            })
            .mockResolvedValueOnce({ done: true, value: undefined }),
        }),
      },
    });
    global.fetch = mockFetch;

    const { result } = renderHook(() =>
      useChat({ conversationId: "123" })
    );

    act(() => {
      result.current.sendMessage("Hello");
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });

  it("adds user message immediately when sending", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      body: {
        getReader: () => ({
          read: vi.fn()
            .mockResolvedValueOnce({
              done: false,
              value: new TextEncoder().encode("data: [DONE]\n\n"),
            })
            .mockResolvedValueOnce({ done: true, value: undefined }),
        }),
      },
    });
    global.fetch = mockFetch;

    const { result } = renderHook(() =>
      useChat({ conversationId: "123" })
    );

    act(() => {
      result.current.sendMessage("Hello, AI!");
    });

    expect(result.current.messages[0].role).toBe("user");
    expect(result.current.messages[0].content).toBe("Hello, AI!");
  });

  it("handles API errors gracefully", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    });
    global.fetch = mockFetch;

    const { result } = renderHook(() =>
      useChat({ conversationId: "123" })
    );

    await act(async () => {
      await result.current.sendMessage("Hello");
    });

    await waitFor(() => {
      expect(result.current.error).toBe("Failed to send message");
    });
  });

  it("creates new conversation if conversationId is null", async () => {
    const onConversationCreated = vi.fn();
    const mockFetch = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ _id: "new-conv-123" }),
      })
      .mockResolvedValueOnce({
        ok: true,
        body: {
          getReader: () => ({
            read: vi.fn()
              .mockResolvedValueOnce({
                done: false,
                value: new TextEncoder().encode("data: [DONE]\n\n"),
              })
              .mockResolvedValueOnce({ done: true, value: undefined }),
          }),
        },
      });
    global.fetch = mockFetch;

    const { result } = renderHook(() =>
      useChat({ conversationId: null, onConversationCreated })
    );

    await act(async () => {
      await result.current.sendMessage("Start new chat");
    });

    await waitFor(() => {
      expect(onConversationCreated).toHaveBeenCalledWith("new-conv-123");
    });
  });
});
