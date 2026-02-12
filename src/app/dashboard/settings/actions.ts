"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";

import {
  DEFAULT_PREFERENCES,
  normalizeUserPreferences,
  preferencesToMetadata,
  type UserPreferences,
} from "@/lib/user-preferences";

export async function updateUserPreferences(input: UserPreferences) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Not authenticated");
  }

  const prefs = normalizeUserPreferences({ ...DEFAULT_PREFERENCES, ...input });

  const client = await clerkClient();

  await client.users.updateUserMetadata(userId, {
    publicMetadata: preferencesToMetadata(prefs),
  });

  return prefs;
}
