import { expect } from '@playwright/test';
import type { CreateUserRequest, CreateUserResponse, User } from '../types/user.types';

const CLOCK_SKEW_TOLERANCE_MS = 5 * 60 * 1000;

export function expectUserShape(user: User, index: number): void {
  expect(user, `User at index ${index} should have id, email, first_name and last_name`).toEqual(
    expect.objectContaining({
      id: expect.any(Number),
      email: expect.stringMatching(/^\S+@\S+\.\S+$/),
      first_name: expect.stringMatching(/\S/),
      last_name: expect.stringMatching(/\S/),
    }),
  );
}

export function expectCreatedUser(body: CreateUserResponse, payload: CreateUserRequest, requestedAt: number): void {
  expect(body, 'Created user should echo the request').toMatchObject({ name: payload.name, job: payload.job });
  expect(String(body.id), 'Created user id').toMatch(/^\S+$/);

  const createdAt = Date.parse(body.createdAt);
  expect(Number.isNaN(createdAt), `createdAt "${body.createdAt}" should be a valid timestamp`).toBe(false);
  expect(Math.abs(createdAt - requestedAt), 'createdAt should be close to the request time').toBeLessThan(
    CLOCK_SKEW_TOLERANCE_MS,
  );
}
