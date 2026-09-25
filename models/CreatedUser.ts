import type { CreateUserResponse } from '@api/types/user.types';

export class CreatedUser {
  private _id: string;
  private _name: string;
  private _job: string;
  private _createdAt: string;

  constructor(id: string, name: string, job: string, createdAt: string) {
    this._id = id;
    this._name = name;
    this._job = job;
    this._createdAt = createdAt;
  }

  static fromResponse(body: CreateUserResponse): CreatedUser {
    return new CreatedUser(String(body.id), body.name, body.job, body.createdAt);
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

  toJSON(): CreateUserResponse {
    return { id: this._id, name: this._name, job: this._job, createdAt: this._createdAt };
  }
}
