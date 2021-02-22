import { LogicalOperator, Operator } from '../operator';
import { Param } from '../param';
import { RecurseArgs } from './recurse';
import { GroupByArgs } from './group-by';

export interface DirectiveArgs {
  filter: LogicalOperator | Operator;
  cascade: undefined;
  ignoreReflex: undefined;
  recurse: RecurseArgs | undefined;
  groupBy: GroupByArgs;
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
    const argsValues = !this.hasArgs() ? []
    : Array.isArray(this.args) ? this.args
    : typeof this.args!=='object'? [this.args]
    : Object.entries(this.args).map(([_, value]) => value);

    return argsValues.reduce((r, arg) => {
      if (arg instanceof Param)
        return [...r, arg];
      if (arg['params'])
        return [...r, ...arg.params()];
      return r;
    }, []);
  }

  toString() {
    const argsList = !this.hasArgs() ? []
      : Array.isArray(this.args) ? this.args
      : typeof this.args!=='object'? [this.args]
      : Object.entries(this.args).map(([key, value]) => `${key}: ${value}`);

    return `@${this.name.toLowerCase()}${
      !argsList.length ? '' : `(${argsList.join(', ')})`
    }`;
  }
}
