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

    return Array.from(refsMap.entries())
      .map(([query, refs]) => {
        query = new QueryBuilder()
          .merge(query)
          .name('var');

        refs.forEach(ref => {
          ref.name = vNameGen.next(ref);
          query.defineVar(ref.path, ref.name);
        });

        return query;
      });
  }

  build() {
    const nameGen = {
      param: paramNameGen(),
      query: queryNameGen(),
    };

    const refQueries = this.defineRefs();
    const queries: (Query | string)[] = (refQueries as (QueryBuilder | string)[])
      .concat(this.queries)
      .map(query => {
        if (typeof query === 'string') return query;
        return query.buildQuery({ nameGen });
      });

    return new CombinedQuery(queries);
  }
}
