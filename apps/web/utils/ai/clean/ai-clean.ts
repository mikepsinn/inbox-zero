import { z } from "zod";
import type { User } from "@prisma/client";
import { chatCompletionObject } from "@/utils/llms";
import type { UserEmailWithAI } from "@/utils/llms/types";
import { createScopedLogger } from "@/utils/logger";
import type { EmailForLLM } from "@/utils/types";
import {
  stringifyEmailSimple,
  stringifyPreviousEmails,
} from "@/utils/stringify-email";
import { formatDateForLLM, formatRelativeTimeForLLM } from "@/utils/date";
import { Braintrust } from "@/utils/braintrust";

const logger = createScopedLogger("ai/clean");

// TODO: allow specific labels
// Pass in prompt labels
const schema = z.object({
  archive: z.boolean(),
  // label: z.string().optional(),
  // reasoning: z.string(),
});

const braintrust = new Braintrust("cleaner-1");

export async function aiClean({
  user,
  messageId,
  messages,
  instructions,
  skips,
}: {
  user: Pick<User, "about"> & UserEmailWithAI;
  messageId: string;
  messages: EmailForLLM[];
  instructions?: string;
  skips: {
    reply?: boolean | null;
    receipt?: boolean | null;
  };
}) {
  const lastMessage = messages.at(-1);

  if (!lastMessage) throw new Error("No messages");

  const system =
    `You are an AI assistant designed to help users achieve inbox zero by analyzing emails and deciding whether they should be archived or not.
  
Examples of emails to archive:
- Newsletters
- Marketing
- Notifications
- Low-priority emails
- Notifications
- Social
- LinkedIn messages
- Facebook messages
- GitHub issues

${skips.reply ? "Do not archive emails that the user needs to reply to. But do archive old emails that are clearly not needed." : ""}
${
  skips.receipt
    ? `Do not archive emails that are actual financial records: receipts, payment confirmations, or invoices.
However, do archive payment-related communications like overdue payment notifications, payment reminders, or subscription renewal notices.`
    : ""
}`.trim();

  const message = `${stringifyEmailSimple(lastMessage)}
  ${
    lastMessage.date
      ? `<date>${formatDateForLLM(lastMessage.date)} (${formatRelativeTimeForLLM(lastMessage.date)})</date>`
      : ""
  }`;

  const previousMessages = stringifyPreviousEmails(messages.slice(-3, -1));

  const previous =
    messages.length > 1
      ? `
Previous emails in the thread for context:

<previous_emails>
${previousMessages}
</previous_emails>
`
      : "";

  const currentDate = formatDateForLLM(new Date());

  const prompt = `
${
  instructions
    ? `Additional user instructions:
<instructions>${instructions}</instructions>`
    : ""
}

The email to analyze:

<email>
${message}
</email>
${previous}
The current date is ${currentDate}.
`.trim();

  // ${user.about ? `<user_background_information>${user.about}</user_background_information>` : ""}

  logger.trace("Input", { system, prompt });

  const aiResponse = await chatCompletionObject({
    userAi: user,
    system,
    prompt,
    schema,
    userEmail: user.email || "",
    usageLabel: "Clean",
  });

  logger.trace("Result", { response: aiResponse.object });

  braintrust.insertToDataset({
    id: messageId,
    input: { message, previousMessages, currentDate },
    expected: aiResponse.object,
  });

  return aiResponse.object;
}
