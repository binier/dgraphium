import {
  EdgeBuilder,
  RawProjection,
  BuildEdgeArgs,
  NameGenerators as EdgeNameGenerators,
  defaultNameGen as edgeDefaultNameGen,
} from '../edge';
import { ArgsBuilderData } from '../args';
import { buildNameGen, BuildNameGen } from '../utils';
import { Query } from './query';
import { DirectiveBuilder } from '../directive';
import { Ref } from '../ref';
import { CombinedQuery } from './combined-query';
import { CombinedQueryBuilder } from './combined-query-builder';
import { FieldBuilder } from '../field';

type QueryProjection = EdgeBuilder | RawProjection<EdgeBuilder | FieldBuilder>;
export type BuildQueryNameGen = BuildNameGen<{ _queryNameGenBrand: symbol }>;
export type QueryNameGen = ReturnType<BuildQueryNameGen>;
export const queryNameGen: BuildQueryNameGen = buildNameGen.bind(null, 'q');

export interface NameGenerators extends EdgeNameGenerators {
  query?: QueryNameGen;
}

export interface BuildQueryArgs extends BuildEdgeArgs {
  nameGen?: NameGenerators;
}

export const defaultNameGen = (): NameGenerators => ({
  ...edgeDefaultNameGen(),
  query: queryNameGen(),
});

export class QueryBuilder extends EdgeBuilder {
  constructor(type?: string, name?: string) {
    super(type, {});
    this._name = name;
  }

  /** set query name */
  name(name: string) {
    return super.name(name);
  }

  func(func: ArgsBuilderData['func']) {
    this.args.setArg('func', func);
    return this;
  }

  ignoreReflex() {
    this.directives.ignoreReflex = new DirectiveBuilder('ignoreReflex', undefined);
    return this;
  }

  project(
    projection: QueryProjection | ((self: QueryBuilder) => QueryProjection),
    overwrite = false
  ): this {
    if (typeof projection === 'function')
      return this.project(projection(this), overwrite);
    this.setEdges(projection, overwrite);
    return this;
  }

  ref(...path: string[]) {
    return new Ref(this, path);
  }

  buildQueryArgs(nameGen?: NameGenerators) {
    nameGen = Object.assign(defaultNameGen(), nameGen);
    return super.buildEdgeArgs(this._name || nameGen.query.next(), nameGen);
  }

  /** @internal */
  buildQuery(args: Partial<BuildQueryArgs> = {}) {
    return new Query(
      this.buildQueryArgs(args.nameGen)
    );
  }

  build(): CombinedQuery {
    return new CombinedQueryBuilder([this]).build();
  }
}
