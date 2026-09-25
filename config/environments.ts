export const environments = {
  production: {
    uiBaseUrl: 'https://www.saucedemo.com',
    apiBaseUrl: 'https://reqres.in',
    apiKey: 'reqres-free-v1',
    saucePassword: 'secret_sauce',
  },
};

export type EnvironmentName = keyof typeof environments;
