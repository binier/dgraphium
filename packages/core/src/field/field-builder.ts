import { Field } from './field';

export interface BuildFieldArgs {
  name?: string;
}

export class FieldBuilder {
  protected _name: string;
  protected _varName?: string;

  constructor(name: string) {
    this._name = name;
  }

  /** @internal */
  get varName() {
    return this._varName;
  }

  /** @internal */
  asVar(varName: string) {
    this._varName = varName;
    return this;
  }

  merge(field: FieldBuilder) {
    if (field._name) this._name = field._name;
    if (field._varName) this._varName = field._varName;
    return this;
  }

  build<
    A extends BuildFieldArgs
  >(args: Partial<A> = {}): Field {
    return new Field({
      name: this._name || args.name,
      varName: this.varName,
    });
  }
}
