import { Query } from './query';
import { Param } from '../param';

export class CombinedQuery {
  static extractParams(queries: Readonly<(string | Query)[]>) {
    return Array.from(
      queries.reduce((r, query) => {
        if (query instanceof Query)
          query.params().forEach(x => r.add(x));
        return r;
      }, new Set<Param>())
    );
  }

  constructor(
    public readonly queries: Readonly<(string | Query)[]>,
    private readonly _params: Readonly<Param[]>
      = CombinedQuery.extractParams(queries)
  ) { }

  params(): Readonly<Param[]> {
    return this._params;
  }

  queryStr(extraDepth = 0) {
    return this.queries
      .map(x => x instanceof Query ? x.queryStr(extraDepth + 1) : x)
      .join('\n\n');
  }

  queryStrWithParams() {
    const defineParamLine = this._params.length ? `query q(${
      Param.paramsDefineStr(this._params)
    }) ` : '';

    return  `${defineParamLine}{\n${this.queryStr(1)}\n}`;
  }

  toString(_ignore?: never) {
    return this.queryStrWithParams();
  }
}
