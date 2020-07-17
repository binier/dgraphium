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
});
