import { config as loadEnvFile } from 'dotenv';
import { environments, type EnvironmentName } from './environments';

loadEnvFile({ quiet: true });

export type EvidenceMode = 'off' | 'failure' | 'full';

class GlobalConfig {
  readonly environment: EnvironmentName;
  readonly uiBaseUrl: string;
  readonly apiBaseUrl: string;
  readonly apiKey: string;
  readonly password: string;
  readonly evidence: EvidenceMode;
  readonly headed: boolean;
  readonly slowMo: number;
  readonly apiRetries: number;
  readonly isCI: boolean;

  constructor() {
    const environment = process.env.TEST_ENV || 'production';
    if (!(environment in environments)) {
      throw new Error(`Unknown TEST_ENV "${environment}". Available: ${Object.keys(environments).join(', ')}`);
    }
    this.environment = environment as EnvironmentName;
    const profile = environments[this.environment];

    this.uiBaseUrl = process.env.UI_BASE_URL || profile.uiBaseUrl;
    this.apiBaseUrl = process.env.API_BASE_URL || profile.apiBaseUrl;
    this.apiKey = process.env.REQRES_API_KEY || profile.apiKey;
    this.password = process.env.SAUCE_PASSWORD || profile.saucePassword;

    const evidence = process.env.EVIDENCE || 'failure';
    if (!['off', 'failure', 'full'].includes(evidence)) {
      throw new Error(`EVIDENCE must be off, failure or full. Got "${evidence}"`);
    }
    this.evidence = evidence as EvidenceMode;

    this.headed = process.env.HEADED === 'true';
    this.slowMo = Number(process.env.SLOW_MO || 0);
    this.apiRetries = Number(process.env.API_RETRIES || 2);
    this.isCI = Boolean(process.env.CI);
  }
}

export const config = new GlobalConfig();
