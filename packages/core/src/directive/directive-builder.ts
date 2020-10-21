import { Transformer } from '../utils';
import { LogicalOperatorBuilder, OperatorBuilder } from '../operator';
import { DirectiveArgs, Directive } from './directive';
import { extractRefs } from '../ref';
import { RecurseBuilder } from './recurse'

export interface DirectiveBuilderArgs {
  filter: LogicalOperatorBuilder | OperatorBuilder;
  cascade: undefined;
  ignoreReflex: undefined;
  recurse: RecurseBuilder | undefined;
}

export class DirectiveBuilder<T extends keyof DirectiveBuilderArgs = any> {
  constructor(
    private name: T,
    private args: DirectiveBuilderArgs[T]
  ) { }

  refs() {
    return extractRefs(this.args);
  }

  build(transform: Transformer<DirectiveBuilderArgs[T], DirectiveArgs[T]>) {
    return new Directive(this.name, transform(this.args));
  }
}
