---
to: 'packages/<%= name %>/test/index.test.ts'
---
import { DummyClass } from '../src/index';

describe('Dummy test', () => {
  it('works if true is truthy', () => {
    expect(true).toBeTruthy();
  });

  it('DummyClass is instantiable', () => {
    expect(new DummyClass()).toBeInstanceOf(DummyClass);
  });
});
