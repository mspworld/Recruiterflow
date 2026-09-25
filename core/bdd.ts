import { test } from '@playwright/test';

type Step<T> = () => Promise<T>;

export const Given = <T>(title: string, body: Step<T>) => test.step(`Given ${title}`, body, { box: true });
export const When = <T>(title: string, body: Step<T>) => test.step(`When ${title}`, body, { box: true });
export const Then = <T>(title: string, body: Step<T>) => test.step(`Then ${title}`, body, { box: true });
export const And = <T>(title: string, body: Step<T>) => test.step(`And ${title}`, body, { box: true });
