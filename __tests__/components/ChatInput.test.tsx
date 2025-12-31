import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ChatInput } from "@/components/chat/ChatInput";

describe("ChatInput", () => {
  it("renders input and send button", () => {
    const onSend = vi.fn();
    render(<ChatInput onSend={onSend} />);

    expect(screen.getByPlaceholderText("Send a message...")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send message/i })).toBeInTheDocument();
  });

  it("calls onSend when clicking send button with text", async () => {
    const user = userEvent.setup();
    const onSend = vi.fn();
    render(<ChatInput onSend={onSend} />);

    const input = screen.getByPlaceholderText("Send a message...");
    await user.type(input, "Hello, AI!");
    await user.click(screen.getByRole("button", { name: /send message/i }));

    expect(onSend).toHaveBeenCalledWith("Hello, AI!", undefined);
  });

  it("does not call onSend when input is empty", async () => {
    const user = userEvent.setup();
    const onSend = vi.fn();
    render(<ChatInput onSend={onSend} />);

    await user.click(screen.getByRole("button", { name: /send message/i }));

    expect(onSend).not.toHaveBeenCalled();
  });

  it("clears input after sending", async () => {
    const user = userEvent.setup();
    const onSend = vi.fn();
    render(<ChatInput onSend={onSend} />);

    const input = screen.getByPlaceholderText("Send a message...");
    await user.type(input, "Test message");
    await user.click(screen.getByRole("button", { name: /send message/i }));

    expect(input).toHaveValue("");
  });

  it("sends message on Enter key", async () => {
    const user = userEvent.setup();
    const onSend = vi.fn();
    render(<ChatInput onSend={onSend} />);

    const input = screen.getByPlaceholderText("Send a message...");
    await user.type(input, "Enter test{Enter}");

    expect(onSend).toHaveBeenCalledWith("Enter test", undefined);
  });

  it("does not send on Shift+Enter", async () => {
    const user = userEvent.setup();
    const onSend = vi.fn();
    render(<ChatInput onSend={onSend} />);

    const input = screen.getByPlaceholderText("Send a message...");
    await user.type(input, "Line 1");
    await user.keyboard("{Shift>}{Enter}{/Shift}");
    await user.type(input, "Line 2");

    expect(onSend).not.toHaveBeenCalled();
  });

  it("disables input and button when disabled prop is true", () => {
    const onSend = vi.fn();
    render(<ChatInput onSend={onSend} disabled />);

    expect(screen.getByPlaceholderText("Send a message...")).toBeDisabled();
    expect(screen.getByRole("button", { name: /send message/i })).toBeDisabled();
  });

  it("trims whitespace from message", async () => {
    const user = userEvent.setup();
    const onSend = vi.fn();
    render(<ChatInput onSend={onSend} />);

    const input = screen.getByPlaceholderText("Send a message...");
    await user.type(input, "  trimmed message  ");
    await user.click(screen.getByRole("button", { name: /send message/i }));

    expect(onSend).toHaveBeenCalledWith("trimmed message", undefined);
  });
});
