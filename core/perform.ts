import { ActionError } from './errors';

export async function perform<T>(description: string, action: () => Promise<T>): Promise<T> {
  try {
    return await action();
  } catch (error) {
    throw new ActionError(`Could not ${description}`, error);
  }
}
