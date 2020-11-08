import { edge } from '../../src';
import {
  has, type, uid, predUid, eq,
  lte, lt, gte, gt,
  allOfTerms, anyOfTerms,
  allOfText, anyOfText,
  regex, match,
} from '../../src/operators';

describe('Operator test - Raw value', () => {
  it('operator: `has`', () => {
    expect(
      edge({}).filter(has('myField')).toString()
    ).toMatch(/has\(myField\)/)
  });

  it('operator: `type`', () => {
    expect(
      edge({}).filter(type('User')).toString()
    ).toMatch(/type\(User\)/)
  });

  it('operator: `type` shouldn\'t prefix by graphql type', () => {
    expect(
      edge('gqlType', {}).filter(type('User')).toString()
    ).toMatch(/type\(User\)/);
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

    // expect(
    //   edge({}).filter(predUid('parent', ['0x2', '0x3', '0x4'])).toString()
    // ).toMatch(/uid_in\(parent, 0x2, 0x3, 0x4\)/);
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

  it('operator: `regex`', () => {
    expect(edge({}).filter(regex('name', /zura/i)).toString())
      .toMatch(/regexp\(name, \/zura\/i\)/)
  });

  it('operator: `match`', () => {
    expect(edge({}).filter(match('name', 'zura', 3)).toString())
      .toMatch(/match\(name, "zura", 3\)/)
  });
});
