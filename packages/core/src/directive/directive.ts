import { LogicalOperator, Operator } from '../operator';
import { isParamMap, Param } from '../param';
import { RecurseArgs } from './recurse';

export interface DirectiveArgs {
  filter: LogicalOperator | Operator;
  cascade: undefined;
  ignoreReflex: undefined;
  recurse: RecurseArgs | undefined;
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

    if (isParamMap(this.args)) {
      return Object.values(this.args)
    }

    return Array.isArray(this.args)
        // Assumes args is a array of objects which have a "params" method which returns Param[]
      ? this.args.reduce((r, x) => [...r, ...x.params()], [])
       // Assumes args has a "params" method which returns Param[]
       // @ts-expect-error
      : this.args.params();

    // TODO: The assumptions above are not type safe. We need an interface that defines a params() method which returns Param[].
    // this.args should then be contrained by a type which unites the above and ParamMap.
  }

  toString() {
    const out = '@' + this.name

    if (!this.hasArgs()) {
      return out
    }

    if (isParamMap(this.args)) {
      return Object.keys(this.args).reduce((p, c, i) => {
          if (i > 0) {
            p += ', '
          }
          return p += `${c}: ${this.args[c].toString()}`
        }, out + '(') + ')'
    }

    return out + `(${this.args})`
  }
}
