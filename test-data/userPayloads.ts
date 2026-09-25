import type { CreateUserRequest } from '@api/types/user.types';
import { DataFactory } from '@core/DataFactory';

export const morpheus: CreateUserRequest = { name: 'morpheus', job: 'leader' };

export const newUserPayload = (): CreateUserRequest => ({
  name: DataFactory.uniqueName('qa-user'),
  job: DataFactory.job(),
});
