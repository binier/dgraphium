import { Uid } from '../uid';

export interface ParamTypeValue {
  uid: Uid;
  'uid[]': Uid[];
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
      case 'uid[]': return 'string';
      default: return this.type;
    }
  }

  getName() { return this.name; }

  getValue() {
    if (this.val instanceof Uid)
      return this.val.toString();
    if (this.type === 'uid[]')
      return `[${(this.val as any).join(', ')}]`
    return this.val;
  }

  defineStr() {
    return `${this.name}: ${this.getInternalType()}`;
  }

  toString() {
    return this.name;
  }
}
