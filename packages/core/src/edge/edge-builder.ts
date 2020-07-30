import clone from 'clone';
import { ArgsBuilder, ArgsBuilderData } from '../args';
import {
  OpValue,
  OpBuilderValue,
  OperatorBuilder,
  LogicalOperatorBuilder,
  OpArg,
} from '../operator';
import { ParamBuilder, paramNameGen, ParamNameGen } from '../param';
import { Edge } from './edge';
import { capitalize, RawProjection, Projection } from './common';
import { DirectiveBuilder } from '../directive';

type OpBuilders = OperatorBuilder | LogicalOperatorBuilder;

export interface NameGenerators {
  param: ParamNameGen;
}

export interface BuildEdgeArgs {
  nameGen?: NameGenerators;
}

export const defaultNameGen = (): NameGenerators => ({
  param: paramNameGen(),
});

/** should match EdgeBuilder's constructor */
export interface EdgeBuilderConstructor {
  (edges: EdgeBuilder | RawProjection<EdgeBuilder>): EdgeBuilder;
  (type: string, edges: EdgeBuilder | RawProjection<EdgeBuilder>): EdgeBuilder;
}

export class EdgeBuilder {
  protected type?: string;
  protected edges: Projection<EdgeBuilder> = {};
  protected directives: Record<string, DirectiveBuilder> = {};
  protected args: ArgsBuilder = new ArgsBuilder();

  constructor(
    type?: string | EdgeBuilder | RawProjection<EdgeBuilder>,
    edges?: EdgeBuilder | RawProjection<EdgeBuilder>
  ) {
    if (type) {
      if (typeof type !== 'string')
        return new EdgeBuilder(undefined, type);
      this.type = capitalize(type);
    }

    if (edges instanceof EdgeBuilder)
      return clone(edges);

    this.setEdges(edges);
  }

  protected setEdges(
    edges: EdgeBuilder | RawProjection<EdgeBuilder>,
    overwrite = false
  ) {
    this.edges = Object.entries(edges)
      .reduce((r, [k, v]) => {
        if (typeof v === 'object') {
          if (r[k] instanceof EdgeBuilder)
            (r[k] as EdgeBuilder).setEdges(v);
          else
            r[k] = new EdgeBuilder(k, v);
        } else r[k] = v;
        return r;
      }, overwrite ? {} : this.edges);
  }

  withArgs(args: ArgsBuilder | Omit<ArgsBuilderData, 'func'>) {
    if (args instanceof ArgsBuilder)
      this.args = args;
    else
      this.args = new ArgsBuilder(args);
    return this;
  }

  first(val: ArgsBuilderData['first']) {
    this.args.setArg('first', val);
    return this;
  }

  offset(val: ArgsBuilderData['offset']) {
    this.args.setArg('offset', val);
    return this;
  }

  after(val: ArgsBuilderData['after']) {
    this.args.setArg('after', val);
    return this;
  }

  protected buildParam(builder: ParamBuilder, pNameGen: ParamNameGen) {
    return builder.build(pNameGen.next(builder));
  }

  protected buildOpValue(
    value: (OpBuilderValue | OpBuilderValue[]),
    nameGen: NameGenerators
  ): OpValue | OpValue[] {
    if (Array.isArray(value))
      return value.map(x => this.buildOpValue(x, nameGen) as OpValue);
    if (value instanceof ParamBuilder)
      return this.buildParam(value, nameGen.param);
    return value;
  }

  protected buildOp<
    T extends OpBuilders,
    R extends ReturnType<T['build']>
  >(op: T, nameGen: NameGenerators): R {
    if (op instanceof OperatorBuilder) {
      return op.build(args => ({
        ...args,
        value: this.buildOpValue(args.value, nameGen),
        arg: args.arg && args.arg instanceof ParamBuilder
          ? this.buildParam(args.arg, nameGen.param)
          : args.arg as OpArg,
        subject: args.subject ? this.keyToField(args.subject) : undefined,
      })) as R;
    } else if (op instanceof LogicalOperatorBuilder) {
      return op.build(args => ({
        ...args,
        operators: args.operators.map(x => this.buildOp(x, nameGen)),
      })) as R;
    }
    throw Error('invalid `op`');
  }

  filter(opBuilder: OpBuilders) {
    this.directives.filter = new DirectiveBuilder('filter', opBuilder);
    return this;
  }

  cascade() {
    this.directives.cascade = new DirectiveBuilder('cascade', undefined);
    return this;
  }

  keyToField(key: string) {
    if (['id', 'uid'].includes(key))
      return 'uid';

    if (this.type)
      return `${this.type}.${key}`;
    return key;
  }

  protected buildEdgeArgs(nameGen?: NameGenerators) {
    nameGen = Object.assign(defaultNameGen(), nameGen);

    const args = this.args.build(argMap => {
      return Object.entries(argMap)
        .reduce((r, [k, v]) => {
          if (v instanceof OperatorBuilder || v instanceof LogicalOperatorBuilder)
            r[k] = this.buildOp(v, nameGen);
          else
            r[k] = v;
          return r;
        }, {});
    });

    const edges = Object.entries(this.edges)
      .reduce((r, [k, v]) => {
        if (v instanceof EdgeBuilder) r[k] = v.build({ nameGen });
        else r[k] = v;
        return r;
      }, {});

    return {
      args,
      edges,
      directives: Object.entries(this.directives)
        .reduce((r, [k, v]) => {
          r[k] = v.build(op =>
            !op ? op : this.buildOp(op, nameGen));
          return r;
        }, {}),
      type: this.type,
    };
  }

  build<
    A extends BuildEdgeArgs
  >(args: Partial<A> = {}) {
    return new Edge(
      this.buildEdgeArgs(args.nameGen)
    );
  }

  /**
   * build and stringify
   */
  toString(extraDepth?: number) {
    return this.build().toString(extraDepth);
  }
}
