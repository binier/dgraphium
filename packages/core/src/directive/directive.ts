import { LogicalOperator, Operator } from '../operator';
import { Param } from '../param';
import { Recurse } from './recurse';

export interface DirectiveArgs {
  filter: LogicalOperator | Operator;
  cascade: undefined;
  ignoreReflex: undefined;
  recurse: Recurse | undefined;
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
    if (!this.hasArgs()) return [];

    return Array.isArray(this.args)
      ? this.args.reduce((r, x) => [...r, ...x.params()], [])
      : this.args.params();
  }

  toString() {
    return '@' + this.name
      + (this.hasArgs() ? `(${this.args})` : '');
  }
}
