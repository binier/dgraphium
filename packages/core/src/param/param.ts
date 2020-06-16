import { Uid } from '../uid';

export interface ParamTypeValue {
  string: Uid | string | number | boolean;
  int: number;
  float: number;
  boolean: boolean;
}

export type ParamType = keyof ParamTypeValue;
export type ParamMap = { [name: string]: Param };

export class Param<
  T extends ParamType = any,
  V extends ParamTypeValue[T] = any
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

  getName() { return this.name; }

  defineStr() {
    return `${this.name}: ${this.type}`;
  }

  toString() {
    if (this.val instanceof Uid) return `uid(${this.name})`;

    return this.name;
  }
}
