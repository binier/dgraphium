export type UidLike = Uid | string | number;

const uidRegex = new RegExp(/^(0x)?[0-9a-f]{1,16}$/, 'i');

export function isValidUid(uid: UidLike) {
  switch (typeof uid) {
    case 'string': return uidRegex.test(uid);
    case 'number': return uid > 0 && Number.isSafeInteger(uid);
    default: return false;
  }
}

export class Uid {
  private val: string;

  constructor(uid: UidLike) {
    if (uid instanceof Uid)
      return new Uid(uid.val);

    if (!isValidUid(uid))
      throw Error('invalid_uid');

    if (typeof uid === 'number')
      this.val = '0x' + uid.toString(16);
    else
      this.val = uid.startsWith('0x') ? uid : ('0x' + uid);
  }

  toString() {
    return this.val;
  }
}
