import { test, expect } from "@playwright/test";

test.describe("Chat scroll behavior", () => {
  test("should allow scrolling to view all messages in a long conversation", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const input = page.getByPlaceholder("Send a message...");

    // Send multiple messages to create a scrollable conversation
    for (let i = 1; i <= 15; i++) {
      await input.fill(
        `Message ${i}: ${"Lorem ipsum dolor sit amet. ".repeat(3)}`
      );
      await page.getByRole("button", { name: /send message/i }).click();
      await page.waitForTimeout(200);
    }

    await page.waitForTimeout(500);

    // Verify ScrollArea can scroll
    const viewport = page.locator('[data-slot="scroll-area-viewport"]');
    const canScroll = await viewport.evaluate((el) => {
      return el.scrollHeight > el.clientHeight;
    });

    expect(canScroll).toBe(true);

    // Scroll to top
    await viewport.evaluate((el) => {
      el.scrollTop = 0;
    });
    await page.waitForTimeout(300);

    // Verify first message is visible after scrolling to top
    await expect(page.getByText("Message 1:")).toBeVisible();

    // Scroll to bottom
    await viewport.evaluate((el) => {
      el.scrollTop = el.scrollHeight;
    });
    await page.waitForTimeout(300);

    // Verify last message is visible after scrolling to bottom
    await expect(page.getByText("Message 15:")).toBeVisible();
  });
});
