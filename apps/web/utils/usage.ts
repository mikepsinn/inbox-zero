import { saveUsage } from "@/utils/redis/usage";
import { publishAiCall } from "@inboxzero/tinybird-ai-analytics";
import { createScopedLogger } from "@/utils/logger";

const logger = createScopedLogger("usage");

export async function saveAiUsage({
  email,
  provider,
  model,
  usage,
  label,
}: {
  email: string;
  provider: string;
  model: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  label: string;
}) {
  const cost = calcuateCost(model, usage);

  try {
    return Promise.all([
      publishAiCall({
        userId: email,
        provider,
        model,
        totalTokens: usage.totalTokens,
        completionTokens: usage.completionTokens,
        promptTokens: usage.promptTokens,
        cost,
        timestamp: Date.now(),
        label,
      }),
      saveUsage({ email, cost, usage }),
    ]);
  } catch (error) {
    logger.error("Failed to save usage", { error });
  }
}

const costs: Record<
  string,
  {
    input: number;
    output: number;
  }
> = {
  // https://openai.com/pricing
  "gpt-3.5-turbo-0125": {
    input: 0.5 / 1_000_000,
    output: 1.5 / 1_000_000,
  },
  "gpt-4o-mini": {
    input: 0.15 / 1_000_000,
    output: 0.6 / 1_000_000,
  },
  "gpt-4-turbo": {
    input: 10 / 1_000_000,
    output: 30 / 1_000_000,
  },
  "gpt-4o": {
    input: 5 / 1_000_000,
    output: 15 / 1_000_000,
  },
  // https://www.anthropic.com/pricing#anthropic-api
  "claude-3-5-sonnet-20240620": {
    input: 3 / 1_000_000,
    output: 15 / 1_000_000,
  },
  "claude-3-5-sonnet-20241022": {
    input: 3 / 1_000_000,
    output: 15 / 1_000_000,
  },
  "claude-3-7-sonnet-20250219": {
    input: 3 / 1_000_000,
    output: 15 / 1_000_000,
  },
  "anthropic/claude-3.7-sonnet": {
    input: 3 / 1_000_000,
    output: 15 / 1_000_000,
  },
  // https://aws.amazon.com/bedrock/pricing/
  "anthropic.claude-3-5-sonnet-20240620-v1:0": {
    input: 3 / 1_000_000,
    output: 15 / 1_000_000,
  },
  "anthropic.claude-3-5-sonnet-20241022-v2:0": {
    input: 3 / 1_000_000,
    output: 15 / 1_000_000,
  },
  "us.anthropic.claude-3-5-sonnet-20241022-v2:0": {
    input: 3 / 1_000_000,
    output: 15 / 1_000_000,
  },
  "us.anthropic.claude-3-7-sonnet-20250219-v1:0": {
    input: 3 / 1_000_000,
    output: 15 / 1_000_000,
  },
  "anthropic.claude-3-5-haiku-20241022-v1:0": {
    input: 0.8 / 1_000_000,
    output: 4 / 1_000_000,
  },
  "us.anthropic.claude-3-5-haiku-20241022-v1:0": {
    input: 0.8 / 1_000_000,
    output: 4 / 1_000_000,
  },
  // https://ai.google.dev/pricing
  "gemini-1.5-pro-latest": {
    input: 1.25 / 1_000_000,
    output: 5 / 1_000_000,
  },
  "gemini-1.5-flash-latest": {
    input: 0.075 / 1_000_000,
    output: 0.3 / 1_000_000,
  },
  "gemini-2.0-flash-lite": {
    input: 0.075 / 1_000_000,
    output: 0.3 / 1_000_000,
  },
  "gemini-2.0-flash": {
    input: 0.1 / 1_000_000,
    output: 0.4 / 1_000_000,
  },
  // https://groq.com/pricing
  "llama-3.3-70b-versatile": {
    input: 0.59 / 1_000_000,
    output: 0.79 / 1_000_000,
  },
};

// returns cost in cents
function calcuateCost(
  model: string,
  usage: {
    promptTokens: number;
    completionTokens: number;
  },
): number {
  if (!costs[model]) return 0;

  const { input, output } = costs[model];

  return usage.promptTokens * input + usage.completionTokens * output;
}
