import { EdgeBuilder, EdgeBuilderConstructor } from './edge';
import { QueryBuilder, CombinedQueryBuilder } from './query';
import { FieldBuilder } from './field';

export * from './uid';
export * from './field';
export * from './edge';
export * as operator from './operator';
export * as operators from './operators';
export * as param from './param';
export * as params from './params';
export * as aggregation from './aggregation';
export * as aggregations from './aggregations';

export const field = (
  ...args: ConstructorParameters<typeof FieldBuilder>
) => new FieldBuilder(...args);

export const edge: EdgeBuilderConstructor =
  (...args: any[]) => new EdgeBuilder(...args);

export const query = (
  ...args: ConstructorParameters<typeof QueryBuilder>
) => new QueryBuilder(...args);

export const combined = (
  ...queries: (string | QueryBuilder | CombinedQueryBuilder)[]
) => new CombinedQueryBuilder(queries);
