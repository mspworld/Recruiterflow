export class UserCredentials {
  private constructor(
    private readonly _username: string,
    private readonly _password: string,
  ) {}

  static of(username: string, password: string): UserCredentials {
    return new UserCredentials(username, password);
  }

  get username(): string {
    return this._username;
  }

  get password(): string {
    return this._password;
  }

  toJSON(): { username: string } {
    return { username: this._username };
  }
}
