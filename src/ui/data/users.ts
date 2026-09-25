import { config } from '@config/GlobalConfig';
import { UserCredentials } from '../models/UserCredentials';

export const users = {
  standard: UserCredentials.of('standard_user', config.ui.password),
  lockedOut: UserCredentials.of('locked_out_user', config.ui.password),
  problem: UserCredentials.of('problem_user', config.ui.password),
} as const;
