import { NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/auth";
import prisma from "@/utils/prisma";
import { withError } from "@/utils/middleware";
import { createScopedLogger } from "@/utils/logger";

const logger = createScopedLogger("dfda-disconnect-api");

export const POST = withError(async () => {
  const session = await auth();
  if (!session?.user.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Check if the user has a connected DFDA account
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

  // Delete the DFDA account connection
  await prisma.account.delete({
    where: {
      id: account.id,
    },
  });

  logger.info("DFDA account disconnected", { userId: session.user.id });

  return NextResponse.json({
    success: true,
    message: "DFDA account successfully disconnected",
  });
});
