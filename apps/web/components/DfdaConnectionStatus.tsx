"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoadingContent } from "@/components/LoadingContent";
import useSWR from "swr";
import { toastError, toastSuccess } from "@/components/Toast";

type DfdaConnectionResponse = {
  connected: boolean;
  user?: {
    name: string;
    email: string;
  };
};

export const DfdaConnectionStatus = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const { data, isLoading, error, mutate } = useSWR<DfdaConnectionResponse>(
    "/api/dfda/connection",
  );

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      await signIn("dfda", { callbackUrl: window.location.href });
    } catch (error) {
      toastError({
        title: "Connection failed",
        description: "Failed to connect to DFDA. Please try again.",
      });
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      const response = await fetch("/api/dfda/disconnect", {
        method: "POST",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to disconnect DFDA account");
      }

      await mutate();
      toastSuccess({
        description: "Successfully disconnected from DFDA",
      });
    } catch (error) {
      toastError({
        title: "Disconnection failed",
        description:
          error instanceof Error
            ? error.message
            : "Failed to disconnect DFDA account",
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          DFDA Integration
          {data?.connected && (
            <Badge
              variant="outline"
              className="border-green-200 bg-green-50 text-green-700"
            >
              Connected
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          Connect your DFDA account to enable secure data exchange using the
          DFDA protocol.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LoadingContent loading={isLoading} error={error}>
          {data?.connected ? (
            <div className="text-sm">
              <p className="font-medium">Connected Account</p>
              <p className="mt-1 text-muted-foreground">
                {data.user?.name} ({data.user?.email})
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Not connected. Connect your DFDA account to get started.
            </p>
          )}
        </LoadingContent>
      </CardContent>
      <CardFooter>
        {data?.connected ? (
          <Button variant="outline" onClick={handleDisconnect}>
            Disconnect
          </Button>
        ) : (
          <Button onClick={handleConnect} disabled={isConnecting}>
            {isConnecting ? "Connecting..." : "Connect DFDA Account"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
