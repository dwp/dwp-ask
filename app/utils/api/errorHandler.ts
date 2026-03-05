import { NextRequest, NextResponse } from "next/server";
import type { RouteHandler } from "@/app/types";

const DIVIDER = "|";

const generateErrorMessage = (message: string | null, code: number) => {
  return `${message}${DIVIDER}${code}`;
};

const decodeErrorMessage = (errorMessage: string) => {
  const message = errorMessage.split(DIVIDER);
  const status = message[1] ? Number(message[1]) : 500;

  return {
    errorMessage: message[0],
    status,
  };
};

const withErrorHandler = (handler: RouteHandler): RouteHandler => {
  return async (req: NextRequest, context?: any) => {
    try {
      return await handler(req, context);
    } catch (error: any) {
      const { errorMessage, status } = decodeErrorMessage(error.message);
      return NextResponse.json(
        {
          error:
            errorMessage ??
            "An unexpected error occurred. An error message was not provided",
          code: status,
        },
        { status },
      );
    }
  };
};

export { generateErrorMessage, withErrorHandler };
