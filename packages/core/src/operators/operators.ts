import { OperatorBuilder, OpBuilderValue, Subject } from '../operator';
import { UidLike, Uid } from '../uid';
import { ParamBuilder } from '../param';

export * from './comparison-operators';
export * from './term-operators';
export * from './text-operators';

export const uid = (...uids: UidLike[]) => new OperatorBuilder({
  name: 'uid',
  value: uids.map(x => new Uid(x)),
});

export const predUid = (
  predicate: string, uids: UidLike | UidLike[]
) => new OperatorBuilder({
  name: 'uid_in',
  subject: predicate,
  value: (Array.isArray(uids) ? uids : [uids]).map(x => new Uid(x)),
});

export const has = (subject: Subject) =>
  new OperatorBuilder({ name: 'has', subject });

export const eq = (
  subj: Subject, value: OpBuilderValue | OpBuilderValue[]
) =>
  new OperatorBuilder({ name: 'eq', subject: subj, value: value });

export const regexp = (subject: Subject, pattern: RegExp) =>
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
