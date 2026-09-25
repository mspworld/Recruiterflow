import type { APIRequestContext, APIResponse, TestInfo } from '@playwright/test';
import { config } from '@config/GlobalConfig';
import { attachJson } from '@core/evidence';
import { withRetry } from '@core/retry';
import { ApiError } from './ApiError';
import type { ApiResponse, RequestOptions } from './types';

const RETRY_STATUSES = [408, 429, 500, 502, 503, 504];

export abstract class BaseApiClient {
  constructor(
    private readonly request: APIRequestContext,
    private readonly testInfo?: TestInfo,
  ) {}

  protected get<T>(path: string, params?: RequestOptions['params']): Promise<ApiResponse<T>> {
    return this.send<T>('GET', path, { params });
  }

  protected post<T>(path: string, data: unknown): Promise<ApiResponse<T>> {
    return this.send<T>('POST', path, { data });
  }

  private async send<T>(method: string, path: string, options: RequestOptions): Promise<ApiResponse<T>> {
    const response = await withRetry(
      () => this.fetchOnce(method, path, options),
      config.apiRetries,
      (error) => error instanceof ApiError && error.retryable,
    );

    const result = { status: response.status(), body: await this.readJson<T>(response, method, path) };

    if (this.testInfo) {
      await attachJson(this.testInfo, `${method} ${path}`, { request: { method, path, ...options }, response: result });
    }
    return result;
  }

  private async fetchOnce(method: string, path: string, options: RequestOptions): Promise<APIResponse> {
    let response: APIResponse;
    try {
      response = await this.request.fetch(path, { method, ...options });
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);
      throw new ApiError(`${method} ${path} got no response: ${reason}`, true);
    }

    if (RETRY_STATUSES.includes(response.status())) {
      throw new ApiError(`${method} ${path} returned ${response.status()}`, true);
    }
    return response;
  }

  private async readJson<T>(response: APIResponse, method: string, path: string): Promise<T> {
    const text = await response.text();
    if (!text) return undefined as T;

    try {
      return JSON.parse(text) as T;
    } catch {
      throw new ApiError(`${method} ${path} did not return JSON (status ${response.status()}): ${text.slice(0, 200)}`);
    }
  }
}
