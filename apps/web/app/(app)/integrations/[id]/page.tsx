import { Suspense } from "react";
import { auth } from "@/app/api/auth/[...nextauth]/auth";
import { redirect, notFound } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DfdaInfo } from "../components/DfdaInfo";
import { DfdaConnectionStatus } from "../components/DfdaConnectionStatus";
import { PermissionsCheck } from "@/app/(app)/PermissionsCheck";
import { GmailProvider } from "@/providers/GmailProvider";

// Add more integration types as needed
type IntegrationType = "dfda" | "other-future-integration";

// Helper to validate if the ID is a known integration type
function isValidIntegrationType(id: string): id is IntegrationType {
  return ["dfda"].includes(id);
}

export default async function IntegrationDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const { id } = params;

  // Validate integration ID and redirect to 404 if not found
  if (!isValidIntegrationType(id)) {
    notFound();
  }

  // Page title and description based on integration type
  const integrationDetails = {
    dfda: {
      title: "Decentralized FDA Integration",
      description: "Connect and manage your DFDA integration",
    },
  }[id];

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
              {integrationDetails.title}
            </h1>
            <p className="mt-2 text-muted-foreground">
              {integrationDetails.description}
            </p>
          </div>

          {/* Render different components based on integration type */}
          {id === "dfda" && (
            <>
              <DfdaInfo />
              <div className="mt-8">
                <h2 className="mb-4 text-xl font-semibold">
                  Connection Status
                </h2>
                <DfdaConnectionStatus />
              </div>
            </>
          )}

          {/* Add cases for other integrations here */}
        </div>
      </Suspense>
    </GmailProvider>
  );
}
