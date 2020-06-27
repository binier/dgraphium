import { OperatorBuilder } from '../operator';
import { ParamBuilder } from '../param';

const text = (name: string) =>
  (subject: string, text: string | ParamBuilder) =>
    new OperatorBuilder({ name, subject, value: text });

export const allOfText = text('alloftext');
export const anyOfText = text('anyoftext');
