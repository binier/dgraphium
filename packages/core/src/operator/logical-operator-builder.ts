import { LogicalOperator, LogicalOperatorArgs } from './logical-operator';
import { Transformer } from '../utils';
import { OperatorBuilder } from './operator-builder';
import { ParamBuilder } from '../param';

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

  paramBuilders(): ParamBuilder[] {
    return this.args.operators.reduce((r, x) => {
      return [...r, ...x.paramBuilders()];
    }, []);
  }

  build(transform: BuildTransformer) {
    return new LogicalOperator(transform(this.args));
  }
}
