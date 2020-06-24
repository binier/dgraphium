import { OperatorBuilder, OpBuilderValue, Subject } from '../operator';
import { UidLike, Uid } from '../uid';

const comparison = (name: string) =>
  (subject: Subject, value: OpBuilderValue) =>
    new OperatorBuilder({ name, subject, value });

export const lte = comparison('le');
export const lt = comparison('lt');
export const gte = comparison('ge');
export const gt = comparison('gt');

export const uid = (...uids: UidLike[]) => new OperatorBuilder({
  name: 'uid',
  value: uids.map(x => new Uid(x)),
});

export const has = (subject: Subject) =>
  new OperatorBuilder({ name: 'has', subject });
