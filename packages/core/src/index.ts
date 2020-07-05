import { EdgeBuilder, EdgeBuilderConstructor } from './edge';
import { QueryBuilder } from './query';

export * from './uid';
export * from './edge';
export * as operator from './operator';
export * as operators from './operators';
export * as param from './param/param';
export * as params from './params';

export const edge: EdgeBuilderConstructor =
  (...args: any[]) => new EdgeBuilder(...args);

export const query = (
  ...args: ConstructorParameters<typeof QueryBuilder>
) => new QueryBuilder(...args);
