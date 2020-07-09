import { Uid } from '../uid';

export interface ParamTypeValue {
  uid: Uid;
  date: Date;
  string: string;
  int: number;
  float: number;
  boolean: boolean;
  regex: RegExp;
  'uid[]': Uid[];
}

export type ParamType = keyof ParamTypeValue;
export type ParamMap = { [name: string]: Param };

export class Param<
  T extends ParamType = any,
  V extends ParamTypeValue[T] = ParamTypeValue[T]
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

  getInternalType(type = this.type) {
    // no internal types for arrays
    if (type.endsWith('[]'))
      return this.getInternalType(type.replace('[]', '') as any);

    switch (type) {
      case 'uid': return 'string';
      case 'regex': return 'string';
      case 'date': return 'string';
      default: return this.type;
    }
  }

  getName() { return this.name; }

  getValue() {
    if (this.type === 'uid[]')
      return `[${(this.val as any).join(', ')}]`;
    if (this.val instanceof Date)
      return this.val.toISOString();
    return this.val.toString();
  }

  defineStr() {
    return `${this.name}: ${this.getInternalType()}`;
  }

  toString() {
    return this.name;
  }
}
