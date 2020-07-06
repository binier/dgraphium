import { combined, query, params } from '../src';
import { uid } from '../src/operators';

describe('Query test', () => {
  it('should generate queryNames', () => {
    const q = combined(
      query('user'),
      query('post')
    );
    expect(q.toString()).toMatch(/q1\(.*\)/);
    expect(q.toString()).toMatch(/q2\(.*\)/);
  });

  it('should generate unique param names', () => {
    const q = combined(
      query('user').func(uid(params.uid('0x2'))),
      query('user').func(uid(params.uid('0x3')))
    );
    expect(q.toString()).toMatch(/q1\(func: uid\(\$p1\)\)/);
    expect(q.toString()).toMatch(/q2\(func: uid\(\$p2\)\)/);
  });

  it('should reuse unique param name if same parameter', () => {
    const uidParam = params.uid('0x2');
    const q = combined(
      query('user').func(uid(uidParam)),
      query('user').func(uid(uidParam))
    );
    expect(q.toString()).toMatch(/q1\(func: uid\(\$p1\)\)/);
    expect(q.toString()).toMatch(/q2\(func: uid\(\$p1\)\)/);
  });
});
