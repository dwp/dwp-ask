import { FeedbackApiResponse } from "@/app/types";

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
