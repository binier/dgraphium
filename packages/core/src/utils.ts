export type TransformableFn<P, R> = (pred: P) => R;
export type Transformer<T, TT> = (arg: T) => TT;

export function transformable<A, PA, R>(
  fn: TransformableFn<PA, R>,
  args: A
) {
  return (transform: Transformer<A, PA>) => fn(transform(args));
}

