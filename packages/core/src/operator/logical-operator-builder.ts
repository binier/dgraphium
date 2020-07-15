import { LogicalOperator, LogicalOperatorArgs } from './logical-operator';
import { Transformer } from '../utils';
import { OperatorBuilder } from './operator-builder';

export interface LogicalOperatorBuilderArgs
  extends Omit<LogicalOperatorArgs, 'operators'>
{
  operators: (OperatorBuilder | LogicalOperatorBuilder)[];
}

type BuildTransformer = Transformer<
  LogicalOperatorBuilderArgs,
  LogicalOperatorArgs
>;

export class LogicalOperatorBuilder {
  constructor(private args: LogicalOperatorBuilderArgs) { }

  build(transform: BuildTransformer) {
    return new LogicalOperator(transform(this.args));
  }
}
