import type { FeedbackApiResponse } from "@/types";

/**
 * Fetches the current user's feedback summary from the API.
 *
 * @returns parsed feedback API response
 * @throws Error if the HTTP response is not ok
 */
const getFeedback = async (): Promise<FeedbackApiResponse> => {
  const response = await fetch("/api/get-feedback", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export default getFeedback;
