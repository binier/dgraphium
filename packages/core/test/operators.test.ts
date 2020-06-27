import { edge } from '../src';
import {
  has, uid, predUid, eq,
  lte, lt, gte, gt,
  allOfTerms, anyOfTerms,
  allOfText, anyOfText,
  regexp, match,
} from '../src/operators';

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

  it('operator: `predUid`', () => {
    expect(
      edge({}).filter(predUid('parent', '0x2')).toString()
    ).toMatch(/uid_in\(parent, 0x2\)/);

    expect(
      edge({}).filter(predUid('parent', ['0x2', '0x3', '0x4'])).toString()
    ).toMatch(/uid_in\(parent, 0x2, 0x3, 0x4\)/);
  });

  it('operator: `eq`', () => {
    expect(
      edge({}).filter(eq('name', 'zura')).toString()
    ).toMatch(/eq\(name, "zura"\)/);

    expect(
      edge({}).filter(eq('name', ['zura', 'otherDude'])).toString()
    ).toMatch(/eq\(name, \["zura", "otherDude"\]\)/);
  });

  it('comparion operators: `lte`, `lt`, `gte`, `gt`', () => {
    const gen = (op: Function) => edge({}).filter(op('age', 18)).toString();
    expect(gen(lte)).toMatch(/le\(age, 18\)/);
    expect(gen(lt)).toMatch(/lt\(age, 18\)/);
    expect(gen(gte)).toMatch(/ge\(age, 18\)/);
    expect(gen(gt)).toMatch(/gt\(age, 18\)/);
  });

  it('term operators: `allOfTerms`, `anyOfTerms`', () => {
    const genSingle = (op: Function) =>
      edge({}).filter(op('animalType', 'dog')).toString();
    const genMulti = (op: Function) =>
      edge({}).filter(op('animalType', ['dog', 'cat'])).toString();

    expect(genSingle(allOfTerms))
      .toMatch(/allofterms\(animalType, "dog"\)/);
    expect(genSingle(anyOfTerms))
      .toMatch(/anyofterms\(animalType, "dog"\)/);

    expect(genMulti(allOfTerms))
      .toMatch(/allofterms\(animalType, "dog cat"\)/);
    expect(genMulti(anyOfTerms))
      .toMatch(/anyofterms\(animalType, "dog cat"\)/);
  });

  it('text operators: `allOfText`, `anyOfText`', () => {
    const genSingle = (op: Function) =>
      edge({}).filter(op('animalType', 'dog')).toString();

    expect(genSingle(allOfText))
      .toMatch(/alloftext\(animalType, "dog"\)/);
    expect(genSingle(anyOfText))
      .toMatch(/anyoftext\(animalType, "dog"\)/);
  });

  it('operator: `regexp`', () => {
    expect(edge({}).filter(regexp('name', /zura/i)).toString())
      .toMatch(/regexp\(name, \/zura\/i\)/)
  });

  it('operator: `match`', () => {
    expect(edge({}).filter(match('name', 'zura', 3)).toString())
      .toMatch(/match\(name, "zura", 3\)/)
  });
});
