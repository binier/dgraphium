import { query } from '../src';
import { min, max, sum, avg } from '../src/aggregations';

describe('Ref test', () => {
  it('min: same query', () => {
    const q = query().project(self => ({
      minAge: min(self.ref('friends', 'age')),
    }));
    const qStr = q.toString();

    expect(qStr).toMatch(/friends \{\n.*v1 as age/);
    expect(qStr).toMatch(/minAge: min\(val\(v1\)\)/);
  });

  it('max: same query', () => {
    const q = query().project(self => ({
      maxAge: max(self.ref('friends', 'age')),
    }));
    const qStr = q.toString();

    expect(qStr).toMatch(/friends \{\n.*v1 as age/);
    expect(qStr).toMatch(/maxAge: max\(val\(v1\)\)/);
  });

  it('sum: same query', () => {
    const q = query().project(self => ({
      sumLikes: sum(self.ref('posts', 'likes')),
    }));
    const qStr = q.toString();

    expect(qStr).toMatch(/posts \{\n.*v1 as likes/);
    expect(qStr).toMatch(/sumLikes: sum\(val\(v1\)\)/);
  });

  it('avg: same query', () => {
    const q = query().project(self => ({
      avgAge: avg(self.ref('friends', 'age')),
    }));
    const qStr = q.toString();

    expect(qStr).toMatch(/friends \{\n.*v1 as age/);
    expect(qStr).toMatch(/avgAge: avg\(val\(v1\)\)/);
  });

  it('aggregations on same var/ref', () => {
    const q = query().project(self => ({
      minAge: min(self.ref('friends', 'age')),
      maxAge: max(self.ref('friends', 'age')),
      sumLikes: sum(self.ref('posts', 'likes')),
      avgAge: avg(self.ref('friends', 'age')),
    }));
    const qStr = q.toString();

    expect(qStr).toMatch(/friends \{\n.*v1 as age/);

    expect(qStr).toMatch(/maxAge: max\(val\(v1\)\)/);
    expect(qStr).toMatch(/minAge: min\(val\(v1\)\)/);
    expect(qStr).toMatch(/sumLikes: sum\(val\(v2\)\)/);
    expect(qStr).toMatch(/avgAge: avg\(val\(v1\)\)/);
  })
});
