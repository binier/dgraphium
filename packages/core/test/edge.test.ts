import { EdgeBuilder } from '../src/edge';
import { Uid } from '../src/uid';

// does not test formatting
describe('Edge test', () => {
  it('withArgs should yield same result as individually setting args', () => {
    const edge = () => new EdgeBuilder('user', { id: 1 });
    const args = {
      first: 10,
      offset: 5,
      after: new Uid('0x1'),
    };

    expect(
      edge()
        .withArgs(args)
        .toString()
    ).toEqual(
      edge()
        .first(args.first)
        .offset(args.offset)
        .after(args.after)
        .toString()
    );
  });

  it('should stringify args correctly', () => {
    const args = {
      first: 10,
      offset: 5,
      after: new Uid('0x1'),
    };
    const edge = () => new EdgeBuilder('user', { id: 1 });
    const edgeStrWithArgs = (...toExclude: string[]) => edge().withArgs({
      ...args,
      ...toExclude.reduce((r, x) => { r[x] = undefined; return r; }, {}),
    }).toString();
    const edgeStrWithArgsFirstLine = (...toExclude: string[]) => {
      return edgeStrWithArgs(...toExclude).split('\n')[0];
    };
    const regex = (str: string) => new RegExp(`\\(${str}\\)`);

    expect(edge().toString().split('\n')[0].trim()).toEqual('{')

    expect(edgeStrWithArgsFirstLine('offset', 'after'))
      .toMatch(regex(`(first: ${args.first})`));

    expect(edgeStrWithArgsFirstLine('after'))
      .toMatch(regex(
        `(first: ${args.first})|(offset: ${args.offset})`
      ));

    expect(edgeStrWithArgsFirstLine())
      .toMatch(regex(
        `(first: ${args.first})|(offset: ${args.offset})|(after: ${args.after})`
      ));
  });

  it("should use nested edge's(!instanceof Edge) key as prefix", () => {
    expect(
      new EdgeBuilder('user', {
        id: 1,
        auth: {
          id: 1,
          sub: 1,
        },
      }).toString()
    ).toMatch(/(sub: Auth\.sub)/);
  });

  it("should use nested edge's(instanceof Edge) type as prefix", () => {
    expect(
      new EdgeBuilder('user', {
        id: 1,
        posts: new EdgeBuilder('post', {
          id: 1,
          text: 1,
        }),
      }).toString()
    ).toMatch(/(text: Post\.text)/);
  });

  it("shouldn't append prefix fields if type is undefined", () => {
    expect(
      new EdgeBuilder({
        id: 1,
        name: 1,
      }).toString()
    ).toMatch(/(name: name)/);
  });

  it('should return cloned Edge when we pass instanceof Edge as argument', () => {
    const edge = new EdgeBuilder('user', { id: 1 });
    const cloned = new EdgeBuilder('user', edge);
    edge.first(1);
    expect(cloned.toString()).not.toMatch(/(first: 1)/);
  });

  it("changes to nested edge shouldn't affect it's parent edge", () => {
    const nested = new EdgeBuilder('post', { id: 1 });
    const edge = new EdgeBuilder('user', {
      id: 1,
      post: nested,
    });
    nested.first(1);
    expect(edge.toString()).not.toMatch(/(first: 1)/);
  });
});
