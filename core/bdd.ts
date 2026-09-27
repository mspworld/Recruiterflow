import { test } from '@playwright/test';
import { captureStep } from './evidence';

type Step<T> = () => Promise<T>;

const runStep = <T>(title: string, body: Step<T>) =>
  test.step(
    title,
    async () => {
      const result = await body();
      await captureStep(title);
      return result;
    },
    { box: true },
  );

export const Given = <T>(title: string, body: Step<T>) => runStep(`Given ${title}`, body);
export const When = <T>(title: string, body: Step<T>) => runStep(`When ${title}`, body);
export const Then = <T>(title: string, body: Step<T>) => runStep(`Then ${title}`, body);
export const And = <T>(title: string, body: Step<T>) => runStep(`And ${title}`, body);
