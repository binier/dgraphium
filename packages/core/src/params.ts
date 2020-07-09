import { ParamBuilder } from './param';
import { UidLike, Uid } from './uid';

export function uid(uid: UidLike) {
  return new ParamBuilder('uid', new Uid(uid));
}

export function uids(...uids: UidLike[]) {
  return new ParamBuilder('uid[]', uids.map(x => new Uid(x)));
}

export function date(val: Date | string | number) {
  return new ParamBuilder('date', new Date(val));
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

export function regex(pattern: RegExp) {
  return new ParamBuilder('regex', pattern);
}
