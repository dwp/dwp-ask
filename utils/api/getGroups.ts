"use server";
import { headers } from "next/headers";
import { API_TIMEOUT_MS } from "@/constants/Api";
import logger from "@/utils/logger";

/**
 * Server-side function that fetches the current user's group memberships
 * and admin status from the backend API.
 *
 * @returns parsed groups response or undefined on failure
 */
export default async function getGroups() {
  try {
    const headersList = await headers();
    const accessToken = headersList.get("x-access-token");

    const data = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/user-groups`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": accessToken ?? "",
        },
        body: JSON.stringify({}),
        signal: AbortSignal.timeout(API_TIMEOUT_MS),
        cache: "no-store",
      },
    );

    if (!data.ok) {
      throw new Error(`HTTP ${data.status}: ${data.statusText}`);
    }

    const parsedResponse = await data.json();

    if (parsedResponse.error) {
      throw new Error(parsedResponse.error, {
        cause: { code: parsedResponse.code },
      });
    }

    return parsedResponse;
  } catch (error: unknown) {
    logger.error("Failed to fetch user groups", {
      errorMessage: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });
  }
}
