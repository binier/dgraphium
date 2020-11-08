
import { Param, ParamBuilder } from '../param';

/** @see https://dgraph.io/docs/query-language/recurse-query/ */
export type RecurseBuilderArgs = undefined | {
  /**
   * The **loop** parameter can be set to `false`, in which case
   * paths which lead to a loop would be ignored while traversing.
   * */
  loop?: boolean | ParamBuilder<'boolean'>;
  /** the maximum depth to recurse. */
  depth?: number | ParamBuilder<'int'>;
}

export type RecurseArgs = undefined | {
  loop?: boolean | Param<'boolean'>;
  depth?: number | Param<'int'>;
}
