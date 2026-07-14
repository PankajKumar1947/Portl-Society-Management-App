export type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data: T;
};

export interface ApiErrorResponse {
  isError: true;
  message: string;
  status?: number;
  code?: string;
  data?: unknown;
}
