import { Uid, UidLike, isValidUid } from '../src/uid';

const attachValOnFail = (uid: UidLike, fn: () => any) => {
  try { fn(); }
  catch (err) {
    err.message = `${err.message}\n\nPassed Uid: ${uid}`;
    throw err;
  }
};

const shouldBeInvalid = (val: UidLike) => attachValOnFail(val, () => {
  expect(isValidUid(val)).toBeFalsy();
  expect(() => new Uid(val)).toThrow();
});

const shouldBeValid = (val: UidLike) => attachValOnFail(val, () => {
  expect(isValidUid(val)).toBeTruthy();
  expect(() => new Uid(val)).not.toThrow();
});

describe('Uid test', () => {
  it('should throw if uid: number and is negative', () => {
    shouldBeInvalid(-1);
  });

  it('should throw if uid: string and is invalid', () => {
    shouldBeInvalid('0xg');
    shouldBeInvalid('xf');
    shouldBeInvalid('');
    shouldBeInvalid(' ');
  });

  it('should allow uid: string without "0x" prefix', () => {
    shouldBeValid('0');
    shouldBeValid('f');
  });
});

