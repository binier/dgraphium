import { OperatorBuilder, OpBuilderValue, Subject } from '../operator';

const comparison = (name: string) =>
  (subject: Subject, value: OpBuilderValue) =>
    new OperatorBuilder({ name, subject, value });

export const lte = comparison('le');
export const lt = comparison('lt');
export const gte = comparison('ge');
export const gt = comparison('gt');
