export type TransformableFn<P, R> = (pred: P) => R;
export type Transformer<T, TT> = (arg: T) => TT;

export function transformable<A, PA, R>(
  fn: TransformableFn<PA, R>,
  args: A
) {
  return (transform: Transformer<A, PA>) => fn(transform(args));
}

/**
 * @param i start number
*/
export function* numberSeqGenerator(i = 0) {
  while (true) {
    yield ++i;
  }
}

export interface NameGen {
  next(): string;
}
export type BuildNameGen<Brand = unknown> = (startI?: number) => NameGen & Brand;

export function buildNameGen(prefix: string, startI = 0): NameGen {
  const numGen = numberSeqGenerator(startI);
  return { next: () => prefix + numGen.next().value };
}
