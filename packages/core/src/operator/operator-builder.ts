import { Operator, OperatorArgs, OpValue } from './operator';
import { Transformer } from '../utils';
import { ParamBuilder } from '../param';

export type OpBuilderValue = ParamBuilder | OpValue;

export interface OperatorBuilderArgs extends Omit<OperatorArgs, 'value'> {
  value?: OpBuilderValue | OpBuilderValue[];
}

export class OperatorBuilder {
  constructor(private args: OperatorBuilderArgs) { }

  build(transform: Transformer<OperatorBuilderArgs, OperatorArgs>) {
    return new Operator(transform(this.args));
  }
}
