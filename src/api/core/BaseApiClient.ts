import type { APIRequestContext, APIResponse } from '@playwright/test';
import { env } from '@config/env';
import { withRetry } from '@core/retry';
import { ApiError } from './ApiError';
import type { ApiResponse, ExchangeRecorder, HttpMethod, RequestOptions } from './types';

const RETRYABLE_STATUSES = new Set([408, 429, 500, 502, 503, 504]);

export abstract class BaseApiClient {
  constructor(
    private readonly request: APIRequestContext,
    private readonly record?: ExchangeRecorder,
  ) {}

  protected get<T>(path: string, options: Omit<RequestOptions, 'data'> = {}): Promise<ApiResponse<T>> {
    return this.send<T>('GET', path, options);
  }

  protected post<T>(path: string, data: unknown, options: Omit<RequestOptions, 'data'> = {}): Promise<ApiResponse<T>> {
    return this.send<T>('POST', path, { ...options, data });
  }

  private async send<T>(method: HttpMethod, path: string, options: RequestOptions): Promise<ApiResponse<T>> {
    let attempts = 0;

    const result = await withRetry(
      async () => {
        attempts++;
        const startedAt = Date.now();
        const response = await this.dispatch(method, path, options);
        const durationMs = Date.now() - startedAt;

        if (RETRYABLE_STATUSES.has(response.status())) {
          throw new ApiError(`${method} ${path} returned ${response.status()}`, true, response.status());
        }

        return {
          status: response.status(),
          ok: response.ok(),
          headers: response.headers(),
          body: await this.parseBody<T>(response, method, path),
          durationMs,
        };
      },
      {
        retries: env.apiMaxRetries,
        baseDelayMs: 500,
        shouldRetry: (error) => error instanceof ApiError && error.retryable,
      },
    );

    await this.record?.({
      request: { method, path, ...options },
      response: { status: result.status, durationMs: result.durationMs, body: result.body },
      attempts,
    });

    return result;
  }

  private async dispatch(method: HttpMethod, path: string, options: RequestOptions): Promise<APIResponse> {
    try {
      return await this.request.fetch(path, { method, params: options.params, data: options.data });
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);
      throw new ApiError(`${method} ${path} failed before a response was received: ${reason}`, true, undefined, { cause: error });
    }
  }

  private async parseBody<T>(response: APIResponse, method: HttpMethod, path: string): Promise<T> {
    const text = await response.text();
    if (!text.trim()) return undefined as T;

    try {
      return JSON.parse(text) as T;
    } catch (error) {
      throw new ApiError(
        `${method} ${path} returned ${response.status()} with a non-JSON body: ${text.slice(0, 200)}`,
        false,
        response.status(),
        { cause: error },
      );
    }
  }
}
