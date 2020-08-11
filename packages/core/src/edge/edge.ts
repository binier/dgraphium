import { Args } from '../args';
import { indenter, Projection as GenericProjection } from './common';
import { Param } from '../param';
import { Directive } from '../directive/directive';
import { FieldArgs, Field } from '../field';
import { Ref } from '../ref';

interface ParamsExtractable {
  params(): Param[];
}

type Projection = GenericProjection<Edge>;

export interface EdgeArgs extends FieldArgs {
  edges: Projection;
  args?: Args;
  directives: Record<string, Directive>;
}

export class Edge extends Field {
  protected edges: Projection;
  protected _params: Param[];
  protected args: Args;
  protected directives: Record<string, Directive> = {};

  constructor(args: EdgeArgs) {
    super(args);
    this.edges = args.edges;
    this.directives = args.directives;
    this.args = args.args || new Args();
    this._params = this.params();
  }

  params(): Param[] {
    const withParams: ParamsExtractable[] = [
      this.args,
      ...Object.values(this.edges).filter(x => x instanceof Edge) as Edge[],
      ...Object.values(this.directives),
    ];

    return withParams.reduce((r, x) => [...r, ...x.params()], []);
  }

  protected fieldStr() {
    return super.toString() + ' ';
  }

  protected argsStr() {
    return !this.args.length() ? '' : `(${this.args.toString()}) `;
  }

  toString(extraDepth = 0): string {
    const rootIndent = indenter(extraDepth);
    const indent = indenter(extraDepth + 1);

    const projectionLines = Object.entries(this.edges)
      .map(([key, val]) => {
        if (val instanceof Edge)
          return [key, val.toString(extraDepth + 1).trim()];
        if (val instanceof Ref)
          return [key, `val(${val})`];
        return [key, val];
      })
      .map(([key, val]) => `${key}: ${val}`)
      .map(x => indent(x));

    const fieldStr = this.fieldStr();
    const argsStr = this.argsStr();

    const directivesStr = Object.values(this.directives)
      .reduce((r, x) => r + x + ' ', '');

    return [
      rootIndent(`${fieldStr}${argsStr}${directivesStr}{`.trim()),
      ...projectionLines,
      rootIndent('}'),
    ].join('\n');
  }
}
