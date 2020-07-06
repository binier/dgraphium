import { QueryBuilder, queryNameGen } from './query-builder';
import { Query } from './query';
import { paramNameGen, Param } from '../param';

export class CombinedQuery {
  private queries: (string | Query)[];
  private _params: Param[];

  constructor(queries: (string | QueryBuilder)[]) {
    const qNameGen = queryNameGen();
    const pNameGen = paramNameGen();

    this.queries = queries.map(query => {
      if (typeof query === 'string') return query;
      return query.build({ qNameGen, pNameGen });
    });
    this._params = this.params();
  }

  params() {
    return Array.from(
      this.queries.reduce((r, query) => {
        if (query instanceof Query)
          query.params().forEach(x => r.add(x));
        return r;
      }, new Set<Param>())
    );
  }

  queryStr(extraDepth = 0) {
    return this.queries
      .map(x => x instanceof Query ? x.queryStr(extraDepth + 1) : x)
      .join('\n\n');
  }

  queryStrWithParams() {
    const defineParamLine = this.params.length ? `query q(${
      Param.paramsDefineStr(this._params)
    }) ` : '';

    return  `${defineParamLine}{\n${this.queryStr(1)}\n}`;
  }

  toString() {
    return this.queryStrWithParams();
  }
}
