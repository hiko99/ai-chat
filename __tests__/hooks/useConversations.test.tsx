import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useConversations } from "@/hooks/useConversations";

describe("useConversations", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("initializes with empty conversations", () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ conversations: [] }),
    });
    global.fetch = mockFetch;

    const { result } = renderHook(() => useConversations());

    expect(result.current.conversations).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });

  it("fetches conversations on mount", async () => {
    const mockConversations = [
      { _id: "1", title: "Chat 1", updatedAt: new Date().toISOString() },
      { _id: "2", title: "Chat 2", updatedAt: new Date().toISOString() },
    ];

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ conversations: mockConversations }),
    });
    global.fetch = mockFetch;

    const { result } = renderHook(() => useConversations());

    await waitFor(() => {
      expect(result.current.conversations).toEqual(mockConversations);
    });

    expect(mockFetch).toHaveBeenCalledWith("/api/conversations");
  });

  it("creates a new conversation", async () => {
    const newConversation = {
      _id: "new-123",
      title: "New Chat",
      messages: [],
      createdAt: new Date().toISOString(),
    };

    const mockFetch = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ conversations: [] }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(newConversation),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ conversations: [newConversation] }),
      });
    global.fetch = mockFetch;

    const { result } = renderHook(() => useConversations());

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/conversations");
    });

    let createdConversation;
    await act(async () => {
      createdConversation = await result.current.createConversation("New Chat");
    });

    expect(createdConversation).toEqual(newConversation);
    expect(mockFetch).toHaveBeenCalledWith("/api/conversations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "New Chat" }),
    });
  });

  it("deletes a conversation", async () => {
    const mockConversations = [
      { _id: "1", title: "Chat 1", updatedAt: new Date().toISOString() },
    ];

    const mockFetch = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ conversations: mockConversations }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({}),
      });
    global.fetch = mockFetch;

    const { result } = renderHook(() => useConversations());

    await waitFor(() => {
      expect(result.current.conversations).toEqual(mockConversations);
    });

    await act(async () => {
      await result.current.deleteConversation("1");
    });

    expect(result.current.conversations).toEqual([]);
    expect(mockFetch).toHaveBeenCalledWith("/api/conversations/1", {
      method: "DELETE",
    });
  });

  it("handles fetch error gracefully", async () => {
    const mockFetch = vi.fn().mockRejectedValue(new Error("Network error"));
    global.fetch = mockFetch;

    const { result } = renderHook(() => useConversations());

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
    });

    expect(result.current.conversations).toEqual([]);
  });

  it("refreshes conversations list using fetchConversations", async () => {
    const initialConversations = [
      { _id: "1", title: "Chat 1", updatedAt: new Date().toISOString() },
    ];

    const updatedConversations = [
      { _id: "1", title: "Chat 1", updatedAt: new Date().toISOString() },
      { _id: "2", title: "Chat 2", updatedAt: new Date().toISOString() },
    ];

    const mockFetch = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ conversations: initialConversations }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ conversations: updatedConversations }),
      });
    global.fetch = mockFetch;

    const { result } = renderHook(() => useConversations());

    await waitFor(() => {
      expect(result.current.conversations).toEqual(initialConversations);
    });

    await act(async () => {
      await result.current.fetchConversations();
    });

    expect(result.current.conversations).toEqual(updatedConversations);
  });

  it("starts a new chat by clearing current conversation", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ conversations: [] }),
    });
    global.fetch = mockFetch;

    const { result } = renderHook(() => useConversations());

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
    });

    act(() => {
      result.current.startNewChat();
    });

    expect(result.current.currentConversation).toBe(null);
  });
});
