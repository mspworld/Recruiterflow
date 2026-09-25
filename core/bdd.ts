import { test } from '@playwright/test';

type StepBody<T> = () => Promise<T>;

const keyword =
  (prefix: string) =>
  <T>(title: string, body: StepBody<T>): Promise<T> =>
    test.step(`${prefix} ${title}`, body, { box: true });

export const Given = keyword('Given');
export const When = keyword('When');
export const Then = keyword('Then');
export const And = keyword('And');
