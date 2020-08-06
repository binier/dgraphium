import { Param } from './param';

export interface Runnable {
  params(): Readonly<Param[]>;
  toString(extraDepth?: number): string;
}
