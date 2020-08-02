import { Ref } from './ref';

export function extractRefs(obj: any): Ref[] {
  if (!obj) return [];
  if (typeof obj['refs'] === 'function')
    return obj.refs();
  if (Array.isArray(obj))
    return obj.reduce((r, x) => r.concat(extractRefs(x)), []);
  if (typeof obj === 'object')
    return extractRefs(Object.values(obj));
  return [];
}
