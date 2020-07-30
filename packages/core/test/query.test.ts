import { query, EdgeBuilder } from '../src';

function edgesToObject(q: EdgeBuilder) {
  return Object.entries(q['edges'])
    .reduce((r, [k, v]) => {
      if (v instanceof EdgeBuilder)
        return { ...r, [k]: edgesToObject(v) };
      r[k] = v;
      return r;
    }, {});
}

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

  it('query.project should deep merge projections by default', () => {
    const q = query()
      .project({
        a: 1,
        b: {
          c: 1,
          d: 1,
        },
      })
      .project({
        a: 0,
        b: {
          c: 0,
        },
      });

    expect(edgesToObject(q)).toMatchObject({
      a: 0,
      b: {
        c: 0,
        d: 1,
      },
    });
  });

  it('query.project should overwrite projections if flag is true', () => {
    const q = query()
      .project({
        a: 1,
        b: {
          c: 1,
          d: 1,
        },
      })
      .project({
        a: 0,
      }, true);

    const edges = edgesToObject(q);

    expect(edges.a).toEqual(0);
    expect(edges.b).toEqual(undefined)
  });
});
