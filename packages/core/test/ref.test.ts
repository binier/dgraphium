import { query, edge } from '../src';
import { uid } from '../src/operators';

// does not test formatting
describe('Ref test', () => {
  it('another query uid', () => {
    const q1 = query().func(uid('0x2'));
    const q2 = query()
      .func(uid(q1))
      .filter(uid(q1))
      .project({
        id: 1,
        name: 1,
      });
    const qStr = q2.build().toString();

    expect(qStr).toMatch(/v1 as var\(func: uid\(0x2\)\)/);
    expect(qStr).toMatch(/q1\(func: uid\(v1\)\)/);
  });

  it('another query nested uid', () => {
    const q1 = query()
      .func(uid('0x2'))
      .project({
        posts: edge({}).filter(uid('0x3', '0x4', '0x5')),
      });

    const q2 = query()
      .func(uid(q1))
      .project({
        id: 1,
        name: 1,
        posts: edge({
            id: 1,
          })
          .filter(uid(q1.ref('posts'))),
      });
    const qStr = q2.build().toString();

    expect(qStr).toMatch(/v2 as var\(func: uid\(0x2\)\)/);
    expect(qStr).toMatch(/v1 as posts @filter\(uid\(0x3, 0x4, 0x5\)\)/);
    expect(qStr).toMatch(/q1\(func: uid\(v2\)\)/);
    expect(qStr).toMatch(/posts @filter\(uid\(v1\)\)/);
  });

  it('same query uid', () => {
    const q1 = query('user')
      .func(uid('0xe'))
      .project(q => ({
        posts1: edge({ id: 1 })
          .name('posts')
          .filter(uid('0x2', '0x3')),
        posts2: edge({ id: 1 })
          .name('posts')
          .filter(uid(q.ref('posts1'))),
      }));

    const qStr = q1.build().toString();

    expect(qStr).toMatch(/posts1: v1 as posts @filter\(uid\(0x2, 0x3\)\)/);
    expect(qStr).toMatch(/posts2: posts @filter\(uid\(v1\)\)/);
    expect(qStr).toMatch(/q1\(func: uid\(0xe\)\)/);
  });
});
