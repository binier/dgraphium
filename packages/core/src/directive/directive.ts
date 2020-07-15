import { LogicalOperator, Operator } from '../operator';
import { Param } from '../param';

export interface DirectiveArgs {
  filter: LogicalOperator | Operator;
}

export class Directive<T extends keyof DirectiveArgs = any> {
  constructor(
    private name: T,
    private args?: DirectiveArgs[T]
  ) { }

  hasArgs(): boolean {
    return !!(Array.isArray(this.args) ? this.args.length : this.args);
  }

  params(): Param[] {
    return Array.isArray(this.args)
      ? this.args.reduce((r, x) => [...r, ...x.params()], [])
      : this.args.params();
  }

  toString() {
    return '@' + this.name
      + (this.hasArgs() ? `(${this.args})` : '');
  }
}
