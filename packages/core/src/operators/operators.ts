import { OperatorBuilder, Subject } from '../operator';
import { UidLike, Uid } from '../uid';

export const uid = (...uids: UidLike[]) => new OperatorBuilder({
  name: 'uid',
  value: uids.map(x => new Uid(x)),
});

export const has = (subject: Subject) =>
  new OperatorBuilder({ name: 'has', subject });
