import { z } from "zod";
import { NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/auth";
import {
  getDomainsMostReceivedFrom,
  getMostReceivedFrom,
  zodPeriod,
} from "@inboxzero/tinybird";
import { withError } from "@/utils/middleware";
import { createScopedLogger } from "@/utils/logger";

const logger = createScopedLogger("SenderStats");

const senderStatsQuery = z.object({
  period: zodPeriod,
  fromDate: z.coerce.number().nullish(),
  toDate: z.coerce.number().nullish(),
});
export type SenderStatsQuery = z.infer<typeof senderStatsQuery>;
export type SendersResponse = Awaited<ReturnType<typeof getSendersTinybird>>;

async function getSendersTinybird(
  options: SenderStatsQuery & {
    ownerEmail: string;
  },
) {
  try {
    logger.trace("Fetching sender stats from Tinybird", {
      email: options.ownerEmail,
      period: options.period,
      fromDate: options.fromDate,
      toDate: options.toDate,
    });

    const [mostSent, mostSentDomains] = await Promise.all([
      getMostReceivedFrom(options),
      getDomainsMostReceivedFrom(options),
    ]);

    logger.trace("Sender stats fetched successfully", {
      email: options.ownerEmail,
      emailCount: mostSent.data.length,
      domainCount: mostSentDomains.data.length,
    });

    return {
      mostActiveSenderEmails: mostSent.data.map((d) => ({
        name: d.from,
        value: d.count,
      })),
      mostActiveSenderDomains: mostSentDomains.data.map((d) => ({
        name: d.from,
        value: d.count,
      })),
    };
  } catch (error) {
    logger.error("Error fetching sender stats from Tinybird", {
      email: options.ownerEmail,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      period: options.period,
      fromDate: options.fromDate,
      toDate: options.toDate,
    });
    throw error;
  }
}

export const GET = withError(async (request: Request) => {
  try {
    const session = await auth();
    const email = session?.user?.email;

    if (!email) {
      logger.warn("Unauthorized attempt to access sender stats");
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    logger.trace("Processing sender stats request", { email });

    try {
      const { searchParams } = new URL(request.url);
      const query = senderStatsQuery.parse({
        period: searchParams.get("period") || "week",
        fromDate: searchParams.get("fromDate"),
        toDate: searchParams.get("toDate"),
      });

      logger.trace("Query parameters parsed", {
        email,
        period: query.period,
        fromDate: query.fromDate,
        toDate: query.toDate,
      });

      const result = await getSendersTinybird({
        ...query,
        ownerEmail: email,
      });

      return NextResponse.json(result);
    } catch (error) {
      // Handle validation errors
      if (error instanceof z.ZodError) {
        logger.warn("Invalid query parameters for sender stats", {
          email,
          error: error.errors,
        });
        return NextResponse.json(
          { error: "Invalid query parameters", details: error.errors },
          { status: 400 },
        );
      }

      throw error; // Let the outer catch or withError middleware handle it
    }
  } catch (error) {
    logger.error("Unhandled error in sender stats endpoint", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    throw error; // Let the withError middleware handle the response
  }
});
