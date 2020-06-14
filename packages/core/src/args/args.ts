import { Uid } from '../uid';
import { Operator } from '../operator';

export interface ArgsData {
  func?: Operator;
  first?: number;
  offset?: number;
  after?: Uid;
}

/** func, pagination and sorting */
export class Args {
  constructor(
    private args: ArgsData = {}
  ) { }

  get func() { return this.args.func; }
  get first() { return this.args.first; }
  get offset() { return this.args.offset; }
  get after() { return this.args.after; }

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
