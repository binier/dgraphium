import { Param } from '../param';
import { Uid } from '../uid';

export type Subject = string;
export type OpValue = Param | Uid | string | number | boolean;

export interface OperatorArgs {
  name: string;
  subject?: Subject;
  value?: OpValue | OpValue[];
}

export interface Operator extends OperatorArgs { }
export class Operator {
  constructor(args: OperatorArgs) {
    Object.assign(this, args);
    if (Array.isArray(this.value) && this.value.length <= 1)
      this.value = this.value[0];
  }

  toString() {
    const args: any[] = this.subject ? [this.subject] : [];

    if (this.value) {
      if (Array.isArray(this.value))
        args.push(`[${this.value.join(', ')}]`)
      else
        args.push(this.value);
    }

    return `${this.name}(${args.join(', ')})`;
  }
}
