import { OperatorBuilder, Subject } from '../operator';

export const has = (subject: Subject) =>
  new OperatorBuilder({ name: 'has', subject });
