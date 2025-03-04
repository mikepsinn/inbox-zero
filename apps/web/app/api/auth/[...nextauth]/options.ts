import { OAuthConfig } from "next-auth/providers";

export interface DfdaProfile {
  id: number | string;
  displayName: string;
  email: string;
  avatar?: string;
  [key: string]: any; // Add index signature for additional properties
}

export const DfdaProvider = {
  id: "dfda",
  name: "The Decentralized FDA",
  type: "oauth",
  authorization: {
    url: "https://safe.dfda.earth/oauth/authorize",
    params: {
      scope: "readmeasurements writemeasurements",
      grant_type: "authorization_code",
    },
  },
  token: {
    url: "https://safe.dfda.earth/oauth/token",
  },
  userinfo: "https://safe.dfda.earth/api/v1/user",
  profile(profile: DfdaProfile) {
    return {
      id: profile.id.toString(),
      name: profile.displayName,
      email: profile.email,
      image: profile.avatar,
    };
  },
  style: {
    logo: "https://safe.dfda.earth/logo.png",
    brandColor: "#fff",
  },
} satisfies OAuthConfig<DfdaProfile>;
