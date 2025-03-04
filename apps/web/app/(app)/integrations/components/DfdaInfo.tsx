"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowRight,
  ActivityIcon,
  Database,
  LockIcon,
  InfoIcon,
} from "lucide-react";

export function DfdaInfo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>About Decentralized FDA</CardTitle>
        <CardDescription>
          Learn how DFDA uses your email data to provide health insights and
          personalized studies.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full" searchParam="tab">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center">
              <InfoIcon className="mr-2 h-4 w-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="data-processing" className="flex items-center">
              <Database className="mr-2 h-4 w-4" />
              <span>Data Processing</span>
            </TabsTrigger>
            <TabsTrigger value="n-of-1" className="flex items-center">
              <ActivityIcon className="mr-2 h-4 w-4" />
              <span>n-of-1 Studies</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center">
              <LockIcon className="mr-2 h-4 w-4" />
              <span>Privacy & Security</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">
                What is Decentralized FDA?
              </h3>
              <p>
                Decentralized FDA (DFDA) is a platform that analyzes
                health-related information from your emails to provide
                personalized health insights while maintaining your privacy and
                data security.
              </p>

              <h4 className="text-md mt-4 font-medium">Key Features:</h4>
              <ul className="list-disc space-y-2 pl-6">
                <li>Extract health-related information from your emails</li>
                <li>
                  Run personalized n-of-1 studies based on your unique data
                </li>
                <li>Provide insights about potential health correlations</li>
                <li>Maintain strict privacy and security protocols</li>
              </ul>

              <p className="mt-4 text-muted-foreground">
                By connecting DFDA to your inbox, you can unlock valuable health
                insights from your existing email data without compromising your
                privacy.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="data-processing" className="mt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">
                How DFDA Processes Your Data
              </h3>
              <p>
                DFDA uses advanced natural language processing to analyze
                health-related information in your emails, such as:
              </p>

              <ul className="list-disc space-y-2 pl-6">
                <li>Health product purchases and subscriptions</li>
                <li>Medication reminders and pharmacy notifications</li>
                <li>Appointment confirmations from healthcare providers</li>
                <li>Health and wellness newsletter subscriptions</li>
                <li>Fitness app and device notifications</li>
              </ul>

              <p className="mt-4">
                This information is processed to identify patterns and
                correlations that might be relevant to your health without
                requiring you to manually input data.
              </p>

              <p className="mt-4 text-muted-foreground">
                All processing occurs in a secure environment, and your raw
                email data never leaves the protected processing system.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="n-of-1" className="mt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">
                Personalized n-of-1 Studies
              </h3>
              <p>
                n-of-1 studies are single-subject clinical trials where you
                serve as your own control group. DFDA enables these personalized
                studies by:
              </p>

              <ul className="list-disc space-y-2 pl-6">
                <li>
                  <span className="font-medium">Identifying patterns</span> -
                  Detecting potential correlations between different health
                  factors in your data.
                </li>
                <li>
                  <span className="font-medium">Generating hypotheses</span> -
                  Creating testable hypotheses based on your unique health
                  profile.
                </li>
                <li>
                  <span className="font-medium">Designing studies</span> -
                  Creating personalized study protocols to test these
                  hypotheses.
                </li>
                <li>
                  <span className="font-medium">Monitoring results</span> -
                  Tracking outcomes and providing insights about what works for
                  your specific situation.
                </li>
              </ul>

              <p className="mt-4 text-muted-foreground">
                These studies can help you discover personalized insights that
                might not be evident from population-based studies.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="privacy" className="mt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">
                Privacy & Security Measures
              </h3>
              <p>
                DFDA prioritizes your privacy and data security with multiple
                protective measures:
              </p>

              <ul className="list-disc space-y-2 pl-6">
                <li>
                  <span className="font-medium">End-to-end encryption</span> -
                  All data is encrypted during transmission and storage.
                </li>
                <li>
                  <span className="font-medium">Limited access</span> - Only the
                  necessary automated systems have access to your data for
                  processing.
                </li>
                <li>
                  <span className="font-medium">Transparency</span> - Clear
                  visibility into what data is collected and how it's used.
                </li>
                <li>
                  <span className="font-medium">No data sharing</span> - Your
                  information is never sold or shared with third parties.
                </li>
              </ul>

              <p className="text-muted-foreground">
                We prioritize your privacy and security at every step. You can
                disconnect your DFDA account at any time, and all data
                forwarding will immediately cease.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
