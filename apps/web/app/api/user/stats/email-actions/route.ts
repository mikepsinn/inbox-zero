import { z } from "zod";
import { NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/auth";
import { withError } from "@/utils/middleware";
import { getEmailActionsByDay } from "@inboxzero/tinybird";
import { createScopedLogger } from "@/utils/logger";

const logger = createScopedLogger("EmailActionStats");

export type EmailActionStatsResponse = Awaited<
  ReturnType<typeof getEmailActionStats>
>;

async function getEmailActionStats(options: { email: string }) {
  try {
    logger.trace("Fetching email action stats", { email: options.email });

    const data = await getEmailActionsByDay({ ownerEmail: options.email });

    const result = data.data.map((d) => ({
      date: d.date,
      Archived: d.archive_count,
      Deleted: d.delete_count,
    }));

    logger.trace("Email action stats fetched successfully", {
      email: options.email,
      dataPoints: result.length,
    });

    return { result };
  } catch (error) {
    logger.error("Error fetching email action stats", {
      email: options.email,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw error;
  }
}

export const GET = withError(async (request: Request) => {
  try {
    const session = await auth();
    const email = session?.user?.email;

    if (!email) {
      logger.warn("Unauthorized attempt to access email action stats");
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    logger.trace("Processing email action stats request", { email });

    const result = await getEmailActionStats({ email });

    return NextResponse.json(result);
  } catch (error) {
    logger.error("Unhandled error in email action stats endpoint", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    throw error; // Let the withError middleware handle the response
  }
});
