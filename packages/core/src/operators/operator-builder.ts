import { Operator, OperatorArgs } from './operator';
import { Transformer } from '../utils';

export interface OperatorBuilderArgs extends OperatorArgs { }

export class OperatorBuilder {
  constructor(private args: OperatorBuilderArgs) { }

  build(transform?: Transformer<OperatorBuilderArgs, OperatorArgs>) {
    let args = this.args as unknown as OperatorArgs;
    if (transform)
      args = transform(this.args);
    return new Operator(args);
  }
}

