import { edge } from '../../src';
import {
  uid, predUid, eq,
  regex, match,
} from '../../src/operators';
import * as params from '../../src/param/param-types';

describe('Operator test - Param value', () => {
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

  it('operator: `predUid` - single uid param', () => {
    const myEdge = edge({}).filter(predUid('parent', params.uid('0x2')));
    expect(myEdge.toString()).toMatch(/uid_in\(parent, \$p1\)/);
    expect(myEdge.build().params()[0].getValue())
      .toEqual('0x2');
  });

  // it('operator: `predUid` - multi uid in separate params', () => {
  //   const myEdge = edge({}).filter(
  //     predUid('parent', [params.uid('0x2'), params.uid('0x3')])
  //   ).build();
  //   const myParams = myEdge.params();

  //   expect(myEdge.toString()).toMatch(/uid_in\(parent, \$p1, \$p2\)/);
  //   expect(myParams[0].getValue()).toEqual('0x2');
  //   expect(myParams[1].getValue()).toEqual('0x3');
  // });

  // it('operator: `predUid` - multi uid in same param', () => {
  //   const myEdge = edge({}).filter(
  //     predUid('parent', params.uids('0x2', '0x3'))
  //   ).build();

  //   expect(myEdge.toString()).toMatch(/uid_in\(parent, \$p1\)/);
  //   expect(myEdge.params()[0].getValue()).toEqual('[0x2, 0x3]');
  // });

  it('operator: `eq` - single value param', () => {
    const myEdge = edge({}).filter(eq('name', params.string('zura')));
    expect(myEdge.toString()).toMatch(/eq\(name, \$p1\)/);
    expect(myEdge.build().params()[0].getValue()).toEqual('zura');
  });

  it('operator: `eq` - multi value in separate params', () => {
    const myEdge = edge({}).filter(
      eq('name', [params.string('zura'), params.string('someOtherDude')])
    ).build();
    const myParams = myEdge.params();

    expect(myEdge.toString()).toMatch(/eq\(name, \[\$p1, \$p2\]\)/);
    expect(myParams[0].getValue()).toEqual('zura');
    expect(myParams[1].getValue()).toEqual('someOtherDude');
  });

  it('operator: `regex`', () => {
    const myEdge = edge({}).filter(regex('name', params.regex(/zura/i)));
    expect(myEdge.toString()).toMatch(/regexp\(name, \$p1\)/);
    expect(myEdge.build().params()[0].getValue())
      .toEqual('/zura/i');
  });

  it('operator: `match`', () => {
    const myEdge = edge({}).filter(
      match('name', params.string('zur'), params.int(3))
    ).build();
    const myParams = myEdge.params();
    console.log(myParams);
    expect(myEdge.toString()).toMatch(/match\(name, \$p1, \$p2\)/);
    expect(myParams[0].getValue()).toEqual('zur');
    expect(myParams[1].getValue()).toEqual('3');
  });
});
