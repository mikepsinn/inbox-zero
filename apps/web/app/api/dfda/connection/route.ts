import { NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/auth";
import prisma from "@/utils/prisma";
import { withError } from "@/utils/middleware";
import { createScopedLogger } from "@/utils/logger";

const logger = createScopedLogger("dfda-connection-api");

export const GET = withError(async () => {
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
    return NextResponse.json({ connected: false });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true },
  });

  return NextResponse.json({
    connected: true,
    user: {
      name: user?.name || "",
      email: user?.email || "",
    },
  });
});
