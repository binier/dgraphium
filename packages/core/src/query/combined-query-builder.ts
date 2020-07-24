import { QueryBuilder, queryNameGen } from './query-builder';
import { Query } from './query';
import { paramNameGen, Param } from '../param';
import { CombinedQuery } from './combined-query';

export class CombinedQueryBuilder {
  public readonly queries: Readonly<(string | QueryBuilder)[]>;

  constructor(queries: Readonly<(string | QueryBuilder | CombinedQueryBuilder)[]>) {
    this.queries = queries.reduce(
      (r, x) => r.concat(x instanceof CombinedQueryBuilder ? x.queries : x),
    []);
  }

  build() {
    const nameGen = {
      param: paramNameGen(),
      query: queryNameGen(),
    };

    const queries = this.queries.map(query => {
      if (typeof query === 'string') return query;
      return query.build({ nameGen });
    });

    const params = Array.from(
      queries.reduce((r, query) => {
        if (query instanceof Query)
          query.params().forEach(x => r.add(x));
        return r;
      }, new Set<Param>())
    );

    return new CombinedQuery(queries, params);
  }
}
