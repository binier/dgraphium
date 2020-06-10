import { LogicalOperatorBuilder } from './logical-operator-builder';
import { OperatorBuilder } from './operator-builder';

type OpBuilder = OperatorBuilder | LogicalOperatorBuilder;

export function and(...ops: OpBuilder[]) {
  return new LogicalOperatorBuilder({ type: 'AND', operators: ops });
}

export function or(...ops: OpBuilder[]) {
  return new LogicalOperatorBuilder({ type: 'OR', operators: ops });
}

export function not(op: OpBuilder) {
  return new LogicalOperatorBuilder({ type: 'NOT', operators: [op] });
}

