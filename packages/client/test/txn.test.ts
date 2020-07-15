import { query, params, operators } from '@dgraphium/core';
import { Txn, Request, DgraphClient } from '../src';
const { has, eq } = operators;

const newTxn = () => new DgraphClient({} as any).newTxn();
const txnQuery = (...args: Parameters<Txn['query']>) =>
  newTxn().query(...args) as unknown as Promise<Request>;
const txnQueryWithVars = (...args: Parameters<Txn['queryWithVars']>) =>
  newTxn().queryWithVars(...args) as unknown as Promise<Request>;

describe('Txn test', () => {
  beforeAll(() => {
    Txn.prototype.doRequest = jest.fn(req => req as any);
  });

  it('string query should be handled normally', async () => {
    const strQuery = await txnQuery('str query');
    expect(strQuery.getQuery()).toEqual('str query')
    expect(strQuery.getVarsMap().getLength()).toEqual(0);
  });

  it('string query with vars should be handled normally', async () => {
    const strQuery = await txnQueryWithVars(
      'str query with vars',
      { '$myVar': 'val' }
    );
    expect(strQuery.getQuery()).toEqual('str query with vars')
    expect(strQuery.getVarsMap().getLength()).toEqual(1);
    expect(strQuery.getVarsMap().get('$myVar')).toEqual('val');
  });

  it('Query obj should be stringified in Request', async () => {
    const qbQuery = await txnQuery(
      query().func(has('name')).build()
    );
    expect(qbQuery.getQuery()).toMatch(/func: has\(name\)/);
    expect(qbQuery.getVarsMap().getLength()).toEqual(0);
  });

  it('Query obj with params should set VarsMap in Request', async () => {
    const qbQuery = await txnQuery(
      query().func(eq('name', params.string('zura'))).build()
    );
    expect(qbQuery.getQuery()).toMatch(/func: eq\(name, \$p1\)/);
    expect(qbQuery.getVarsMap().getLength()).toEqual(1);
    expect(qbQuery.getVarsMap().get('$p1')).toEqual('zura');
  });

  it('Query obj with params should be overridable by VarsMap', async () => {
    const qWithVars = await txnQueryWithVars(
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
