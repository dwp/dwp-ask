import type { NextRequest } from "next/server";

/**
 * Set access token based on environment (dev/prod)
 * @param req API request
 * @returns appropriate access token
 */
export const setAccessToken = (req: NextRequest) => {
  const access_token = req.headers.get("x-access-token");
  return access_token ?? "";
};
