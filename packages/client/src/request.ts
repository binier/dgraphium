import { Request } from 'dgraph-js';
import { paramsToObj } from './common';
import { Query } from './types';

declare module 'dgraph-js/generated/api_pb' {
  export interface Request {
    _setQuery: (query: string) => void;

    setQuery(query: Query | string): void;
    setQueryWithVars(query: Query | string, vars?: Record<string, string>): void;
  }
}

Request.prototype._setQuery = Request.prototype.setQuery;

Request.prototype.setQuery = function (query) {
  return typeof query === 'string'
    ? this._setQuery(query)
    : this.setQueryWithVars(query, {});
}

Request.prototype.setQueryWithVars = function (query, vars = {}) {
  this._setQuery(query.toString());

  const varsMap = this.getVarsMap();
  const params = typeof query === 'string' ? vars
    : { ...paramsToObj(query.params()), ...vars };

  Object.keys(params).forEach(k => varsMap.set(k, params[k]));
}

export { Request };
