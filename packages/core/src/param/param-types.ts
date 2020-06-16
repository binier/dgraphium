import { ParamBuilder } from './param-builder';
import { Uid, UidLike } from '../uid';

export function uid(val: UidLike) {
  return new ParamBuilder('string', new Uid(val));
}

export function string(val: string, name?: string) {
  return new ParamBuilder('string', val, name);
}

export function int(val: number, name?: string) {
  return new ParamBuilder('int', val, name);
}

export function float(val: number, name?: string) {
  return new ParamBuilder('float', val, name);
}

export function bool(val: boolean, name?: string) {
  return new ParamBuilder('boolean', val, name);
}
