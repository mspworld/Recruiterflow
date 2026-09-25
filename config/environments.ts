export interface EnvironmentProfile {
  uiBaseUrl: string;
  apiBaseUrl: string;
  apiKey: string;
  saucePassword: string;
}

export const environments = {
  production: {
    uiBaseUrl: 'https://www.saucedemo.com',
    apiBaseUrl: 'https://reqres.in',
    apiKey: 'reqres-free-v1',
    saucePassword: 'secret_sauce',
  },
} as const satisfies Record<string, EnvironmentProfile>;

export type EnvironmentName = keyof typeof environments;

export const DEFAULT_ENVIRONMENT: EnvironmentName = 'production';
