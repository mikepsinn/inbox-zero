import { saveRefreshToken } from "@/utils/auth";
import { env } from "@/env";
import { createScopedLogger } from "@/utils/logger";

const logger = createScopedLogger("dfda/client");

const DFDA_BASE_URL = "https://safe.dfda.earth";
const DFDA_API_URL = `${DFDA_BASE_URL}/api/v1`;
const DFDA_TOKEN_URL = `${DFDA_BASE_URL}/oauth/token`;

type ClientOptions = {
  accessToken?: string;
  refreshToken?: string;
  expiryDate?: number | null;
};

type TokenResponse = {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
};

// Refresh the access token using the refresh token
export const refreshAccessToken = async (
  refreshToken: string,
): Promise<TokenResponse> => {
  try {
    const response = await fetch(DFDA_TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        client_id: env.DFDA_CLIENT_ID || "",
        client_secret: env.DFDA_CLIENT_SECRET || "",
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to refresh token: ${response.status} ${response.statusText}`,
      );
    }

    return await response.json();
  } catch (error) {
    logger.error("Error refreshing access token", { error });
    throw error;
  }
};

export const getDfdaClientWithRefresh = async (
  session: ClientOptions & { refreshToken: string },
  providerAccountId: string,
) => {
  // If token is still valid, return the session
  if (session.expiryDate && session.expiryDate > Date.now()) {
    return session;
  }

  // Refresh the token if expired
  try {
    const tokens = await refreshAccessToken(session.refreshToken);

    const newAccessToken = tokens.access_token;
    const expiryDate = Date.now() + tokens.expires_in * 1000;

    if (newAccessToken !== session.accessToken) {
      await saveRefreshToken(
        {
          access_token: newAccessToken,
          refresh_token: tokens.refresh_token,
          expires_at: Math.floor(expiryDate / 1000),
        },
        {
          refresh_token: session.refreshToken,
          providerAccountId,
        },
      );
    }

    return {
      ...session,
      accessToken: newAccessToken,
      expiryDate,
    };
  } catch (error) {
    if (error instanceof Error && error.message.includes("invalid_grant")) {
      logger.error("Error refreshing DFDA access token", { error });
      return undefined;
    }

    throw error;
  }
};

// Helper function to make authenticated API requests to DFDA endpoints
export const dfdaApiRequest = async (
  session: ClientOptions,
  endpoint: string,
  options: RequestInit = {},
) => {
  if (!session.accessToken) {
    throw new Error("No access token available");
  }

  try {
    const url = `${DFDA_API_URL}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${session.accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `DFDA API error: ${response.status} ${response.statusText}`,
      );
    }

    return await response.json();
  } catch (error) {
    logger.error("DFDA API request failed", { endpoint, error });
    throw error;
  }
};
