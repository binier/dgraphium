import { EdgeBuilder, EdgeBuilderConstructor } from './edge';

export * from './uid';
export * from './edge';
export * as operator from './operator';
export * as operators from './operators';
export * as param from './param/param';
export * as params from './param/param-types';

export const edge: EdgeBuilderConstructor =
  (...args: any[]) => new EdgeBuilder(...args);
