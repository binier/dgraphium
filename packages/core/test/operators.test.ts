import { edge } from '../src';
import { has, uid, eq } from '../src/operators';

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

  it('operator: `uid`', () => {
    expect(
      edge({}).filter(uid('0x2')).toString()
    ).toMatch(/uid\(0x2\)/);

    expect(
      edge({}).filter(uid('0x2', '0x3', '0x4')).toString()
    ).toMatch(/uid\(0x2, 0x3, 0x4\)/);
  });

  it('operator: `eq`', () => {
    expect(
      edge({}).filter(eq('name', 'zura')).toString()
    ).toMatch(/eq\(name, "zura"\)/);

    expect(
      edge({}).filter(eq('name', ['zura', 'otherDude'])).toString()
    ).toMatch(/eq\(name, \["zura", "otherDude"\]\)/);
  });
});
