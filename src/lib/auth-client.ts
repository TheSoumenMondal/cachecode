import { createAuthClient } from "better-auth/react";

if (!process.env.BETTER_AUTH_URL) {
  throw new Error("BETTER_AUTH_URL is not set");
}

export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL,
});

export const { signIn, signUp, signOut, useSession } = authClient;
