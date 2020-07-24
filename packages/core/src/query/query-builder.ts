import {
  EdgeBuilder,
  RawProjection,
  BuildEdgeArgs,
  NameGenerators as EdgeNameGenerators,
  defaultNameGen as edgeDefaultNameGen,
} from '../edge';
import { ArgsBuilderData } from '../args';
import { numberSeqGenerator } from '../utils';
import { Query } from './query';
import { DirectiveBuilder } from '../directive';

export type QueryNameGen = Generator<string, string>;

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

export function* queryNameGen(startI = 0): QueryNameGen {
  const numGen = numberSeqGenerator(startI);
  while (true) {
    yield 'q' + numGen.next().value;
  }
}

export class QueryBuilder extends EdgeBuilder {
  protected queryName?: string;

  constructor(type?: string, queryName?: string) {
    super(type, {});
    this.queryName = queryName;
  }

  /** set query name */
  name(name: string) {
    this.queryName = name;
    return this;
  }

  func(func: ArgsBuilderData['func']) {
    this.args.setArg('func', func);
    return this;
  }

  ignoreReflex() {
    this.directives.ignoreReflex = new DirectiveBuilder('ignoreReflex', undefined);
    return this;
  }

  project(projection: EdgeBuilder | RawProjection<EdgeBuilder>) {
    this.setEdges(projection);
    return this;
  }

  buildQueryArgs(nameGen?: NameGenerators) {
    nameGen = Object.assign(defaultNameGen(), nameGen);
    return {
      ...super.buildEdgeArgs(nameGen),
      queryName: this.queryName || nameGen.query.next().value,
    };
  }

  build<
    A extends BuildQueryArgs
  >(args: Partial<A> = {}) {
    return new Query(
      this.buildQueryArgs(args.nameGen)
    );
  }
}
