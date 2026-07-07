import { type NextRequest, NextResponse } from "next/server";
import { FALLBACK_ERROR } from "@/constants/Errors";
import type { RouteHandlerType } from "@/types";

const DIVIDER = "|";

/**
 * Encodes an error message and HTTP status code into a single pipe-delimited string.
 *
 * @param message error message text
 * @param code HTTP status code
 * @returns encoded string in the format "message|code"
 */
const generateErrorMessage = (message: string | null, code: number) => {
  return `${message}${DIVIDER}${code}`;
};

/**
 * Decodes a pipe-delimited error string back into a message and status code.
 *
 * @param errorMessage encoded error string from generateErrorMessage
 * @returns object with errorMessage and numeric status
 */
const decodeErrorMessage = (errorMessage: string) => {
  const message = errorMessage.split(DIVIDER);
  const status = message[1] ? Number(message[1]) : 500;

  return {
    errorMessage: message[0],
    status,
  };
};

/**
 * Higher-order function that wraps a Next.js route handler with try/catch error handling.
 * Catches errors, decodes the message, and returns a JSON error response.
 *
 * @param handler the route handler function to wrap
 * @returns wrapped route handler with error handling
 */
const withErrorHandler = (handler: RouteHandlerType): RouteHandlerType => {
  return async (
    req: NextRequest,
    context?: Parameters<RouteHandlerType>[1],
  ) => {
    try {
      return await handler(req, context);
    } catch (error: unknown) {
      const typedError = error as Error & { status?: number };
      const statusFromError = typedError.status;
      const { errorMessage, status } = decodeErrorMessage(typedError.message);
      const resolvedStatus = statusFromError ?? status;
      return NextResponse.json(
        {
          error: errorMessage ?? FALLBACK_ERROR,
          code: resolvedStatus,
        },
        { status: resolvedStatus },
      );
    }
  };
};

export { generateErrorMessage, withErrorHandler };
