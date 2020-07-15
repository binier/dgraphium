import { Args } from '../args';
import { indenter, Projection } from './common';
import { Param } from '../param';
import { Directive } from '../directive/directive';

interface ParamsExtractable {
  params(): Param[];
}

export interface EdgeArgs {
  edges: Projection<Edge>;
  directives: Record<string, Directive>;
  type?: string;
  args?: Args;
}

export class Edge {
  protected type?: string;
  protected edges: Projection<Edge>;
  protected _params: Param[];
  protected args: Args;
  protected directives: Record<string, Directive> = {};

  constructor(args: EdgeArgs) {
    Object.assign(this, args);
    this.args = this.args || new Args();
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

  keyToField(key: string) {
    if (['id', 'uid'].includes(key))
      return 'uid';

    if (this.type)
      return `${this.type}.${key}`;
    return key;
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

        return `${keyToFieldStr} ${val.toString(extraDepth + 1).trim()}`;
      })
      .map(x => indent(x));

    const argsStr = !this.args.length() ? ''
      : `(${this.args.toString()}) `;

    const directivesStr = Object.values(this.directives)
      .reduce((r, x) => r + x + ' ', '');

    return [
      rootIndent(`${argsStr}${directivesStr}{`.trim()),
      ...projectionLines,
      rootIndent('}'),
    ].join('\n');
  }
}
