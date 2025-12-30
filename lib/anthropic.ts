import Anthropic from "@anthropic-ai/sdk";

export const SYSTEM_PROMPT =
  "あなたは親切で知識豊富なAIアシスタントです。日本語で丁寧に回答してください。";

export const DEFAULT_MODEL = "claude-sonnet-4-20250514";
export const MAX_TOKENS = 4096;

let anthropicClient: Anthropic | null = null;

export function getAnthropicClient(): Anthropic {
  if (!anthropicClient) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error("ANTHROPIC_API_KEY environment variable is not defined");
    }
    anthropicClient = new Anthropic({ apiKey });
  }
  return anthropicClient;
}

export default getAnthropicClient;
