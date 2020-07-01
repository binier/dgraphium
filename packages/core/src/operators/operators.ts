import { OperatorBuilder, OpBuilderValue, Subject } from '../operator';
import { UidLike, Uid } from '../uid';
import { ParamBuilder } from '../param';

type UidArg<T extends 'uid' | 'uid[]'> = UidLike | ParamBuilder<T>;

export * from './comparison-operators';
export * from './term-operators';
export * from './text-operators';

export const type = (type: string) =>
  new OperatorBuilder({ name: 'type', subject: type });

export const has = (subject: Subject) =>
  new OperatorBuilder({ name: 'has', subject });

export const uid = (...uids: UidArg<'uid' | 'uid[]'>[]) =>
  new OperatorBuilder({
    name: 'uid',
    value: uids.map(x => x instanceof ParamBuilder ? x : new Uid(x)),
  });

/**
 * TODO: accept multiple uids after stable version
 * of Dgraph supports it.
 * */
export const predUid = (
  predicate: string,
  uid: UidArg<'uid'>
  // uids: UidArg<'uid' | 'uid[]'> | UidArg<'uid' | 'uid[]'>[]
) => new OperatorBuilder({
  name: 'uid_in',
  subject: predicate,
  value: uid instanceof ParamBuilder ? uid : new Uid(uid),
  // value: (Array.isArray(uids) ? uids : [uids])
  //   .map(x => x instanceof ParamBuilder ? x : new Uid(x)),
});

export const eq = (
  subj: Subject, value: OpBuilderValue | OpBuilderValue[]
) =>
  new OperatorBuilder({ name: 'eq', subject: subj, value: value });

export const regex = (
  subject: Subject,
  pattern: RegExp | ParamBuilder<'regex'>
) =>
  new OperatorBuilder({ name: 'regexp', subject, value: pattern });

export const match = (
  subject: Subject,
  value: string | ParamBuilder,
  distance: number | ParamBuilder,
) =>
  new OperatorBuilder({
    name: 'match',
    subject: subject,
    value: value,
    arg: distance,
  });
