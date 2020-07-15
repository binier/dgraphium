import { query, params, operators } from '@dgraphium/core';
import { Request } from '../src';
const { has, eq } = operators;

const newRequest = () => new Request();
const setQuery = (...args: Parameters<Request['setQuery']>) =>
  { const req = newRequest(); req.setQuery(...args); return req; }
const setQueryWithVars = (...args: Parameters<Request['setQueryWithVars']>) =>
  { const req = newRequest(); req.setQueryWithVars(...args); return req; }

describe('Request test', () => {
  it('string query should be handled normally', async () => {
    const strQuery = setQuery('str query');
    expect(strQuery.getQuery()).toEqual('str query')
    expect(strQuery.getVarsMap().getLength()).toEqual(0);
  });

  it('string query with vars should be handled normally', async () => {
    const strQuery = await setQueryWithVars(
      'str query with vars',
      { '$myVar': 'val' }
    );
    expect(strQuery.getQuery()).toEqual('str query with vars')
    expect(strQuery.getVarsMap().getLength()).toEqual(1);
    expect(strQuery.getVarsMap().get('$myVar')).toEqual('val');
  });

  it('Query obj should be stringified in Request', async () => {
    const qbQuery = await setQuery(
      query().func(has('name')).build()
    );
    expect(qbQuery.getQuery()).toMatch(/func: has\(name\)/);
    expect(qbQuery.getVarsMap().getLength()).toEqual(0);
  });

  it('Query obj with params should set VarsMap in Request', async () => {
    const qbQuery = await setQuery(
      query().func(eq('name', params.string('zura'))).build()
    );
    expect(qbQuery.getQuery()).toMatch(/func: eq\(name, \$p1\)/);
    expect(qbQuery.getVarsMap().getLength()).toEqual(1);
    expect(qbQuery.getVarsMap().get('$p1')).toEqual('zura');
  });

  it('Query obj with params should be overridable by VarsMap', async () => {
    const qWithVars = await setQueryWithVars(
      query().func(eq(
        'name',
        params.string('oldName').name('name')
      )).build(),
      { '$name': 'newName' }
    );
    expect(qWithVars.getQuery()).toMatch(/func: eq\(name, \$name\)/);
    expect(qWithVars.getVarsMap().getLength()).toEqual(1);
    expect(qWithVars.getVarsMap().get('$name')).toEqual('newName');
  });
});
