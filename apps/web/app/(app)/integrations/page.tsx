import { Suspense } from "react";
import { auth } from "@/app/api/auth/[...nextauth]/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLinkIcon, PlusCircleIcon } from "lucide-react";

export default async function IntegrationsPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Integrations</h1>
        <p className="mt-2 text-muted-foreground">
          Connect your email data with external services to unlock additional
          features and insights.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* DFDA Integration */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Decentralized FDA</CardTitle>
            <CardDescription>
              Health insights and personalized n-of-1 studies based on your
              email data.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-sm text-muted-foreground">
              DFDA analyzes your email for health-related information to provide
              personalized insights while maintaining your data privacy and
              security.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col items-stretch gap-2 pt-2 sm:flex-row sm:items-center">
            <Button asChild className="flex-1">
              <Link href="/integrations/dfda">
                <PlusCircleIcon className="mr-2 h-4 w-4" />
                Manage Connection
              </Link>
            </Button>
            <Button variant="outline" asChild className="flex-1">
              <Link
                href="/integrations/dfda?tab=overview"
                className="flex items-center"
              >
                <ExternalLinkIcon className="mr-2 h-4 w-4" />
                Learn More
              </Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Placeholder for future integrations */}
        <Card className="flex flex-col border-dashed bg-muted/50">
          <CardHeader>
            <CardTitle className="text-muted-foreground">
              More Integrations Coming Soon
            </CardTitle>
            <CardDescription>
              We're working on additional integrations to enhance your email
              experience.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-sm text-muted-foreground">
              Future integrations will include productivity tools, wellness
              platforms, and more.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" disabled className="w-full">
              Coming Soon
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
