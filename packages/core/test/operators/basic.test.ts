import { edge } from '../../src';
import { has } from '../../src/operators';

describe('Operators test', () => {
  it('should not prefix by type if edge has none', () => {
    expect(
      edge({}).filter(has('myField')).toString()
    ).toMatch(/has\(myField\)/)
  });

  it('should prefix by type if edge has one', () => {
    expect(
      edge('myType', {}).filter(has('myField')).toString()
    ).toMatch(/has\(MyType\.myField\)/)
  });
});
