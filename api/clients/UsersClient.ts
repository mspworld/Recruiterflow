import { BaseApiClient } from '../core/BaseApiClient';
import type { ApiResponse } from '../core/types';
import { endpoints } from '../endpoints';
import type { CreateUserRequest, CreateUserResponse, UserListResponse } from '../types/user.types';

export class UsersClient extends BaseApiClient {
  listUsers(page: number): Promise<ApiResponse<UserListResponse>> {
    return this.get<UserListResponse>(endpoints.users.collection, { params: { page } });
  }

  createUser(payload: CreateUserRequest): Promise<ApiResponse<CreateUserResponse>> {
    return this.post<CreateUserResponse>(endpoints.users.collection, payload);
  }
}
