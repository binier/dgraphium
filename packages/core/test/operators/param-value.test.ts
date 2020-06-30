import { edge } from '../../src';
import { uid } from '../../src/operators';
import * as params from '../../src/param/param-types';

describe('Operators test', () => {
  it('operator: `uid` - single uid param', () => {
    const myEdge = edge({}).filter(uid(params.uid('0x2')));
    expect(myEdge.toString()).toMatch(/uid\(\$p1\)/);
    expect(myEdge.build().params()[0].getValue())
      .toEqual('0x2');
  });

  it('operator: `uid` - multi uid in separate params', () => {
    const myEdge = edge({}).filter(
      uid(params.uid('0x2'), params.uid('0x3'))
    ).build();
    const myParams = myEdge.params();

    expect(myEdge.toString()).toMatch(/uid\(\$p1, \$p2\)/);
    expect(myParams[0].getValue()).toEqual('0x2');
    expect(myParams[1].getValue()).toEqual('0x3');
  });

  it('operator: `uid` - multi uid in same param', () => {
    const myEdge = edge({}).filter(
      uid(params.uids('0x2', '0x3'))
    ).build();

    expect(myEdge.toString()).toMatch(/uid\(\$p1\)/);
    expect(myEdge.params()[0].getValue()).toEqual('[0x2, 0x3]');
  });
});
