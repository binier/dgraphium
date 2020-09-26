import { Ref } from './ref';
import { AggregationBuilder } from './aggregation';

export const min = (ref: Ref) => new AggregationBuilder('min', ref);
export const max = (ref: Ref) => new AggregationBuilder('max', ref);
export const sum = (ref: Ref) => new AggregationBuilder('sum', ref);
export const avg = (ref: Ref) => new AggregationBuilder('avg', ref);
