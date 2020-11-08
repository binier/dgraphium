export * from './operator';
export * from './operator-builder';
export * from './logical-operator';
export * from './logical-operator-builder';

import { Operator } from './operator';
import { OperatorBuilder } from './operator-builder';
import { LogicalOperator } from './logical-operator';
import { LogicalOperatorBuilder } from './logical-operator-builder';

export type OpBuilderTypes = OperatorBuilder | LogicalOperatorBuilder;
export type BuiltOpTypes = Operator | LogicalOperator;
export type OpTypes = OpBuilderTypes | BuiltOpTypes;

export function isOpBuilder(v: any): v is OpBuilderTypes {
  return v instanceof OperatorBuilder || v instanceof LogicalOperatorBuilder;
}
