export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type QueryParams = Record<string, string | number | boolean>;

export interface RequestOptions {
  params?: QueryParams;
  data?: unknown;
}

export interface ApiResponse<T> {
  status: number;
  ok: boolean;
  headers: Record<string, string>;
  body: T;
  durationMs: number;
}

export interface ApiExchange {
  request: { method: HttpMethod; path: string } & RequestOptions;
  response: { status: number; durationMs: number; body: unknown };
  attempts: number;
}

export type ExchangeRecorder = (exchange: ApiExchange) => Promise<void>;
