import { Args } from '../args';
import { indenter } from './common';
import { Param } from '../param';
import { Directive } from '../directive/directive';

interface ParamsExtractable {
  params(): Param[];
}

type Projection = { [alias: string]: string | Edge };

export interface EdgeArgs {
  field: string;
  edges: Projection;
  args?: Args;
  varName?: string;
  directives: Record<string, Directive>;
}

export class Edge {
  protected field: string;
  protected edges: Projection;
  protected _params: Param[];
  protected args: Args;
  protected varName?: string;
  protected directives: Record<string, Directive> = {};

  constructor(args: EdgeArgs) {
    this.field = args.field;
    this.edges = args.edges;
    this.varName = args.varName;
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
    if (this.varName)
      return `${this.varName} as ${this.field} `;
    return this.field + ' ';
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
          return `${key}: ${val.toString(extraDepth + 1).trim()}`;
        return `${key}: ${val}`;
      })
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
