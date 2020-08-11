import { Param } from './types';

export function paramsToObj(params: Readonly<Param[]>) {
  return params.reduce((r, x) => {
    r[x.getName()] = x.getValue();
    return r;
  }, {});
}
