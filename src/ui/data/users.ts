import { env } from '@config/env';
import { UserCredentials } from '../models/UserCredentials';

export const users = {
  standard: UserCredentials.of('standard_user', env.saucePassword),
  lockedOut: UserCredentials.of('locked_out_user', env.saucePassword),
  problem: UserCredentials.of('problem_user', env.saucePassword),
} as const;
