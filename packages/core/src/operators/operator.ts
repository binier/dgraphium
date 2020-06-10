export type Subject = string;
export type OpValue = string | number | boolean;

export interface OperatorArgs {
  name: string;
  subject: Subject;
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
    const args: any[] = [this.subject];

    if (this.value) {
      if (Array.isArray(this.value))
        args.push(`[${this.value.join(', ')}]`)
      else
        args.push(this.value);
    }

    return `${this.name}(${args.join(', ')})`;
  }
}

