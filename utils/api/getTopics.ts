"use server";

import { headers } from "next/headers";
import { API_TIMEOUT_MS } from "@/constants/Api";
import logger from "@/utils/logger";

/**
 * Server-side function that fetches the topics for filtering from the backend API.
 *
 * @returns parsed topics response or undefined on failure
 */
export default async function getTopics() {
  try {
    const headersList = await headers();
    const accessToken = headersList.get("x-access-token");

    const data = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/topics`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": accessToken ?? "",
      },
      signal: AbortSignal.timeout(API_TIMEOUT_MS),
      cache: "no-store",
    });

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
