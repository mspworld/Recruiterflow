import { config as loadDotenv } from 'dotenv';
import { DEFAULT_ENVIRONMENT, environments, type EnvironmentName, type EnvironmentProfile } from './environments';

loadDotenv({ quiet: true });

export type EvidenceMode = 'off' | 'failure' | 'full';

const EVIDENCE_MODES: readonly EvidenceMode[] = ['off', 'failure', 'full'];

const readString = (key: string): string | undefined => {
  const value = process.env[key]?.trim();
  return value ? value : undefined;
};

const readNumber = (key: string, fallback: number): number => {
  const raw = readString(key);
  if (raw === undefined) return fallback;
  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed < 0) {
    throw new Error(`${key} must be a non-negative number, received "${raw}"`);
  }
  return parsed;
};

const readBoolean = (key: string, fallback: boolean): boolean => {
  const raw = readString(key)?.toLowerCase();
  if (raw === undefined) return fallback;
  if (['true', '1', 'yes'].includes(raw)) return true;
  if (['false', '0', 'no'].includes(raw)) return false;
  throw new Error(`${key} must be true or false, received "${raw}"`);
};

const readChoice = <T extends string>(key: string, choices: readonly T[], fallback: T): T => {
  const raw = readString(key);
  if (raw === undefined) return fallback;
  if (!choices.includes(raw as T)) {
    throw new Error(`${key} must be one of ${choices.join(', ')}, received "${raw}"`);
  }
  return raw as T;
};

export class GlobalConfig {
  private static instance?: GlobalConfig;

  readonly environment: EnvironmentName;
  readonly ui: { baseUrl: string; password: string };
  readonly api: { baseUrl: string; apiKey: string; maxRetries: number; retryDelayMs: number };
  readonly run: { isCI: boolean; headed: boolean; slowMoMs: number; evidence: EvidenceMode; retries: number; workers?: number };
  readonly timeouts: { test: number; expect: number; action: number; navigation: number };

  private constructor() {
    this.environment = readChoice('TEST_ENV', Object.keys(environments) as EnvironmentName[], DEFAULT_ENVIRONMENT);
    const profile: EnvironmentProfile = environments[this.environment];
    const isCI = readBoolean('CI', false);

    this.ui = {
      baseUrl: readString('UI_BASE_URL') ?? profile.uiBaseUrl,
      password: readString('SAUCE_PASSWORD') ?? profile.saucePassword,
    };

    this.api = {
      baseUrl: readString('API_BASE_URL') ?? profile.apiBaseUrl,
      apiKey: readString('REQRES_API_KEY') ?? profile.apiKey,
      maxRetries: readNumber('API_MAX_RETRIES', 2),
      retryDelayMs: readNumber('API_RETRY_DELAY_MS', 500),
    };

    this.run = {
      isCI,
      headed: readBoolean('HEADED', false),
      slowMoMs: readNumber('SLOW_MO', 0),
      evidence: readChoice('EVIDENCE', EVIDENCE_MODES, 'failure'),
      retries: readNumber('RETRIES', isCI ? 2 : 1),
      workers: readString('WORKERS') ? readNumber('WORKERS', 1) : isCI ? 2 : undefined,
    };

    this.timeouts = {
      test: readNumber('TEST_TIMEOUT_MS', 30_000),
      expect: readNumber('EXPECT_TIMEOUT_MS', 7_000),
      action: readNumber('ACTION_TIMEOUT_MS', 10_000),
      navigation: readNumber('NAVIGATION_TIMEOUT_MS', 20_000),
    };
  }

  static get(): GlobalConfig {
    GlobalConfig.instance ??= new GlobalConfig();
    return GlobalConfig.instance;
  }

  get evidence(): { screenshot: 'on' | 'off' | 'only-on-failure'; video: 'on' | 'off'; trace: 'off' | 'retain-on-failure' } {
    switch (this.run.evidence) {
      case 'full':
        return { screenshot: 'on', video: 'on', trace: 'retain-on-failure' };
      case 'failure':
        return { screenshot: 'only-on-failure', video: 'off', trace: 'retain-on-failure' };
      case 'off':
        return { screenshot: 'off', video: 'off', trace: 'off' };
    }
  }
}

export const config = GlobalConfig.get();
