
import { Param, ParamBuilder } from '../param';

export type RecurseBuilderArgs = undefined | {
  loop?: boolean | ParamBuilder<'boolean'>;
  depth?: number | ParamBuilder<'int'>;
}

export type RecurseArgs = undefined | {
  loop?: boolean | Param<'boolean'>;
  depth?: number | Param<'int'>;
}
