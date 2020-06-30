import {
  Param,
  ParamType,
  ParamTypeValue,
  ParamMap,
} from './param';
import { numberSeqGenerator } from '../utils';

export type ParamBuilderMap = { [name: string]: ParamBuilder };
export type ParamNameGen = Generator<string, string>;

function parseParamName(name: string) {
  name = name.trim();
  if (name.length && !name.startsWith('$')) return '$' + name;
  return name;
}

export function* paramNameGen(startI = 0): ParamNameGen {
  const numGen = numberSeqGenerator(startI);
  while (true) {
    yield 'p' + numGen.next().value;
  }
}

export class ParamBuilder<
  T extends ParamType = any,
  V = ParamTypeValue[T]
> {
  static buildAll(builders: ParamBuilder[]): Param[];
  static buildAll(builders: ParamBuilderMap): ParamMap;
  static buildAll(
    builders: ParamBuilder[] | ParamBuilderMap
  ): Param[] | ParamMap {
    const pNameGen = paramNameGen();
    const build = (x: ParamBuilder) => x.build(
      x.getName() || pNameGen.next().value
    );

    if (Array.isArray(builders)) return builders.map(build);

    return Object.entries(builders).reduce((r, [k, v]) => {
      r[k] = build(v);
      return r;
    }, {});
  }

  constructor(
    private type: T,
    private val: V,
    private _name?: string
  ) { }

  getName() {
    return this._name;
  }

  getVal() {
    return this.val;
  }

  name(name: string) {
    name = parseParamName(name);
    if (name) this._name = name;
    return this;
  }

  private assertName(name?: string) {
    if (!name && !this._name)
      throw Error("query param name can't be undefined");
  }

  build(name?: string) {
    name = parseParamName(name || this._name);
    this.assertName(name);
    return new Param(name, this.type, this.val);
  }
}
