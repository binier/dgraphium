import { Param } from '../param';
import { Uid } from '../uid';

export type Subject = string;
export type OpValue = Param | Uid | RegExp | Date
  | string | number | boolean;
export type OpArg = Param | string | number | boolean;

export interface OperatorArgs {
  name: string;
  subject?: Subject;
  value?: OpValue | OpValue[];
  arg?: OpArg;
}

export interface Operator extends OperatorArgs { }
export class Operator {
  constructor(args: OperatorArgs) {
    Object.assign(this, args);
    if (Array.isArray(this.value) && this.value.length <= 1)
      this.value = this.value[0];
  }

  params(): Param[] {
    return [].concat(this.value, this.arg)
      .filter(x => x instanceof Param) as Param[];
  }

  parseValue(value: any) {
    if (typeof value === 'string')
      return `"${value.replace(/"/g, '\\"')}"`;
    if (value instanceof Date)
      return value.toISOString();
    return value;
  }

  toString() {
    const args: any[] = this.subject ? [this.subject] : [];

    if (this.value) {
      if (Array.isArray(this.value)) {
        const valueStr = this.value
          .map(this.parseValue.bind(this))
          .join(', ');

        if (this.subject && this.name !== 'uid_in')
          args.push(`[${valueStr}]`);
        else
          args.push(valueStr);
      } else {
        args.push(this.parseValue(this.value));
      }
    }

    if (this.arg) args.push(this.arg);

    return `${this.name}(${args.join(', ')})`;
  }
}
