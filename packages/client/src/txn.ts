import * as grpc from 'grpc';
import { Txn, Response } from 'dgraph-js';
import { paramsToObj } from './common';
import { Query, PoppedFnArgs } from './types';

type QueryFn = (q: string, metadata?: grpc.Metadata, options?: grpc.CallOptions) => Promise<Response>;
type queryWithVarsFn = (q: string, vars?: {
  [k: string]: any;
}, metadata?: grpc.Metadata, options?: grpc.CallOptions) => Promise<Response>;

declare module 'dgraph-js/lib/txn' {
  export interface Txn {
    _query: QueryFn;
    _queryWithVars: queryWithVarsFn;

    query(query: Query | string, ...args: PoppedFnArgs<QueryFn>): ReturnType<QueryFn>;
    queryWithVars(query: Query | string, ...args: PoppedFnArgs<queryWithVarsFn>): ReturnType<queryWithVarsFn>;
  }
}

Txn.prototype._query = Txn.prototype.query;
Txn.prototype._queryWithVars = Txn.prototype.queryWithVars;

Txn.prototype.query = function (query, ...args) {
  return typeof query === 'string'
    ? this._query(query, ...args)
    : this.queryWithVars(query, {}, ...args);
}

Txn.prototype.queryWithVars = function (query, vars, ...args) {
  if (typeof query === 'string')
    return this._queryWithVars(query, vars, ...args);

  const params = Object.assign(paramsToObj(query.params()), vars);
  return this._queryWithVars(
    query.toString(),
    params,
    ...args
  );
}

export { Txn };
