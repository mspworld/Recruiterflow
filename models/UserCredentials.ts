export class UserCredentials {
  constructor(
    readonly username: string,
    readonly password: string,
  ) {}

  toJSON() {
    return { username: this.username };
  }
}
