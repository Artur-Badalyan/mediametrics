interface ApiError {
  code: string;
  message: string;
  details?: any;
}

export function formatError(code: string, message: string, details?: any): { error: ApiError } {
  return { error: { code, message, details } };
}