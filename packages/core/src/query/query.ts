import { Edge, EdgeArgs } from '../edge';
import { Param } from '../param';

export interface QueryArgs extends EdgeArgs {
  queryName: string;
}

export class Query extends Edge {
  constructor(args: QueryArgs) {
    super(args);
    this.field = args.queryName;
  }

  get queryName() {
    return this.field;
  }

  protected fieldStr() {
    return super.fieldStr().trim();
  }

  protected argsStr() {
    return !this.args.length() ? '() ' : super.argsStr();
  }

  queryStr(extraDepth = 0) {
    return super.toString(extraDepth);
  }

  queryStrWithParams() {
    const defineParamLine = this._params.length ? `query q(${
      Param.paramsDefineStr(this._params)
    }) ` : '';

    return  `${defineParamLine}{\n${this.queryStr(1)}\n}`;
  }

  toString() {
    return this.queryStrWithParams();
  }
}
