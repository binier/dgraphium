import { combined, query, params } from '../src';
import { uid } from '../src/operators';

describe('Query test', () => {
  it('should generate queryNames', () => {
    const q = combined(
      query('user'),
      query('post')
    ).build();
    expect(q.toString()).toMatch(/q1\(.*\)/);
    expect(q.toString()).toMatch(/q2\(.*\)/);
  });

  it('should generate unique param names', () => {
    const q = combined(
      query('user').func(uid(params.uid('0x2'))),
      query('user').func(uid(params.uid('0x3')))
    ).build();
    expect(q.toString()).toMatch(/q1\(func: uid\(\$p1\)\)/);
    expect(q.toString()).toMatch(/q2\(func: uid\(\$p2\)\)/);
  });

  it('combining combined queries', () => {
    const uidParam1 = params.uid('0x2');
    const uidParam2 = params.uid('0x3');
    const q = combined(
      combined(
        query('user').func(uid(uidParam1)),
        query('post').func(uid(uidParam2))
      ),
      query('user').func(uid(uidParam1))
    ).build();

    expect(q.toString()).toMatch(/q1\(func: uid\(\$p1\)\)/);
    expect(q.toString()).toMatch(/q2\(func: uid\(\$p2\)\)/);
    expect(q.toString()).toMatch(/q3\(func: uid\(\$p1\)\)/);
  });

  it('should reuse unique param name if same parameter', () => {
    const uidParam = params.uid('0x2');
    const q = combined(
      query('user').func(uid(uidParam)),
      query('user').func(uid(uidParam))
    ).build();
    expect(q.toString()).toMatch(/q1\(func: uid\(\$p1\)\)/);
    expect(q.toString()).toMatch(/q2\(func: uid\(\$p1\)\)/);
  });
});
