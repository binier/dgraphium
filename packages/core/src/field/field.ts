export interface FieldArgs {
  name: string;
  varName?: string;
}

export class Field {
  protected name: string;
  protected varName?: string;

  constructor(args: FieldArgs) {
    this.name = args.name;
    this.varName = args.varName;
  }

  toString() {
    if (this.varName)
      return `${this.varName} as ${this.name}`;
    return this.name;
  }
}
