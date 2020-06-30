import { ParamBuilder } from './param-builder';
import { UidLike, Uid } from '../uid';

export function uid(uid: UidLike) {
  return new ParamBuilder('uid', new Uid(uid));
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
