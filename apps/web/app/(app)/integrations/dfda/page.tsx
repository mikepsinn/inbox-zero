import { Suspense } from "react";
import { auth } from "@/app/api/auth/[...nextauth]/auth";
import { redirect } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DfdaInfo } from "../components/DfdaInfo";
import { DfdaIntegrationDetails } from "../components/DfdaIntegrationDetails";
import { DfdaConnectionStatus } from "@/components/DfdaConnectionStatus";
import { PermissionsCheck } from "@/app/(app)/PermissionsCheck";
import { GmailProvider } from "@/providers/GmailProvider";

export default async function DfdaIntegrationPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <GmailProvider>
      <Suspense>
        <PermissionsCheck />

        <div className="container mx-auto py-6">
          <div className="mb-6 flex items-center">
            <Button variant="ghost" size="sm" asChild className="mr-2">
              <Link href="/integrations">
                <ArrowLeftIcon className="mr-2 h-4 w-4" />
                Back to Integrations
              </Link>
            </Button>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">
              Decentralized FDA
            </h1>
            <p className="mt-2 text-muted-foreground">
              Health insights and personalized n-of-1 studies based on your
              email data.
            </p>
          </div>

          <div className="space-y-6">
            {/* DFDA Information with tabs */}
            <DfdaInfo />

            {/* DFDA Integration Details */}
            <DfdaIntegrationDetails />

            {/* Connection Status */}
            <Card>
              <CardContent className="py-6">
                <h3 className="mb-4 text-lg font-semibold">
                  Connect Your DFDA Account
                </h3>
                <DfdaConnectionStatus />
              </CardContent>
            </Card>
          </div>
        </div>
      </Suspense>
    </GmailProvider>
  );
}
