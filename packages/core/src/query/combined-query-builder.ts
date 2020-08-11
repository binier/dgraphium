import { QueryBuilder, queryNameGen } from './query-builder';
import { Query } from './query';
import { paramNameGen } from '../param';
import { CombinedQuery } from './combined-query';
import { Ref, varNameGen } from '../ref';

export class CombinedQueryBuilder {
  public readonly queries: Readonly<(string | QueryBuilder)[]>;

  constructor(queries: Readonly<(string | QueryBuilder | CombinedQueryBuilder)[]>) {
    this.queries = queries.reduce(
      (r, x) => r.concat(x instanceof CombinedQueryBuilder ? x.queries : x),
    []);
  }

  protected queryToRefMap(): Map<QueryBuilder, Ref[]> {
    return this.queries
      .filter(x => x instanceof QueryBuilder)
      .reduce((r, query: QueryBuilder) => {
        query.refs().forEach(ref => {
          const refs = r.get(ref.scope) || [];
          refs.push(ref);
          r.set(ref.scope, refs);
        });
        return r;
      }, new Map());
  }

  protected defineRefs() {
    const vNameGen = varNameGen();
    const refsMap = this.queryToRefMap();

    const queries = this.queries.slice();
    const refQueries = Array.from(refsMap.entries())
      .map(([query, refs]) => {
        const existingI = queries.findIndex(x => x === query);
        query = new QueryBuilder().merge(query);

        refs.forEach(ref => {
          ref.name = vNameGen.next(ref);
          query.defineVar(ref.path, ref.name);
        });

        if (existingI < 0) return query.name('var');
        queries[existingI] = query;
        return undefined;
      })
      .filter(x => x) as (string | QueryBuilder)[];

    return refQueries.concat(queries);
  }

  build() {
    const nameGen = {
      param: paramNameGen(),
      query: queryNameGen(),
    };

    const queries: (Query | string)[] = this.defineRefs()
      .map(query => {
        if (typeof query === 'string') return query;
        return query.buildQuery({ nameGen });
      });

    return new CombinedQuery(queries);
  }
}
