import { ParamBuilder } from './param-builder';

export function uid(
  uids: ParamBuilder<'uid'> | ParamBuilder<'uid'>[]
) {
  return new ParamBuilder('uid', uids);
}

export function string(val: string) {
  return new ParamBuilder('string', val);
}

export function int(val: number) {
  return new ParamBuilder('int', val);
}

export function float(val: number) {
  return new ParamBuilder('float', val);
}

export function bool(val: boolean) {
  return new ParamBuilder('boolean', val);
}
