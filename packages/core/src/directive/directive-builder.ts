import { Transformer } from '../utils';
import { LogicalOperatorBuilder, OperatorBuilder } from '../operator';
import { DirectiveArgs, Directive } from './directive';

export interface DirectiveBuilderArgs {
  filter: LogicalOperatorBuilder | OperatorBuilder;
  cascade: undefined;
}

export class DirectiveBuilder<T extends keyof DirectiveBuilderArgs = any> {
  constructor(
    private name: T,
    private args: DirectiveBuilderArgs[T]
  ) { }

  build(transform: Transformer<DirectiveBuilderArgs[T], DirectiveArgs[T]>) {
    return new Directive(this.name, transform(this.args));
  }
}
