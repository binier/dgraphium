import { LogicalOperator, LogicalOperatorArgs } from './logical-operator';
import { Transformer } from '../utils';
import { extractRefs } from '../ref';
import type { OpBuilderTypes } from './';

export interface LogicalOperatorBuilderArgs
  extends Omit<LogicalOperatorArgs, 'operators'>
{
  operators: OpBuilderTypes[];
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
