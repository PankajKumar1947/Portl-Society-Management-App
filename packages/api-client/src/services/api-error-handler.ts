import { AxiosError } from "axios";
import { ApiErrorResponse } from "@repo/schema";

class ApiErrorHandler {
  static errorMessages: Record<number, string> = {
    400: "Bad request. Please check your input.",
    401: "Unauthorized. Please log in again.",
    403: "Forbidden. You don't have permission.",
    404: "Not found. The requested resource doesn't exist.",
    429: "Too many requests. Please try again later.",
    500: "Internal server error. Try again later.",
    502: "Bad gateway. Try again later.",
    503: "Service unavailable. Try again later.",
    504: "Gateway timeout. Try again later.",
  };

  static handle(error: AxiosError): ApiErrorResponse {
    const errorResponse: ApiErrorResponse = {
      isError: true,
      message: "An error occurred",
    };

    if (!error.response) {
      errorResponse.code = error.code;

      if (error.code === "ENOTFOUND") {
        errorResponse.message =
          "Server not found. Please check the URL or your internet connection.";
      } else if (error.code === "ECONNREFUSED") {
        errorResponse.message = "Connection refused. The server might be down.";
      } else if (error.code === "ECONNABORTED") {
        errorResponse.message = "Request timed out. Please try again.";
      } else {
        errorResponse.message = "Network error. Please check your connection.";
      }

      return errorResponse;
    }

    const { status, data } = error.response;

    errorResponse.status = status;
    errorResponse.data = data;

    // Extract message from various API response formats
    let message = this.errorMessages[status as number] || "An error occurred.";

    // Try to extract the error message from the response data
    if (data) {
      if (typeof data === "string") {
        message = data;
      } else if (typeof data === "object") {
        // Extract message from common API error formats
        message =
          (data as { message?: string })?.message ||
          (data as { error?: string })?.error ||
          (data as { error?: { message?: string } })?.error?.message ||
          (data as { errors?: string[] })?.errors?.[0] ||
          message;
      }
    }

    errorResponse.message = message;
    return errorResponse;
  }
}

export default ApiErrorHandler;
export type { ApiErrorResponse };
