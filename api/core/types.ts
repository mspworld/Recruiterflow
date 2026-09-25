export interface ApiResponse<T> {
  status: number;
  body: T;
}

export interface RequestOptions {
  params?: Record<string, string | number>;
  data?: unknown;
}
