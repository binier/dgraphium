import { ObjectOrValue } from './ts-helpers';
import { Args, EdgeArgs } from './args';
import {
  LogicalOperator,
  Operator,
  OperatorBuilder,
  LogicalOperatorBuilder,
} from './operators';

type OpBuilders = OperatorBuilder | LogicalOperatorBuilder;

export type RawProjection = ObjectOrValue<Edge | string | boolean | 0 | 1>;
export type EdgeLike = Edge | RawProjection;

function indenter(depth = 0, indentation = '  ') {
  const prefix = indentation.repeat(depth);
  return (str = ''): string => prefix + str;
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export class Edge {
  protected args: Args = new Args();
  protected _filter?: Operator | LogicalOperator;

  constructor(
    private type: string,
    protected edges: RawProjection
  ) {
    this.type = capitalize(this.type);
  }

  withArgs(args: Args | EdgeArgs) {
    if (args instanceof Args)
      this.args = args;
    else
      this.args = new Args(args);
    return this;
  }

  first(val: EdgeArgs['first']) {
    this.args.setArg('first', val);
    return this;
  }

  offset(val: EdgeArgs['offset']) {
    this.args.setArg('offset', val);
    return this;
  }

  after(val: EdgeArgs['after']) {
    this.args.setArg('after', val);
    return this;
  }

  protected buildOp<
    T extends OpBuilders,
    R extends ReturnType<T['build']>
  >(op: T): R {
    if (op instanceof OperatorBuilder) {
      return op.build(x => ({
        ...x,
        subject: this.keyToField(x.subject),
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
    this._filter = this.buildOp(opBuilder);
    return this;
  }

  keyToField(key: string) {
    if (['id', 'uid'].includes(key))
      return 'uid';

    return `${this.type}.${key}`;
  }

  toString(extraDepth = 0): string {
    const rootIndent = indenter(extraDepth);
    const indent = indenter(extraDepth + 1);

    const projectionLines = Object.entries(this.edges)
      .filter(([_, val]) => !!val)
      .map(([key, val]) => {
        if (typeof val === 'string')
          return `${key}: ${val}`;

        const field = this.keyToField(key);
        const keyToFieldStr = `${key}: ${field}`;
        if (['boolean', 'number'].includes(typeof val))
          return keyToFieldStr;

        if (!(val instanceof Edge))
          val = new Edge(key, val as any);

        return `${keyToFieldStr} ${val.toString(extraDepth + 1).trim()}`;
      })
      .map(x => indent(x));

    const argsStr = !this.args.length() ? ''
      : `(${this.args.toString()}) `;

    const filterStr = !this._filter ? ''
      : `@filter(${this._filter}) `;

    return [
      rootIndent(`${argsStr}${filterStr}{`.trim()),
      ...projectionLines,
      rootIndent('}'),
    ].join('\n');
  }
}

