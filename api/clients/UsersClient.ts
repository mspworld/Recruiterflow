import { BaseApiClient } from '@api/core/BaseApiClient';
import type { ApiResponse } from '@api/core/types';
import { endpoints } from '@api/endpoints';
import type { CreateUserRequest, CreateUserResponse, UserListResponse } from '@api/types/user.types';

export class UsersClient extends BaseApiClient {
  listUsers(page: number): Promise<ApiResponse<UserListResponse>> {
    return this.get<UserListResponse>(endpoints.users, { page });
  }

  createUser(payload: CreateUserRequest): Promise<ApiResponse<CreateUserResponse>> {
    return this.post<CreateUserResponse>(endpoints.users, payload);
  }
}
