import { Operator, OperatorArgs, OpValue, OpArg } from './operator';
import { Transformer } from '../utils';
import { ParamBuilder } from '../param';

export type OpBuilderValue = ParamBuilder | OpValue;
export type OpBuilderArg = ParamBuilder | OpArg;

export interface OperatorBuilderArgs
  extends Omit<OperatorArgs, 'value' | 'arg'>
{
  value?: OpBuilderValue | OpBuilderValue[];
  arg?: OpBuilderArg;
}

export class OperatorBuilder {
  constructor(private args: OperatorBuilderArgs) { }

  build(transform: Transformer<OperatorBuilderArgs, OperatorArgs>) {
    return new Operator(transform(this.args));
  }
}
