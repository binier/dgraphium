import { Operator } from './operator';
import { Param } from '../param';

export type LogicalOperatorType = 'AND' | 'OR' | 'NOT';

export interface LogicalOperatorArgs {
  type: LogicalOperatorType;
  operators: (Operator | LogicalOperator)[];
}

export interface LogicalOperator extends LogicalOperatorArgs { }
export class LogicalOperator {
  constructor(args: LogicalOperatorArgs) {
    Object.assign(this, args);
  }

  params(): Param[] {
    return this.operators.reduce(
      (r, x) => [...r, ...x.params()],
      []
    );
  }

  toString() {
    if (this.type === 'NOT') {
      const op = this.operators[0];
      return op instanceof LogicalOperator
        ? `NOT (${op})`
        : `NOT ${op}`;
    }
    return this.operators
      .map(x => x instanceof LogicalOperator ? `(${x})` : x)
      .join(` ${this.type} `);
  }
}
