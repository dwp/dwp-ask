"use server";
import { headers } from "next/headers";

export default async function getGroups() {
  try {
    const headersList = await headers();
    const accessToken = headersList.get("x-access-token");

    const data = await fetch(`http://localhost:3000/api/user-groups`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": accessToken ?? "",
      },
      body: JSON.stringify({}),
      signal: AbortSignal.timeout(90000),
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
  } catch (error: any) {
    console.log(error);
  }
}
