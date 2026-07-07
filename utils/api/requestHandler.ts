import type { RequestHandlerParams } from "@/types";
import { generateErrorMessage, setAccessToken } from "@/utils";
import logger from "@/utils/logger";

const { NEXT_PUBLIC_BASE_URL } = process.env;

/**
 * Handles API requests by setting the access token and managing the response.
 * @param {RequestHandlerParams} params - The parameters for the request handler.
 * @returns {Promise<any>} - The JSON response from the API.
 * @throws {Error} - Throws an error if the response is not ok.
 */

const requestHandler = async ({
  req,
  route,
  body,
}: RequestHandlerParams): Promise<any> => {
  const sessionId = req.headers.get("session-id") ?? "";
  const constructedRoute = `${NEXT_PUBLIC_BASE_URL}${route}`;
  const accessToken = setAccessToken(req);
  const start = Date.now();

  let response: Response;
  try {
    response = await fetch(constructedRoute, {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
        ...(accessToken ? { "x-access-token": accessToken } : {}),
        ...(sessionId ? { "session-id": sessionId } : {}),
      },
      body: body ?? undefined,
    });
  } catch (err) {
    logger.error("Backend request failed", {
      route,
      method: req.method,
      durationMs: Date.now() - start,
      errorMessage: err instanceof Error ? err.message : "Unknown error",
      stack: err instanceof Error ? err.stack : undefined,
    });
    throw err;
  }

  let data = null;

  const FILE_ROUTES = ["/generate-pdf", "/download-messages-csv"];

  if (FILE_ROUTES.includes(route)) {
    data = await response.blob();
  }
  if (
    response.headers &&
    response.headers.get("content-type")?.includes("application/json")
  ) {
    data = await response.json();
  }

  const durationMs = Date.now() - start;

  if (!response.ok) {
    const trace = new Error().stack;
    logger.error("Backend returned error", {
      route,
      method: req.method,
      status: response.status,
      durationMs,
      errorMessage: data?.message ?? data?.error ?? response.statusText,
      stack: trace,
    });
    const errorMessage = generateErrorMessage(
      data?.message ?? data?.error ?? response.statusText,
      response.status,
    );
    const error = new Error(errorMessage) as Error & { status?: number };
    error.status = response.status;
    throw error;
  }

  logger.info("Backend request completed", {
    route,
    method: req.method,
    status: response.status,
    durationMs,
  });

  return data;
};

export { requestHandler };
