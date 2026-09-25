export class ActionError extends Error {
  constructor(message: string, cause: unknown) {
    const reason = cause instanceof Error ? cause.message : String(cause);
    super(`${message}\nReason: ${reason}`, { cause });
    this.name = 'ActionError';
  }
}
