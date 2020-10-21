
import { Param, ParamType } from '../param';

export type RecurseBuilderArgs = {
  loop?: boolean;
  depth?: number;
}

export class RecurseBuilder {
  constructor(private args: RecurseBuilderArgs) { }

  build() {
    return new Recurse(this.args)
  }
}

export class Recurse {
  private ps: Param[]

  constructor(args: RecurseBuilderArgs) {
    this.ps = []
    for (const k in args) {
      if (!args[k]) {
        continue;
      }
      let t: ParamType
      switch (k) {
        case 'loop':
          t = 'boolean';
          break;
        case 'depth':
          t = 'int';
          break;
      }
      this.ps.push(new Param(k, t, args[k]))
    }
  }

  params(): Param[] {
    return this.ps;
  }

  toString() {
    return this.ps.reduce((p, c) => {
      if (p) {
        p += ', '
      }
      return p += `${c.getName()}: ${c.getValue()}`
    }, '')
  }
}
