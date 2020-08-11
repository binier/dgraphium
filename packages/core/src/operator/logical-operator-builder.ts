import { LogicalOperator, LogicalOperatorArgs } from './logical-operator';
import { Transformer } from '../utils';
import { OperatorBuilder } from './operator-builder';
import { extractRefs } from '../ref';

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

  refs() {
    return extractRefs(this.args.operators);
  }

  build(transform: BuildTransformer) {
    return new LogicalOperator(transform(this.args));
  }
}
