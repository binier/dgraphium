import { Ref } from '../ref';

export type AggregationTypes = 'min' | 'max' | 'sum' | 'avg';

export class Aggregation {
  constructor(
    private name: AggregationTypes,
    private ref: Ref
  ) { }

  toString() {
    return `${this.name}(val(${this.ref.name}))`;
  }
}
