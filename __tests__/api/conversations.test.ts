/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock mongoose and models before importing route handlers
vi.mock("@/lib/mongodb", () => ({
  default: vi.fn().mockResolvedValue({}),
}));

const mockDate = "2025-01-01T00:00:00.000Z";
const mockConversations = [
  { _id: "1", title: "Chat 1", updatedAt: mockDate },
  { _id: "2", title: "Chat 2", updatedAt: mockDate },
];

const mockLean = vi.fn().mockResolvedValue(mockConversations);
const mockSort = vi.fn().mockReturnValue({ lean: mockLean });
const mockSelect = vi.fn().mockReturnValue({ sort: mockSort });
const mockFind = vi.fn().mockReturnValue({ select: mockSelect });
const mockFindByIdLean = vi.fn();
const mockFindById = vi.fn().mockReturnValue({ lean: mockFindByIdLean });
const mockFindByIdAndUpdateLean = vi.fn();
const mockFindByIdAndUpdate = vi.fn().mockReturnValue({ lean: mockFindByIdAndUpdateLean });
const mockFindByIdAndDelete = vi.fn();
const mockCreate = vi.fn();

vi.mock("@/models/Conversation", () => ({
  default: {
    find: mockFind,
    findById: mockFindById,
    findByIdAndUpdate: mockFindByIdAndUpdate,
    findByIdAndDelete: mockFindByIdAndDelete,
    create: mockCreate,
  },
}));

describe("Conversations API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLean.mockResolvedValue(mockConversations);
  });

  describe("GET /api/conversations", () => {
    it("returns conversations sorted by updatedAt", async () => {
      const { GET } = await import("@/app/api/conversations/route");

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.conversations).toHaveLength(2);
      expect(data.conversations[0]._id).toBe("1");
      expect(data.conversations[1]._id).toBe("2");
      expect(mockFind).toHaveBeenCalled();
      expect(mockSelect).toHaveBeenCalledWith("_id title updatedAt");
      expect(mockSort).toHaveBeenCalledWith({ updatedAt: -1 });
    });
  });

  describe("POST /api/conversations", () => {
    it("creates a new conversation with title", async () => {
      const mockConversation = {
        _id: { toString: () => "new-123" },
        title: "New Chat",
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockCreate.mockResolvedValue(mockConversation);

      const { POST } = await import("@/app/api/conversations/route");

      const mockRequest = {
        json: () => Promise.resolve({ title: "New Chat" }),
      } as unknown as Request;

      const response = await POST(mockRequest as any);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data._id).toBe("new-123");
      expect(data.title).toBe("New Chat");
      expect(mockCreate).toHaveBeenCalledWith({
        title: "New Chat",
        messages: [],
      });
    });

    it("creates conversation with default title if not provided", async () => {
      const mockConversation = {
        _id: { toString: () => "new-456" },
        title: "New Conversation",
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockCreate.mockResolvedValue(mockConversation);

      const { POST } = await import("@/app/api/conversations/route");

      const mockRequest = {
        json: () => Promise.resolve({}),
      } as unknown as Request;

      const response = await POST(mockRequest as any);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.title).toBe("New Conversation");
    });
  });
});

describe("Conversation by ID API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/conversations/[id]", () => {
    it("returns conversation by id", async () => {
      const mockConversation = {
        _id: "123",
        title: "Test Chat",
        messages: [{ role: "user", content: "Hello" }],
        createdAt: mockDate,
      };

      mockFindByIdLean.mockResolvedValue(mockConversation);

      const { GET } = await import("@/app/api/conversations/[id]/route");

      const mockRequest = {} as Request;
      const mockContext = { params: Promise.resolve({ id: "123" }) };

      const response = await GET(mockRequest, mockContext as any);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data._id).toBe("123");
      expect(data.title).toBe("Test Chat");
    });

    it("returns 404 if conversation not found", async () => {
      mockFindByIdLean.mockResolvedValue(null);

      const { GET } = await import("@/app/api/conversations/[id]/route");

      const mockRequest = {} as Request;
      const mockContext = { params: Promise.resolve({ id: "nonexistent" }) };

      const response = await GET(mockRequest, mockContext as any);

      expect(response.status).toBe(404);
    });
  });

  describe("PUT /api/conversations/[id]", () => {
    it("updates conversation title", async () => {
      const updatedConversation = {
        _id: "123",
        title: "Updated Title",
        messages: [],
        createdAt: new Date(),
      };

      mockFindByIdAndUpdateLean.mockResolvedValue(updatedConversation);

      const { PUT } = await import("@/app/api/conversations/[id]/route");

      const mockRequest = {
        json: () => Promise.resolve({ title: "Updated Title" }),
      } as unknown as Request;
      const mockContext = { params: Promise.resolve({ id: "123" }) };

      const response = await PUT(mockRequest as any, mockContext as any);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.title).toBe("Updated Title");
    });
  });

  describe("DELETE /api/conversations/[id]", () => {
    it("deletes conversation by id", async () => {
      const deletedConversation = {
        _id: "123",
        title: "Deleted Chat",
      };

      mockFindByIdAndDelete.mockResolvedValue(deletedConversation);

      const { DELETE } = await import("@/app/api/conversations/[id]/route");

      const mockRequest = {} as Request;
      const mockContext = { params: Promise.resolve({ id: "123" }) };

      const response = await DELETE(mockRequest, mockContext as any);

      expect(response.status).toBe(200);
    });

    it("returns 404 if conversation to delete not found", async () => {
      mockFindByIdAndDelete.mockResolvedValue(null);

      const { DELETE } = await import("@/app/api/conversations/[id]/route");

      const mockRequest = {} as Request;
      const mockContext = { params: Promise.resolve({ id: "nonexistent" }) };

      const response = await DELETE(mockRequest, mockContext as any);

      expect(response.status).toBe(404);
    });
  });
});
