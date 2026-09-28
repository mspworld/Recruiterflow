import { config } from '@config/GlobalConfig';
import { UserCredentials } from '@models/UserCredentials';

export const users = {
  standard: new UserCredentials('standard_user', config.password),
  lockedOut: new UserCredentials('locked_out_user', config.password),
};
