import { Operator, OperatorArgs, OpValue, OpArg } from './operator';
import { Transformer } from '../utils';
import { ParamBuilder } from '../param';
import { Ref } from '../ref';

export type OpBuilderValue = ParamBuilder | Ref | OpValue;
export type OpBuilderArg = ParamBuilder | OpArg;

export interface OperatorBuilderArgs
  extends Omit<OperatorArgs, 'value' | 'arg'>
{
  value?: OpBuilderValue | OpBuilderValue[];
  arg?: OpBuilderArg;
}

export class OperatorBuilder {
  constructor(private args: OperatorBuilderArgs) { }

  refs(): Ref[] {
    return [].concat(this.args.value, this.args.arg)
      .filter(x => x instanceof Ref) as Ref[];
  }

  build(transform: Transformer<OperatorBuilderArgs, OperatorArgs>) {
    return new Operator(transform(this.args));
  }
}
