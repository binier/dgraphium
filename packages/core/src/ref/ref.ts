import { QueryBuilder } from '../query';
import { buildNameGen } from '../utils';

export type VarNameGen = { next(ref: Ref): string };

export interface RefAble {
  ref(...path: string[]): Ref;
}

export function isRefAble(obj: any): obj is RefAble {
  return typeof obj['ref'] === 'function';
}

export function varNameGen(startI?: number): VarNameGen {
  const queryRefsMap = new Map<Readonly<QueryBuilder>, Map<string, string>>();
  const nameGen = buildNameGen('v', startI);

  return {
    next(ref: Ref) {
      const pathStr = ref.path.toString();
      const pathToNameMap = queryRefsMap.get(ref.scope) || new Map<string, string>();
      let name = pathToNameMap.get(pathStr);

      if (!name) {
        name = nameGen.next();
        pathToNameMap.set(pathStr, name);
        queryRefsMap.set(ref.scope, pathToNameMap);
      }

      return name;
    },
  };
}

export class Ref {
  private _name: string;

  constructor(
    public readonly scope: Readonly<QueryBuilder>,
    public readonly path: Readonly<string[]>
  ) { }

  ref(...path: string[]) {
    return new Ref(this.scope, this.path.concat(path));
  }

  get name() {
    return this._name;
  }

  /** @internal */
  set name(name: string) {
    this._name = name;
  }

  clone() {
    const ref = this.ref();
    ref._name = this._name;
    return ref;
  }

  toString() {
    return this.name;
  }
}
