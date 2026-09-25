export class ScenarioContext<TState extends object> {
  private readonly store = new Map<keyof TState, TState[keyof TState]>();

  set<K extends keyof TState>(key: K, value: TState[K]): this {
    this.store.set(key, value);
    return this;
  }

  get<K extends keyof TState>(key: K): TState[K] {
    if (!this.store.has(key)) {
      throw new Error(`ScenarioContext: "${String(key)}" was read before it was set`);
    }
    return this.store.get(key) as TState[K];
  }

  has<K extends keyof TState>(key: K): boolean {
    return this.store.has(key);
  }

  isEmpty(): boolean {
    return this.store.size === 0;
  }

  toJSON(): Partial<TState> {
    return Object.fromEntries(this.store) as Partial<TState>;
  }
}
