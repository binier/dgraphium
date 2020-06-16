import { Uid } from '../uid';

export interface ParamTypeValue {
  uid: Uid | Uid[];
  string: string;
  int: number;
  float: number;
  boolean: boolean;
}

export type ParamType = keyof ParamTypeValue;
export type ParamMap = { [name: string]: Param };

export class Param<
  T extends ParamType = any,
  V = ParamTypeValue[T]
> {
  static paramsDefineStr(params: Param[] | ParamMap): string {
    if (!Array.isArray(params)) params = Object.values(params);
    return params.map(x => x.defineStr()).join(', ');
  }

  constructor(
    private name: string,
    private type: T,
    private val: V
  ) { }

  getInternalType() {
    switch (this.type) {
      case 'uid': return 'string';
      default: return this.type;
    }
  }

  getName() { return this.name; }

  defineStr() {
    return `${this.name}: ${this.getInternalType()}`;
  }

  toString() {
    if (this.val instanceof Uid) return `uid(${this.name})`;

    return this.name;
  }
}
