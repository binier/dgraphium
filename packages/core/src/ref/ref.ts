import { QueryBuilder } from '../query';

export class Ref {
  constructor(
    public readonly scope: Readonly<QueryBuilder>,
    public readonly path: Readonly<string[]>
  ) { }

  ref(...path: string[]) {
    return new Ref(this.scope, this.path.concat(path));
  }
}
