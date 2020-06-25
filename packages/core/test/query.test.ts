import { query } from '../src';

describe('Query test', () => {
  it('should insert queryName in stringified query', () => {
    expect(
      query('user', 'qName')
        .toString()
    ).toMatch(/qName\(.*\)/);
  });

  it('should generate queryName if not passed by user', () => {
    expect(
      query('user').toString()
    ).toMatch(/q1\(.*\)/);
  });
});
