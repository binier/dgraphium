import { Transformer } from '../utils';
import { OpBuilderTypes } from '../operator';
import { DirectiveArgs, Directive } from './directive';
import { extractRefs } from '../ref';

export interface DirectiveBuilderArgs {
  filter: OpBuilderTypes;
  cascade: undefined;
  ignoreReflex: undefined;
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
