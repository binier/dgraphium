import { Operator } from './operator';

export type LogicalOperatorType = 'AND' | 'OR' | 'NOT';

export interface LogicalOperatorArgs {
  type: LogicalOperatorType;
  operators: (Operator | LogicalOperator)[];
}

export interface LogicalOperator extends LogicalOperatorArgs { }
export class LogicalOperator {
  constructor(args: LogicalOperator) {
    Object.assign(this, args);
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
