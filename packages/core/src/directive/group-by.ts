
import { Param, ParamBuilder } from '../param';

/** @see https://dgraph.io/docs/query-language/groupby/ */
// predicate
export type GroupByBuilderArgs = string | ParamBuilder<'string'>

export type GroupByArgs = string | Param<'string'>;
