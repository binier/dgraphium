import { OperatorBuilder, LogicalOperatorBuilder } from '../operator';

type OpBuilder = OperatorBuilder | LogicalOperatorBuilder;

export function and(...operators: OpBuilder[]) {
  return new LogicalOperatorBuilder({ type: 'AND', operators });
}

export function or(...operators: OpBuilder[]) {
  return new LogicalOperatorBuilder({ type: 'OR', operators });
}

export function not(operator: OpBuilder);
export function not(...operators: OpBuilder[]) {
  return new LogicalOperatorBuilder({ type: 'NOT', operators });
}
