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
import { Ref } from '../ref';
import { Runnable } from '../types';
import { FieldBuilder, BuildFieldArgs } from '../field';

type OpBuilders = OperatorBuilder | LogicalOperatorBuilder;

export interface NameGenerators {
  param: ParamNameGen;
}

export interface BuildEdgeArgs extends BuildFieldArgs {
  nameGen?: NameGenerators;
}

export const defaultNameGen = (): NameGenerators => ({
  param: paramNameGen(),
});

/** should match EdgeBuilder's constructor */
export interface EdgeBuilderConstructor {
  (edges: EdgeBuilder | RawProjection<EdgeBuilder | FieldBuilder>): EdgeBuilder;
  (type: string, edges: EdgeBuilder | RawProjection<EdgeBuilder | FieldBuilder>): EdgeBuilder;
}

export class EdgeBuilder extends FieldBuilder {
  protected type?: string;
  protected _autoType?: boolean
  protected edges: Projection<EdgeBuilder | FieldBuilder> = {};
  protected directives: Record<string, DirectiveBuilder> = {};
  protected args: ArgsBuilder = new ArgsBuilder();

  constructor(
    type?: string | EdgeBuilder | RawProjection<EdgeBuilder | FieldBuilder>,
    edges?: EdgeBuilder | RawProjection<EdgeBuilder | FieldBuilder>
  ) {
    super('');
    if (type) {
      if (typeof type !== 'string')
        return new EdgeBuilder(undefined, type);
      this.type = capitalize(type);
    }

    if (edges instanceof EdgeBuilder)
      return this.merge(edges, true);

    if (edges) this.setEdges(edges);
  }

  protected setEdges(
    edges: EdgeBuilder | RawProjection<EdgeBuilder | FieldBuilder>,
    overwrite = false
  ) {
    if (edges instanceof EdgeBuilder)
      return this.setEdges(edges.edges, overwrite);

    this.edges = Object.entries(edges)
      .reduce((r, [k, v]) => {
        const existing = r[k];
        if (v === 1 || v === true) {
          if (existing) return r;
          v = new FieldBuilder(undefined);
        }
        if (typeof v !== 'object' || v instanceof Ref) {
          r[k] = v || false;
          return r;
        }

        // clone value
        if ((v instanceof FieldBuilder) && !(v instanceof EdgeBuilder))
          v = new FieldBuilder(undefined).merge(v);
        else
          v = new EdgeBuilder(this.type ? k : undefined, v);

        if (!existing || typeof existing === 'string' || existing instanceof Ref) {
          r[k] = v;
          return r;
        }

        if (existing instanceof EdgeBuilder)
          r[k] = existing.merge(v, overwrite);
        else
          r[k] = v.merge(existing.merge(v));

        return r;
      }, overwrite ? {} : this.edges);
  }

  merge(edge: EdgeBuilder | FieldBuilder, overwrite = false) {
    if (edge instanceof FieldBuilder)
      super.merge(edge);
    if (!(edge instanceof EdgeBuilder))
      return this;

    this.setEdges(edge.edges, overwrite);

    if (edge._autoType !== undefined) this._autoType = edge._autoType;
    if (!edge.autoType) this.type = edge.type;
    if (edge._name) this._name = edge._name;
    Object.assign(this.directives, edge.directives);
    Object.assign(this.args.all, edge.args.all);

    return this;
  }

  /** set field name */
  name(name: string) {
    this._name = name;
    return this;
  }

  get autoType() {
    return this._autoType;
  }

  setAutoType(flag = true) {
    this._autoType = flag;
    return this;
  }

  withArgs(args: ArgsBuilder | Omit<ArgsBuilderData, 'func'>) {
    this.args.setArg('first', args.first);
    this.args.setArg('offset', args.offset);
    this.args.setArg('after', args.after);

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
    if (value instanceof Ref)
      return value.clone();
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

  /** @internal */
  refs(): Ref[] {
    return Object.values(this.edges)
      .map(x => {
        if (x instanceof EdgeBuilder)
          return x.refs();
        if (x instanceof Ref)
          return [x];
        return [];
      })
      .reduce((r, x) => r.concat(x), [])
      .concat(this.args.refs())
      .concat(Object.values(this.directives)
        .reduce((r, x) => r.concat(x.refs()),
      []));
  }

  /** @internal */
  defineVar(path: Readonly<string[]>, name: string) {
    const [key, ...pathTail] = path;
    if (path.length === 0) return this.asVar(name);
    if (path.length === 1) {
      return this.setEdges({
        [key]: new FieldBuilder(undefined).asVar(name),
      });
    }

    return this.setEdges({
      [key]: new EdgeBuilder()
        .setAutoType()
        .defineVar(pathTail, name),
    });
  }

  protected buildEdgeArgs(name: string, nameGen?: NameGenerators) {
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
      .filter(([_, v]) => !!v)
      .reduce((r, [k, v]) => {
        const fieldFromKey = this.keyToField(k);
        if (v instanceof EdgeBuilder)
          r[k] = v.build({ nameGen, name: fieldFromKey });
        else if (v instanceof FieldBuilder)
          r[k] = v.build({ name: fieldFromKey });
        else if (v instanceof Ref)
          r[k] = v.clone();
        else r[k] = v;
        return r;
      }, {});

    return {
      name,
      args,
      edges,
      varName: this._varName,
      directives: Object.entries(this.directives)
        .reduce((r, [k, v]) => {
          r[k] = v.build(op =>
            !op ? op : this.buildOp(op, nameGen));
          return r;
        }, {}),
    };
  }

  build<
    A extends BuildEdgeArgs
  >(args: Partial<A> = {}): Edge | Runnable {
    return new Edge(
      this.buildEdgeArgs(this._name || args.name || '', args.nameGen)
    );
  }

  /**
   * build and stringify
   */
  toString(extraDepth?: number) {
    return this.build().toString(extraDepth);
  }
}
