import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MessageItem } from "@/components/chat/MessageItem";
import type { Message } from "@/types";

describe("MessageItem", () => {
  const userMessage: Message = {
    id: "1",
    role: "user",
    content: "Hello, AI!",
    createdAt: new Date(),
  };

  const assistantMessage: Message = {
    id: "2",
    role: "assistant",
    content: "Hello! How can I help you today?",
    createdAt: new Date(),
  };

  it("renders user message correctly", () => {
    render(<MessageItem message={userMessage} />);

    expect(screen.getByText("You")).toBeInTheDocument();
    expect(screen.getByText("Hello, AI!")).toBeInTheDocument();
  });

  it("renders assistant message correctly", () => {
    render(<MessageItem message={assistantMessage} />);

    expect(screen.getByText("AI Assistant")).toBeInTheDocument();
    expect(screen.getByText("Hello! How can I help you today?")).toBeInTheDocument();
  });

  it("applies different background for user and assistant", () => {
    const { container: userContainer } = render(
      <MessageItem message={userMessage} />
    );
    const { container: assistantContainer } = render(
      <MessageItem message={assistantMessage} />
    );

    const userDiv = userContainer.firstChild as HTMLElement;
    const assistantDiv = assistantContainer.firstChild as HTMLElement;

    expect(userDiv.className).toContain("bg-transparent");
    expect(assistantDiv.className).toContain("bg-zinc-50");
  });

  it("renders markdown in assistant messages", () => {
    const markdownMessage: Message = {
      id: "3",
      role: "assistant",
      content: "Here is **bold** text",
      createdAt: new Date(),
    };

    render(<MessageItem message={markdownMessage} />);
    expect(screen.getByText("bold")).toBeInTheDocument();
  });

  it("renders code blocks in assistant messages", () => {
    const codeMessage: Message = {
      id: "4",
      role: "assistant",
      content: "```javascript\nconsole.log('hello');\n```",
      createdAt: new Date(),
    };

    render(<MessageItem message={codeMessage} />);
    expect(screen.getByText("javascript")).toBeInTheDocument();
  });
});
