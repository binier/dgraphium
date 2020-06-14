import { ObjectOrValue } from '../ts-helpers';

export type ProjectionScalars = string | boolean | 0 | 1;
export type RawProjection<T> = ObjectOrValue<ProjectionScalars | T>;
export type Projection<T> = { [name: string]: ProjectionScalars | T };

export function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function indenter(depth = 0, indentation = '  ') {
  const prefix = indentation.repeat(depth);
  return (str = ''): string => prefix + str;
}
