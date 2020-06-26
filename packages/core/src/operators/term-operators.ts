import { OperatorBuilder } from '../operator';
import { ParamBuilder } from '../param';

const term = (name: string) =>
  (subject: string, terms: string | string[] | ParamBuilder) => {
    const value = Array.isArray(terms) ? terms.join(' ') : terms;
    return new OperatorBuilder({ name, subject, value });
  }

export const allOfTerms = term('allofterms');
export const anyOfTerms = term('anyofterms');
