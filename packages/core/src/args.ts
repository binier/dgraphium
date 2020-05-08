import { Uid } from './uid';

export interface ArgsData {
  func?: string;
  first?: number;
  offset?: number;
  after?: Uid;
}

export type EdgeArgs = Omit<ArgsData, 'func'>;
export type QueryArgs = ArgsData;

/** func, pagination and sorting */
export class Args {
  constructor(
    private args: ArgsData = {}
  ) { }

  setArg<K extends keyof ArgsData>(key: K, val: ArgsData[K]) {
    this.args[key] = val;
  }

  length() {
    return Object.values(this.args)
      .filter(x => x)
      .length;
  }

  toString() {
    return Object.entries(this.args)
      .filter(x => x[1])
      .map(x => x.join(': '))
      .join(', ')
      .trim();
  }
}

