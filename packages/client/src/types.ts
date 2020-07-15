export type PopFirstArg<F extends Function> =
  F extends (x: any, ...args: infer U) => any
    ? (...args: U) => ReturnType<F> : never;
export type PoppedFnArgs<F extends Function> = Parameters<PopFirstArg<F>>;

export interface Param {
  getName(): string;
  getValue(): any;
}

export interface Query {
  toString(): string;
  params(): Param[];
}
