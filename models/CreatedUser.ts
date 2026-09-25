import type { CreateUserResponse } from '@api/types/user.types';

export class CreatedUser {
  private _id = '';
  private _name = '';
  private _job = '';
  private _createdAt = '';

  static fromResponse(body: CreateUserResponse): CreatedUser {
    const user = new CreatedUser();
    user.id = String(body.id);
    user.name = body.name;
    user.job = body.job;
    user.createdAt = body.createdAt;
    return user;
  }

  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get job(): string {
    return this._job;
  }

  set job(value: string) {
    this._job = value;
  }

  get createdAt(): string {
    return this._createdAt;
  }

  set createdAt(value: string) {
    this._createdAt = value;
  }

  toJSON(): { id: string; name: string; job: string; createdAt: string } {
    return { id: this._id, name: this._name, job: this._job, createdAt: this._createdAt };
  }
}
