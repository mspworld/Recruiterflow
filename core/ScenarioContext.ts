export class ScenarioContext<T extends object> {
  private readonly data: Partial<T> = {};

  set<K extends keyof T>(key: K, value: T[K]): void {
    this.data[key] = value;
  }

  get<K extends keyof T>(key: K): T[K] {
    const value = this.data[key];
    if (value === undefined) {
      throw new Error(`Scenario data "${String(key)}" was read before an earlier step set it`);
    }
    return value as T[K];
  }

  isEmpty(): boolean {
    return Object.keys(this.data).length === 0;
  }

  toJSON(): Partial<T> {
    return this.data;
  }
}
