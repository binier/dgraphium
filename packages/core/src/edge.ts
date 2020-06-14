import { ObjectOrValue } from './ts-helpers';
import { Args } from './args';
import {
  Operator,
  LogicalOperator,
} from './operator';

export type ProjectionValue = Edge | string | boolean | 0 | 1;
export type RawProjection = ObjectOrValue<ProjectionValue>;
export type Projection = { [name: string]: ProjectionValue };
export type Filter = Operator | LogicalOperator;

function indenter(depth = 0, indentation = '  ') {
  const prefix = indentation.repeat(depth);
  return (str = ''): string => prefix + str;
}

interface EdgeArgs {
  type: string;
  edges: Projection;
  args?: Args;
  filter?: Filter;
}

export class Edge {
  protected type: string;
  protected edges: Projection;
  protected args: Args;
  protected filter?: Filter;

  constructor(args: EdgeArgs) {
    Object.assign(this, args);
    this.args = this.args || new Args();
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

        return `${keyToFieldStr} ${val.toString(extraDepth + 1).trim()}`;
      })
      .map(x => indent(x));

    const argsStr = !this.args.length() ? ''
      : `(${this.args.toString()}) `;

    const filterStr = !this.filter ? ''
      : `@filter(${this.filter}) `;

    return [
      rootIndent(`${argsStr}${filterStr}{`.trim()),
      ...projectionLines,
      rootIndent('}'),
    ].join('\n');
  }
}
