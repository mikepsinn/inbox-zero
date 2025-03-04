import { NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/auth";
import { dfdaApiRequest } from "@/utils/dfda/client";
import { withError } from "@/utils/middleware";
import { createScopedLogger } from "@/utils/logger";
import prisma from "@/utils/prisma";

const logger = createScopedLogger("dfda-test-api");

export const GET = withError(async () => {
  const session = await auth();
  if (!session?.user.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Check if the user has DFDA integration
  const account = await prisma.account.findFirst({
    where: {
      userId: session.user.id,
      provider: "dfda",
    },
  });

  if (!account) {
    return NextResponse.json(
      { error: "No DFDA account connected" },
      { status: 400 },
    );
  }

  try {
    // Example API request to DFDA using the session directly
    const userInfo = await dfdaApiRequest(
      {
        accessToken: account.access_token || undefined,
        refreshToken: account.refresh_token || undefined,
      },
      "/user",
    );

    return NextResponse.json({
      message: "DFDA integration working!",
      userInfo,
    });
  } catch (error) {
    logger.error("Error testing DFDA integration", { error });
    return NextResponse.json(
      {
        error: "Failed to test DFDA integration",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
});
