import type { APIRequestContext, APIResponse, TestInfo } from '@playwright/test';
import { config } from '@config/GlobalConfig';
import { attachJson } from '@core/evidence';
import { withRetry } from '@core/retry';
import { ApiError } from './ApiError';
import type { ApiResponse, RequestOptions } from './types';

const RETRY_STATUSES = [408, 500, 502, 503, 504];
const RATE_LIMITED = 429;

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
    let outcome: unknown;
    try {
      const response = await withRetry(
        () => this.fetchOnce(method, path, options),
        config.apiRetries,
        (error) => error instanceof ApiError && error.retryable,
      );
      const result = { status: response.status(), body: await this.readJson<T>(response, method, path) };
      outcome = result;
      return result;
    } catch (error) {
      outcome = { error: error instanceof Error ? error.message : String(error) };
      throw error;
    } finally {
      if (this.testInfo) {
        await attachJson(this.testInfo, `${method} ${path}`, { request: { method, path, ...options }, response: outcome });
      }
    }
  }

  private async fetchOnce(method: string, path: string, options: RequestOptions): Promise<APIResponse> {
    let response: APIResponse;
    try {
      response = await this.request.fetch(path, { method, ...options });
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);
      throw new ApiError(`${method} ${path} got no response: ${reason}`, true);
    }

    if (response.status() === RATE_LIMITED) {
      throw new ApiError(`${method} ${path} was rate-limited (429): ${await this.readMessage(response)}`);
    }

    if (RETRY_STATUSES.includes(response.status())) {
      throw new ApiError(`${method} ${path} returned ${response.status()}`, true);
    }
    return response;
  }

  private async readMessage(response: APIResponse): Promise<string> {
    const text = await response.text();
    try {
      const body = JSON.parse(text);
      return [body.message, body.resets_in && `Resets in ${body.resets_in}.`].filter(Boolean).join(' ');
    } catch {
      return text.slice(0, 200);
    }
  }

  private async readJson<T>(response: APIResponse, method: string, path: string): Promise<T> {
    const text = await response.text();
    if (!text) {
      throw new ApiError(`${method} ${path} returned an empty body (status ${response.status()})`);
    }

    try {
      return JSON.parse(text) as T;
    } catch {
      throw new ApiError(`${method} ${path} did not return JSON (status ${response.status()}): ${text.slice(0, 200)}`);
    }
  }
}
