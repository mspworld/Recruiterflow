import { DataFactory } from '@core/DataFactory';
import type { CreateUserRequest } from '../types/user.types';

export const userPayloads = {
  morpheus: { name: 'morpheus', job: 'leader' },
} as const satisfies Record<string, CreateUserRequest>;

export const buildUserPayload = (overrides: Partial<CreateUserRequest> = {}): CreateUserRequest => ({
  name: `${DataFactory.firstName().toLowerCase()}-${DataFactory.uniqueSuffix()}`,
  job: DataFactory.jobTitle(),
  ...overrides,
});

export const LIST_PAGE = 2;
