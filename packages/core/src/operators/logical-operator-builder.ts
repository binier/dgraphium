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

function defaultTransform(
  args: LogicalOperatorBuilderArgs
): LogicalOperatorArgs {
  return {
    ...args,
    operators: args.operators.map(op => {
      if (op instanceof OperatorBuilder)
        return op.build();
      else
        return op.build(defaultTransform);
    }),
  }
}


export class LogicalOperatorBuilder {
  constructor(private args: LogicalOperatorBuilderArgs) { }

  build(transform: BuildTransformer = defaultTransform) {
    return new LogicalOperator(transform(this.args));
  }
}

