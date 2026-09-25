import { expect } from '@playwright/test';
import type { CreateUserRequest, CreateUserResponse, User } from '@api/types/user.types';

const FIVE_MINUTES = 5 * 60 * 1000;

export function expectUserFields(user: User): void {
  expect(user).toEqual(
    expect.objectContaining({
      id: expect.any(Number),
      email: expect.stringContaining('@'),
      first_name: expect.any(String),
      last_name: expect.any(String),
    }),
  );
}

export function expectCreatedUser(created: CreateUserResponse, sent: CreateUserRequest, requestedAt: number): void {
  expect(created.name).toBe(sent.name);
  expect(created.job).toBe(sent.job);
  expect(created.id).toBeTruthy();

  const createdAt = Date.parse(created.createdAt);
  expect(createdAt, `createdAt "${created.createdAt}" should be a valid date`).not.toBeNaN();
  expect(Math.abs(createdAt - requestedAt), 'createdAt should be close to when the request was sent').toBeLessThan(
    FIVE_MINUTES,
  );
}
