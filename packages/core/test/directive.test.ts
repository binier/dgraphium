// @ts-nocheck
import { query, edge } from '../src';
import { has } from '../src/operators';
import { ParamBuilder } from '../src/param';

// does not test formatting
describe('Directive test', () => {
  it('`@cascade` directive', () => {
    expect(edge({}).cascade().toString())
      .toMatch(/@cascade \{/);

    expect(
      edge({}).filter(has('name')).cascade().toString()
    ).toMatch(/@filter\(has\(name\)\) @cascade \{/);
  });

  it('`@ignoreReflex` directive', () => {
    expect(query().ignoreReflex().toString())
      .toMatch(/@ignoreReflex \{/);
  });

  it('`@recurse` directive no args', () => {
    expect(query().recurse().toString())
      .toMatch(/@recurse \{/);
  });

  it('`@recurse` directive single primitive arg', () => {
    const q = query().recurse({ loop: false });
    expect(q.toString())
      .toMatch(/@recurse\(loop: \$loop\) \{/);
    const params = q.build().params();
    expect(params[0].getValue()).toEqual('false');
  });

  it('`@recurse` directive all primitive args', () => {
    const q = query().recurse({ loop: false, depth: 5 });
    expect(q.toString())
      .toMatch(/@recurse\(loop: \$loop\, depth: \$depth\) \{/);
    const params = q.build().params();
    expect(params[0].getValue()).toEqual('false');
    expect(params[1].getValue()).toEqual('5');
  });

  it('`@recurse` directive single ParamBuilder arg', () => {
    const myQuery = query().recurse({ loop: new ParamBuilder('boolean', false, 'loop') }).build();
    const myParams = myQuery.params();

    expect(myParams[0].getValue()).toEqual('false');
    expect(myQuery.toString()).toMatch(/@recurse\(loop: \$loop\) \{/);
  });

  it('`@recurse` directive all ParamBuilder args', () => {
    const q = query().recurse({ loop: new ParamBuilder('boolean', false, 'loop'), depth: new ParamBuilder('int', 5, 'depth') });
    expect(q.toString())
      .toMatch(/@recurse\(loop: \$loop\, depth: \$depth\) \{/);
    const params = q.build().params();
    expect(params[0].getValue()).toEqual('false');
    expect(params[1].getValue()).toEqual('5');
  });
});
