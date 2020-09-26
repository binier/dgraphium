import { Aggregation, AggregationTypes } from './aggregation';
import { Ref } from '../ref';

export class AggregationBuilder {
  constructor(
    private name: AggregationTypes,
    private ref: Ref
  ) { }

  refs() {
    return this.ref;
  }

  build(ref = this.ref) {
    return new Aggregation(this.name, ref.clone());
  }
}
