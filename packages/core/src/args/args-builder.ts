import { Transformer } from '../utils';
import { OperatorBuilder } from '../operator';
import { Args, ArgsData } from './args';
import { extractRefs } from '../ref';

export interface ArgsBuilderData extends Omit<ArgsData, 'func'> {
  func?: OperatorBuilder;
}

/** func, pagination and sorting */
export class ArgsBuilder {
  constructor(
    private args: ArgsBuilderData = {}
  ) { }

  get all() {
    return this.args;
  }

  setArg<K extends keyof ArgsBuilderData>(key: K, val: ArgsBuilderData[K]) {
    this.args[key] = val;
  }

  get func() { return this.args.func; }
  get first() { return this.args.first; }
  get offset() { return this.args.offset; }
  get after() { return this.args.after; }

  refs() {
    return extractRefs(this.args);
  }

  length() {
    return Object.values(this.args)
      .filter(x => x)
      .length;
  }

  build(transform: Transformer<ArgsBuilderData, ArgsData>) {
    return new Args(transform(this.args));
  }
}
