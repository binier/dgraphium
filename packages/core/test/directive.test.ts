// @ts-nocheck
import { query, edge, params } from '../src';
import { has } from '../src/operators';

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
      .toMatch(/@recurse\(loop: false\) \{/);
  });

  it('`@recurse` directive all primitive args', () => {
    const q = query().recurse({ loop: false, depth: 5 });
    expect(q.toString())
      .toMatch(/@recurse\(loop: false, depth: 5\) \{/);
  });

  it('`@recurse` directive single ParamBuilder arg', () => {
    const myQuery = query().recurse({ loop: params.bool(false) }).build();
    const myParams = myQuery.params();

    expect(myParams[0].getValue()).toEqual('false');
    expect(myQuery.toString()).toMatch(/@recurse\(loop: \$p1\) \{/);
  });

  it('`@recurse` directive all ParamBuilder args', () => {
    const q = query().recurse({ loop: params.bool(false), depth: params.int(5) });
    expect(q.toString())
      .toMatch(/@recurse\(loop: \$p1, depth: \$p2\) \{/);
    const myParams = q.build().params();
    expect(myParams[0].getValue()).toEqual('false');
    expect(myParams[1].getValue()).toEqual('5');
  });
});
