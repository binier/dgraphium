import { query, edge } from '../src';
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
    expect(edge({}).recurse().toString())
      .toMatch(/@recurse \{/);
  });

  it('`@recurse` directive single arg', () => {
    expect(edge({}).recurse(true).toString())
      .toMatch(/@recurse\(loop: true\) \{/);
  });

  it('`@recurse` directive all args', () => {
    expect(edge({}).recurse(true, 5).toString())
      .toMatch(/@recurse\(loop: true, depth: 5\) \{/);
  });
});
