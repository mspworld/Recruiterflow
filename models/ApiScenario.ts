import type { CreateUserRequest } from '@api/types/user.types';
import type { CreatedUser } from './CreatedUser';

export interface ApiScenario {
  payload: CreateUserRequest;
  requestedAt: number;
  createdUser: CreatedUser;
}
