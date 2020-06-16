import clone from 'clone';
import { ArgsBuilder, ArgsBuilderData } from '../args';
import {
  OpValue,
  OpBuilderValue,
  OperatorBuilder,
  LogicalOperatorBuilder,
} from '../operator';
import { ParamBuilder, paramNameGen, ParamNameGen } from '../param';
import { Edge } from './edge';
import { capitalize, RawProjection, Projection } from './common';

type OpBuilders = OperatorBuilder | LogicalOperatorBuilder;

export class EdgeBuilder {
  protected edges: Projection<EdgeBuilder>;
  protected args: ArgsBuilder = new ArgsBuilder();
  protected _filter?: OpBuilders;

  constructor(
    protected type: string,
    edges: EdgeBuilder | RawProjection<EdgeBuilder>
  ) {
    this.type = capitalize(this.type);

    if (edges instanceof EdgeBuilder)
      return clone(edges);

    this.edges = Object.entries(edges)
      .reduce((r, [k ,v]) => {
        if (typeof v === 'object') r[k] = new EdgeBuilder(k, v);
        else r[k] = v;
        return r;
      }, {})
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
    return builder.build(pNameGen.next().value);
  }

  protected buildOpValue(
    value: (OpBuilderValue | OpBuilderValue[]),
    pNameGen: ParamNameGen
  ): OpValue | OpValue[] {
    if (Array.isArray(value))
      return value.map(x => this.buildOpValue(x, pNameGen) as OpValue);
    if (value instanceof ParamBuilder)
      return this.buildParam(value, pNameGen);
    return value;
  }

  protected buildOp<
    T extends OpBuilders,
    R extends ReturnType<T['build']>
  >(op: T, pNameGen: ParamNameGen): R {
    if (op instanceof OperatorBuilder) {
      return op.build(args => ({
        ...args,
        value: this.buildOpValue(args.value, pNameGen),
        subject: this.keyToField(args.subject),
      })) as R;
    } else if (op instanceof LogicalOperatorBuilder) {
      return op.build(args => ({
        ...args,
        operators: args.operators.map(this.buildOp.bind(this)),
      })) as R;
    }
    throw Error('invalid `op`');
  }

  filter(opBuilder: OpBuilders) {
    this._filter = opBuilder;
    return this;
  }

  keyToField(key: string) {
    if (['id', 'uid'].includes(key))
      return 'uid';

    return `${this.type}.${key}`;
  }

  paramBuilders(): ParamBuilder[] {
    const edgeParams: ParamBuilder[] = Object.values(this.edges)
      .reduce((r, x) => [
        ...r,
        ...(x instanceof EdgeBuilder ? x.paramBuilders() : []),
      ], []);

    return [
      ...edgeParams,
      ...this.args.paramBuilders(),
      ...(this._filter ? this._filter.paramBuilders() : []),
    ];
  }

  build(pNameGen = paramNameGen()) {
    const args = this.args.build(argMap => {
      return Object.entries(argMap)
        .reduce((r, [k, v]) => {
          if (v instanceof OperatorBuilder || v instanceof LogicalOperatorBuilder)
            r[k] = this.buildOp(v, pNameGen);
          else
            r[k] = v;
          return r;
        }, {});
    });

    const edges = Object.entries(this.edges)
      .reduce((r, [k, v]) => {
        if (v instanceof EdgeBuilder) r[k] = v.build(pNameGen);
        else r[k] = v;
        return r;
      }, {});

    return new Edge({
      args,
      edges,
      filter: this._filter && this.buildOp(this._filter, pNameGen),
      type: this.type,
    });
  }

  /**
   * build and stringify
   */
  toString(extraDepth?: number) {
    return this.build().toString(extraDepth);
  }
}
