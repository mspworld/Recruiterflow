import type { CreateUserRequest } from '../types/user.types';
import type { CreatedUser } from './CreatedUser';

export interface ApiScenario {
  payload: CreateUserRequest;
  requestedAt: number;
  createdUser: CreatedUser;
}
