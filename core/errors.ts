const describeCause = (cause: unknown): string => (cause instanceof Error ? cause.message : String(cause));

export class ActionError extends Error {
  constructor(message: string, cause: unknown) {
    super(`${message}\nReason: ${describeCause(cause)}`, { cause });
    this.name = 'ActionError';
  }
}
