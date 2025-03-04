"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Check, AlertTriangle } from "lucide-react";

export function DfdaIntegrationDetails() {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <h3 className="mb-4 text-lg font-semibold">Features & Benefits</h3>

          <div className="space-y-4">
            <div className="flex items-start">
              <Check className="mr-2 mt-1 h-5 w-5 flex-shrink-0 text-green-500" />
              <div>
                <p className="font-medium">Personalized Health Insights</p>
                <p className="text-sm text-muted-foreground">
                  Receive customized health suggestions based on patterns
                  detected in your email data.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <Check className="mr-2 mt-1 h-5 w-5 flex-shrink-0 text-green-500" />
              <div>
                <p className="font-medium">Single-Subject (n-of-1) Studies</p>
                <p className="text-sm text-muted-foreground">
                  Test health interventions tailored specifically to your body
                  and circumstances.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <Check className="mr-2 mt-1 h-5 w-5 flex-shrink-0 text-green-500" />
              <div>
                <p className="font-medium">Correlation Analysis</p>
                <p className="text-sm text-muted-foreground">
                  Identify potential connections between different health
                  factors in your life.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <Check className="mr-2 mt-1 h-5 w-5 flex-shrink-0 text-green-500" />
              <div>
                <p className="font-medium">Automated Data Collection</p>
                <p className="text-sm text-muted-foreground">
                  No manual tracking needed - insights are derived from your
                  existing email data.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="mb-4 text-lg font-semibold">
            What Happens After Connecting
          </h3>

          <ol className="list-decimal space-y-4 pl-5">
            <li>
              <p className="font-medium">Initial Data Analysis</p>
              <p className="text-sm text-muted-foreground">
                DFDA will perform an initial scan of your email data to identify
                health-related information.
              </p>
            </li>

            <li>
              <p className="font-medium">Pattern Identification</p>
              <p className="text-sm text-muted-foreground">
                Our algorithms will look for patterns and correlations in your
                health-related data.
              </p>
            </li>

            <li>
              <p className="font-medium">Insight Generation</p>
              <p className="text-sm text-muted-foreground">
                You'll receive personalized health insights based on the
                analysis.
              </p>
            </li>

            <li>
              <p className="font-medium">Study Recommendations</p>
              <p className="text-sm text-muted-foreground">
                DFDA may suggest personalized n-of-1 studies based on your data
                patterns.
              </p>
            </li>
          </ol>

          <div className="mt-6 flex items-start rounded-md bg-amber-50 p-4 dark:bg-amber-950/50">
            <AlertTriangle className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-amber-500" />
            <div>
              <p className="font-medium text-amber-800 dark:text-amber-300">
                Important Note
              </p>
              <p className="text-sm text-amber-700 dark:text-amber-400">
                DFDA insights are not medical advice. Always consult with
                healthcare professionals before making changes to your health
                regimen or medication.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
