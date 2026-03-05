import { NextRequest } from "next/server";
import { setAccessToken, generateErrorMessage } from "@/app/utils/api";

type RequestHandlerParams = {
  req: NextRequest;
  route: string;
  body?: RequestInit["body"];
};

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

  const response = await fetch(constructedRoute, {
    method: req.method,
    headers: {
      "Content-Type": "application/json",
      "x-access-token": accessToken,
      "session-id": sessionId ?? "",
    },
    body: body ?? undefined,
  });

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

  if (!response.ok) {
    const errorMessage = generateErrorMessage(
      data?.message ?? data?.error ?? response.statusText,
      response.status,
    );
    throw new Error(errorMessage);
  }

  return data;
};

export { requestHandler };
